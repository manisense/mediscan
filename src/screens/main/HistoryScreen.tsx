import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Divider, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { DatabaseService } from '../../database/database.service';
import { AuthService } from '../../services/auth.service';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type RootNavigationProp = StackNavigationProp<RootStackParamList>;

const HistoryScreen: React.FC<MainTabScreenProps<'History'>> = () => {
  const theme = useTheme();
  const navigation = useNavigation<RootNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [savedMedications, setSavedMedications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'scans' | 'saved'>('scans');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        
        // Get user
        const user = await AuthService.getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Get scan history
        const scans = await DatabaseService.getUserScanHistory(user.id);
        setScanHistory(scans);
        
        // Get saved medications
        const medications = await DatabaseService.getUserSavedMedications(user.id);
        setSavedMedications(medications);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  const handleMedicationPress = (medicationId: string) => {
    navigation.navigate('MedicationDetail', { medicationId });
  };

  const handleScanPress = (scan: any) => {
    if (scan.medication_id) {
      handleMedicationPress(scan.medication_id);
    } else {
      navigation.navigate('ScanResult', { 
        scanData: scan.scan_data, 
        scanType: scan.scan_type 
      });
    }
  };

  const renderScanItem = ({ item }: { item: any }) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <TouchableOpacity onPress={() => handleScanPress(item)}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  {item.scan_type === 'barcode' ? 'Barcode Scan' : 
                   item.scan_type === 'pill' ? 'Pill Scan' : 'Text Scan'}
                </Text>
                <Text variant="bodyMedium" style={styles.cardDate}>
                  {formattedDate} at {formattedTime}
                </Text>
              </View>
              <Chip 
                mode="outlined" 
                style={[
                  styles.statusChip,
                  { borderColor: item.is_successful ? theme.colors.primary : theme.colors.error }
                ]}
              >
                {item.is_successful ? 'Success' : 'Failed'}
              </Chip>
            </View>
            
            {item.medication_id && (
              <View style={styles.medicationInfo}>
                <Text variant="bodyMedium">
                  Identified: {item.result?.name || 'Unknown medication'}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderSavedItem = ({ item }: { item: any }) => {
    const medication = item.medication;
    
    return (
      <TouchableOpacity onPress={() => handleMedicationPress(medication.id)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {medication.name}
            </Text>
            
            <Divider style={styles.divider} />
            
            <View style={styles.medicationDetails}>
              {medication.dosage && (
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Dosage:
                  </Text>
                  <Text variant="bodyMedium">
                    {medication.dosage}
                  </Text>
                </View>
              )}
              
              {medication.manufacturer && (
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Manufacturer:
                  </Text>
                  <Text variant="bodyMedium">
                    {medication.manufacturer}
                  </Text>
                </View>
              )}
              
              {item.notes && (
                <View style={styles.detailItem}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Notes:
                  </Text>
                  <Text variant="bodyMedium">
                    {item.notes}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          History
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'scans' && { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('scans')}
        >
          <Text
            variant="titleMedium"
            style={[
              styles.tabText,
              activeTab === 'scans' && { color: theme.colors.primary }
            ]}
          >
            Scan History
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'saved' && { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('saved')}
        >
          <Text
            variant="titleMedium"
            style={[
              styles.tabText,
              activeTab === 'saved' && { color: theme.colors.primary }
            ]}
          >
            Saved Medications
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'scans' ? (
        scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory}
            renderItem={renderScanItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="scan-outline" size={64} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Scan History
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Your scan history will appear here
            </Text>
          </View>
        )
      ) : (
        savedMedications.length > 0 ? (
          <FlatList
            data={savedMedications}
            renderItem={renderSavedItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Saved Medications
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Your saved medications will appear here
            </Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDate: {
    opacity: 0.7,
  },
  statusChip: {
    height: 28,
  },
  medicationInfo: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  medicationDetails: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default HistoryScreen; 