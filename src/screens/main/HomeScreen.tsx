import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Searchbar, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { DatabaseService } from '../../database/database.service';
import { AuthService } from '../../services/auth.service';
import { Tables } from '../../database/schema';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({ navigation: tabNavigation }) => {
  const navigation = useNavigation<RootNavigationProp>();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [savedMedications, setSavedMedications] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Get user profile
        const user = await AuthService.getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        const profile = await DatabaseService.getUserProfile(user.id);
        
        if (profile) {
          setUserName(profile.first_name || 'User');
          
          // Get saved medications
          const medications = await DatabaseService.getUserSavedMedications(user.id);
          setSavedMedications(medications);
          
          // Get recent scans
          const scans = await DatabaseService.getUserScanHistory(user.id);
          setRecentScans(scans.slice(0, 5)); // Get only the 5 most recent scans
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleSearch = () => {
    // Navigate to search results
    console.log('Search for:', searchQuery);
  };

  const handleScanPress = () => {
    tabNavigation.navigate('Scan');
  };

  const handleMedicationPress = (medicationId: string) => {
    navigation.navigate('MedicationDetail', { medicationId });
  };

  const handleEmergencyCall = () => {
    // In a real app, this would initiate a phone call to emergency services
    console.log('Emergency call initiated');
  };

  const handleFindDoctor = () => {
    // Navigate to find doctor screen
    console.log('Navigate to find doctor');
  };

  const handleMyMedicines = () => {
    // Navigate to my medicines screen
    tabNavigation.navigate('History');
  };

  const handleHistory = () => {
    // Navigate to history screen
    tabNavigation.navigate('History');
  };

  const handleSettings = () => {
    // Navigate to settings screen
    navigation.navigate('Settings');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Function to determine if a medication is expired
  const isMedicationExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return today > expiry;
  };

  // Function to format date to "Oct 15, 2023" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and Header */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>logo</Text>
        </View>

        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Namaste! How can we help you today?
          </Text>
        </View>

        {/* Main Action Buttons */}
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={handleScanPress}
        >
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.scanButtonText}>Scan Medicine</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
        >
          <Ionicons name="search-outline" size={24} color="#000" />
          <Text style={styles.searchButtonText}>Search Medicine</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={handleEmergencyCall}
        >
          <Ionicons name="call-outline" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>Emergency Helpline</Text>
        </TouchableOpacity>

        {/* Recent Scans Section */}
        {recentScans.length > 0 && (
          <View style={styles.recentScansSection}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            
            {recentScans.map((scan, index) => {
              // For demo purposes, let's create some sample data
              const medicationName = scan.result?.name || 'Unknown Medication';
              const dosage = scan.result?.dosage || '';
              const scanDate = formatDate(scan.created_at);
              const isExpired = isMedicationExpired(scan.result?.expiry_date);
              const expiryDate = scan.result?.expiry_date ? 
                `${isExpired ? 'Expired' : 'Valid until'} ${new Date(scan.result.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 
                '';
              
              return (
                <TouchableOpacity
                  key={scan.id}
                  onPress={() => 
                    scan.medication_id 
                      ? handleMedicationPress(scan.medication_id)
                      : navigation.navigate('ScanResult', { 
                          scanData: scan.scan_data, 
                          scanType: scan.scan_type 
                        })
                  }
                >
                  <Card style={styles.scanCard}>
                    <Card.Content style={styles.scanCardContent}>
                      <View style={styles.medicationImageContainer}>
                        {/* Placeholder for medication image */}
                        <View style={styles.medicationImagePlaceholder} />
                      </View>
                      <View style={styles.scanInfo}>
                        <Text style={styles.medicationName}>
                          {medicationName} {dosage}
                        </Text>
                        <Text style={styles.scanDate}>
                          Scanned on {scanDate}
                        </Text>
                        <Text style={[
                          styles.expiryDate, 
                          isExpired ? styles.expiredText : styles.validText
                        ]}>
                          {expiryDate}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={handleFindDoctor}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="people" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>Find Doctor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={handleMyMedicines}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="medical" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>My Medicines</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={handleHistory}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="time" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={handleSettings}
            >
              <View style={styles.quickAccessIconContainer}>
                <Ionicons name="settings" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoText: {
    fontFamily: 'cursive',
    fontSize: 28,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emergencyButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recentScansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationImageContainer: {
    marginRight: 16,
  },
  medicationImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  scanInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
  },
  validText: {
    color: '#4caf50',
  },
  expiredText: {
    color: '#f44336',
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickAccessIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 