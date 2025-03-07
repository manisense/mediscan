import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, List, Divider, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { AuthService } from '../../services/auth.service';
import { Tables } from '../../database/schema';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type RootNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = () => {
  const theme = useTheme();
  const navigation = useNavigation<RootNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Tables<'user_profiles'> | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await AuthService.getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await AuthService.signOut();
              // Navigate to auth stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getInitials = () => {
    if (!profile) return '?';
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (!firstName && !lastName) return '?';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {profile?.first_name || ''} {profile?.last_name || ''}
          </Text>
          <Text variant="bodyLarge" style={styles.phoneNumber}>
            {profile?.phone_number || 'No phone number'}
          </Text>
          <Button
            mode="outlined"
            style={styles.editButton}
            onPress={() => navigation.navigate('Settings')}
          >
            Edit Profile
          </Button>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Account
          </Text>
          <List.Item
            title="Personal Information"
            left={(props) => <List.Icon {...props} icon="account-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />
          <Divider />
          <List.Item
            title="Notification Settings"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />
          <Divider />
          <List.Item
            title="Privacy Settings"
            left={(props) => <List.Icon {...props} icon="shield-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Support
          </Text>
          <List.Item
            title="Help Center"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('About')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <Divider />
          <List.Item
            title="About"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('About')}
          />
        </View>

        <Button
          mode="outlined"
          style={styles.signOutButton}
          textColor={theme.colors.error}
          onPress={handleSignOut}
        >
          Sign Out
        </Button>

        <Text variant="bodySmall" style={styles.versionText}>
          Version 1.0.0
        </Text>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phoneNumber: {
    opacity: 0.7,
    marginBottom: 16,
  },
  editButton: {
    borderRadius: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  signOutButton: {
    marginBottom: 16,
  },
  versionText: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 16,
  },
});

export default ProfileScreen; 