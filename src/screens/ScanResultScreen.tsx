import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, useTheme, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';
import { OpenFdaService } from '../api/openFda.service';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../services/auth.service';

const ScanResultScreen: React.FC<RootStackScreenProps<'ScanResult'>> = ({ navigation, route }) => {
  const { scanData, scanType } = route.params;
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [medicationInfo, setMedicationInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processScanData = async () => {
      try {
        setLoading(true);
        
        if (scanType === 'barcode') {
          // Process barcode data
          const { data } = scanData;
          
          if (data.match(/^[0-9]{10,13}$/)) {
            // This is likely an NDC or UPC/EAN code
            const result = await OpenFdaService.searchByNdc(data);
            if (result) {
              setMedicationInfo(OpenFdaService.formatMedicationData(result));
            } else {
              setError('No medication found with this barcode.');
            }
          } else {
            // Try to search by name as fallback
            const results = await OpenFdaService.searchByName(data);
            if (results && results.length > 0) {
              setMedicationInfo(OpenFdaService.formatMedicationData(results[0]));
            } else {
              setError('No medication found with this barcode.');
            }
          }
        } else if (scanType === 'pill') {
          // Process pill image data
          const { color, shape, labels, imageUri } = scanData;
          
          // If we already have medication info in the scan data, use it
          if (scanData.result && scanData.result.name && scanData.result.name !== 'Unknown Pill') {
            setMedicationInfo(scanData.result);
          } else {
            // Otherwise, create a basic info object
            setMedicationInfo({
              name: 'Unknown Pill',
              color: color || 'Unknown',
              shape: shape || 'Unknown',
              attributes: labels || [],
              matchConfidence: 'Low',
              imageUri: imageUri
            });
          }
        } else if (scanType === 'imprint') {
          // Process imprint data
          const { imprint, fullText, imageUri } = scanData;
          
          // If we already have medication info in the scan data, use it
          if (scanData.result && scanData.result.name && scanData.result.name !== 'Unknown Pill') {
            setMedicationInfo(scanData.result);
          } else if (imprint) {
            // Try to search for the medication by imprint
            const results = await OpenFdaService.searchGeneric(imprint, 1);
            if (results && results.length > 0) {
              const medicationData = OpenFdaService.formatMedicationData(results[0]);
              medicationData.imprint = imprint;
              setMedicationInfo(medicationData);
            } else {
              // If no results, create a basic info object
              setMedicationInfo({
                name: 'Unknown Pill',
                imprint: imprint,
                fullText: fullText,
                matchConfidence: 'Low',
                imageUri: imageUri
              });
            }
          } else {
            setError('No imprint could be detected on this pill.');
          }
        }
      } catch (error) {
        console.error('Error processing scan data:', error);
        setError('An error occurred while processing the scan data.');
      } finally {
        setLoading(false);
      }
    };
    
    processScanData();
  }, [scanData, scanType]);

  const handleSaveResult = async () => {
    try {
      // Save the medication to the user's saved medications
      const user = await AuthService.getCurrentUser();
      if (user && medicationInfo) {
        // In a real app, you would first save the medication to the medications table
        // and then save the reference to the user's saved medications
        
        // For now, we'll just show a success message
        console.log('Medication saved:', medicationInfo);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const handleScanAgain = () => {
    navigation.navigate('Camera', { scanType: scanType as 'barcode' | 'pill' | 'imprint' });
  };

  const renderBarcodeResult = () => {
    if (!medicationInfo) return null;
    
    return (
      <View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Name:</Text>
          <Text>{medicationInfo.name || 'Unknown'}</Text>
        </View>
        
        {medicationInfo.genericName && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Generic Name:</Text>
            <Text>{medicationInfo.genericName}</Text>
          </View>
        )}
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Manufacturer:</Text>
          <Text>{medicationInfo.manufacturer || 'Unknown'}</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>NDC:</Text>
          <Text>{medicationInfo.ndc || scanData.data || 'Unknown'}</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Dosage:</Text>
          <Text>{medicationInfo.dosage || 'Unknown'}</Text>
        </View>
        
        {medicationInfo.dosage_forms && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Dosage Form:</Text>
            <Text>{medicationInfo.dosage_forms}</Text>
          </View>
        )}
        
        {medicationInfo.route && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Route:</Text>
            <Text>{medicationInfo.route}</Text>
          </View>
        )}
        
        {medicationInfo.active_ingredients && medicationInfo.active_ingredients.length > 0 && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Active Ingredients:</Text>
            <Text>{medicationInfo.active_ingredients.join(', ')}</Text>
          </View>
        )}
        
        {medicationInfo.indications && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionSubtitle}>Indications & Usage:</Text>
            <Text style={styles.paragraphText}>{medicationInfo.indications}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderPillImageResult = () => {
    if (!medicationInfo) return null;
    
    return (
      <View>
        {scanData.imageUri && (
          <Image source={{ uri: scanData.imageUri }} style={styles.pillImage} />
        )}
        
        {medicationInfo.name && medicationInfo.name !== 'Unknown Pill' && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Name:</Text>
            <Text>{medicationInfo.name}</Text>
          </View>
        )}
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Color:</Text>
          <Text>{medicationInfo.color || 'Unknown'}</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Shape:</Text>
          <Text>{medicationInfo.shape || 'Unknown'}</Text>
        </View>
        
        {medicationInfo.attributes && medicationInfo.attributes.length > 0 && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Detected Attributes:</Text>
            <Text>{medicationInfo.attributes.join(', ')}</Text>
          </View>
        )}
        
        {medicationInfo.active_ingredients && medicationInfo.active_ingredients.length > 0 && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Active Ingredients:</Text>
            <Text>{medicationInfo.active_ingredients.join(', ')}</Text>
          </View>
        )}
        
        {medicationInfo.dosage && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Dosage:</Text>
            <Text>{medicationInfo.dosage}</Text>
          </View>
        )}
        
        {medicationInfo.manufacturer && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Manufacturer:</Text>
            <Text>{medicationInfo.manufacturer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderImprintResult = () => {
    if (!medicationInfo) return null;
    
    return (
      <View>
        {scanData.imageUri && (
          <Image source={{ uri: scanData.imageUri }} style={styles.pillImage} />
        )}
        
        {medicationInfo.name && medicationInfo.name !== 'Unknown Pill' && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Name:</Text>
            <Text>{medicationInfo.name}</Text>
          </View>
        )}
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Detected Imprint:</Text>
          <Text>{medicationInfo.imprint || 'None detected'}</Text>
        </View>
        
        {medicationInfo.active_ingredients && medicationInfo.active_ingredients.length > 0 && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Active Ingredients:</Text>
            <Text>{medicationInfo.active_ingredients.join(', ')}</Text>
          </View>
        )}
        
        {medicationInfo.dosage && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Dosage:</Text>
            <Text>{medicationInfo.dosage}</Text>
          </View>
        )}
        
        {medicationInfo.manufacturer && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Manufacturer:</Text>
            <Text>{medicationInfo.manufacturer}</Text>
          </View>
        )}
        
        <View style={styles.resultSection}>
          <Text style={styles.sectionSubtitle}>Full Detected Text:</Text>
          <Text style={styles.codeText}>{medicationInfo.fullText || scanData.fullText || 'None detected'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Scan Results
            </Text>
            
            <View style={styles.scanTypeContainer}>
              <Text variant="bodyLarge">
                Scan Type: {scanType === 'barcode' ? 'Barcode' : scanType === 'pill' ? 'Pill Image' : 'Pill Imprint'}
              </Text>
              {medicationInfo && medicationInfo.matchConfidence && (
                <Text variant="bodyMedium" style={styles.confidence}>
                  Match Confidence: {typeof medicationInfo.matchConfidence === 'number' 
                    ? `${medicationInfo.matchConfidence}%` 
                    : medicationInfo.matchConfidence}
                </Text>
              )}
            </View>
            
            <Divider style={styles.divider} />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Processing scan data...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.resultSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Medication Information
                </Text>
                
                {scanType === 'barcode' && renderBarcodeResult()}
                {scanType === 'pill' && renderPillImageResult()}
                {scanType === 'imprint' && renderImprintResult()}
              </View>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          {!loading && !error && (
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSaveResult}
            >
              Save Medication
            </Button>
          )}
          
          <Button
            mode="outlined"
            style={styles.button}
            onPress={handleScanAgain}
          >
            Scan Again
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanTypeContainer: {
    marginBottom: 8,
  },
  confidence: {
    marginTop: 4,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  resultLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 120,
  },
  pillImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  paragraphText: {
    marginBottom: 16,
    lineHeight: 20,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontSize: 12,
  },
});

export default ScanResultScreen; 