import React from 'react';
import { View, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { Text, Card, Button, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';

const AboutScreen: React.FC<RootStackScreenProps<'About'>> = ({ navigation }) => {
  const theme = useTheme();

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@medscan.com');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://medscan.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineMedium" style={styles.appName}>
            MedScan
          </Text>
          <Text variant="bodyLarge" style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              About MedScan
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              MedScan is a medication identification application that helps users identify pills and medications through various scanning methods. The app uses advanced machine learning and image recognition technology to provide accurate information about medications.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Features
            </Text>
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={styles.featureTitle}>
                • Pill Identification
              </Text>
              <Text variant="bodyMedium" style={styles.featureDescription}>
                Identify pills by shape, color, and imprint
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={styles.featureTitle}>
                • Barcode Scanning
              </Text>
              <Text variant="bodyMedium" style={styles.featureDescription}>
                Scan medication barcodes for instant information
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={styles.featureTitle}>
                • Medication Database
              </Text>
              <Text variant="bodyMedium" style={styles.featureDescription}>
                Access a comprehensive database of medications
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text variant="bodyMedium" style={styles.featureTitle}>
                • Medication History
              </Text>
              <Text variant="bodyMedium" style={styles.featureDescription}>
                Keep track of your scanned and saved medications
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Legal
            </Text>
            <Button
              mode="text"
              onPress={handlePrivacyPolicy}
              style={styles.legalButton}
            >
              Privacy Policy
            </Button>
            <Divider />
            <Button
              mode="text"
              onPress={handleTermsOfService}
              style={styles.legalButton}
            >
              Terms of Service
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Contact
            </Text>
            <Button
              mode="text"
              onPress={handleContactSupport}
              style={styles.contactButton}
              icon="email-outline"
            >
              Contact Support
            </Button>
            <Button
              mode="text"
              onPress={handleVisitWebsite}
              style={styles.contactButton}
              icon="web"
            >
              Visit Website
            </Button>
          </Card.Content>
        </Card>

        <Text variant="bodySmall" style={styles.copyright}>
          © 2023 MedScan. All rights reserved.
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
  scrollContent: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: 'bold',
  },
  featureDescription: {
    opacity: 0.7,
    marginLeft: 16,
  },
  legalButton: {
    justifyContent: 'flex-start',
  },
  contactButton: {
    justifyContent: 'flex-start',
  },
  copyright: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.5,
  },
});

export default AboutScreen; 