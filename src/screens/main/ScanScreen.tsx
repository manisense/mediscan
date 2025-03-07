import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Card, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanScreen: React.FC<MainTabScreenProps<'Scan'>> = () => {
  const theme = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleScanOption = (scanType: 'barcode' | 'pill' | 'imprint') => {
    // Temporarily show an alert instead of navigating to the camera screen
    Alert.alert(
      'Feature Coming Soon',
      'The scanning functionality is currently being updated. Please check back later.',
      [{ text: 'OK' }]
    );
    
    // Uncomment this when camera is working
    // navigation.navigate('Camera', { scanType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Scan Medicine
        </Text>
        <Text style={styles.subtitle}>
          Choose a scanning method
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleScanOption('barcode')}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="barcode" size={40} color="#000" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Barcode
            </Text>
            <Text style={styles.optionDescription}>
              Scan medication barcode for instant identification
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9e9e9e" />
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleScanOption('pill')}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="camera" size={40} color="#000" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Pill Image
            </Text>
            <Text style={styles.optionDescription}>
              Take a photo of the pill to identify by shape and color
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9e9e9e" />
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleScanOption('imprint')}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="text" size={40} color="#000" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Pill Imprint
            </Text>
            <Text style={styles.optionDescription}>
              Scan the imprint code on the pill for precise identification
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9e9e9e" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle" size={24} color={theme.colors.primary} style={styles.infoIcon} />
        <Text style={styles.infoText}>
          For best results, ensure good lighting and a clear view of the medication.
        </Text>
      </View>

      <View style={styles.recentScansContainer}>
        <Text style={styles.recentScansTitle}>Recent Scans</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'History' })}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for recent scans - in a real app, this would be populated from the database */}
      <View style={styles.emptyScansContainer}>
        <Ionicons name="scan-outline" size={48} color="#9e9e9e" />
        <Text style={styles.emptyScansText}>No recent scans</Text>
        <Text style={styles.emptyScansSubtext}>Your recent scans will appear here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#757575',
  },
  divider: {
    marginHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0d47a1',
  },
  recentScansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentScansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196f3',
  },
  emptyScansContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
  },
  emptyScansText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyScansSubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ScanScreen; 