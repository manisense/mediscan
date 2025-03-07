import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreenProps } from '../../navigation/types';

const WelcomeScreen: React.FC<AuthScreenProps<'Welcome'>> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineLarge" style={styles.title}>
          MedScan
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Identify medications quickly and safely
        </Text>
      </View>

      <View style={styles.featureContainer}>
        <FeatureItem
          icon="pill"
          title="Pill Identification"
          description="Identify pills by shape, color, and imprint"
        />
        <FeatureItem
          icon="barcode-scan"
          title="Barcode Scanning"
          description="Scan medication barcodes for instant information"
        />
        <FeatureItem
          icon="database"
          title="Comprehensive Database"
          description="Access detailed medication information"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={() => navigation.navigate('Login')}
        >
          Sign in with Email
        </Button>
      </View>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <Text variant="titleMedium" style={styles.featureTitle}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.featureDescription}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  featureContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  featureItem: {
    marginBottom: 24,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    opacity: 0.7,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default WelcomeScreen; 