import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../constants/theme';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Import screens
import MedicationDetailScreen from '../screens/MedicationDetailScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import CameraScreen from '../screens/CameraScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';

// Import services
import { AuthService } from '../services/auth.service';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const authenticated = await AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // You could return a loading screen here
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName={isAuthenticated ? 'Main' : 'Auth'}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="MedicationDetail" 
              component={MedicationDetailScreen} 
              options={{ 
                headerShown: true,
                title: 'Medication Details',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="ScanResult" 
              component={ScanResultScreen} 
              options={{ 
                headerShown: true,
                title: 'Scan Results',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen} 
              options={{ 
                headerShown: false,
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ 
                headerShown: true,
                title: 'Settings',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen} 
              options={{ 
                headerShown: true,
                title: 'About',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="PrivacyPolicy" 
              component={PrivacyPolicyScreen} 
              options={{ 
                headerShown: true,
                title: 'Privacy Policy',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="TermsOfService" 
              component={TermsOfServiceScreen} 
              options={{ 
                headerShown: true,
                title: 'Terms of Service',
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default RootNavigator; 