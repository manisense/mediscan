import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';

const PrivacyPolicyScreen: React.FC<RootStackScreenProps<'PrivacyPolicy'>> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Privacy Policy
        </Text>
        <Text variant="bodySmall" style={styles.lastUpdated}>
          Last Updated: March 7, 2023
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          1. Introduction
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Welcome to MedScan. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you use our application and tell you about your privacy rights and how the law protects you.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          2. Data We Collect
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Identity Data: includes first name, last name, username or similar identifier.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Contact Data: includes email address and telephone numbers.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Technical Data: includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this application.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Usage Data: includes information about how you use our application.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Health Data: includes information about medications you scan or save.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          3. How We Use Your Data
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Where we need to perform the contract we are about to enter into or have entered into with you.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Where we need to comply with a legal obligation.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          4. Data Security
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          5. Data Retention
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          6. Your Legal Rights
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Request access to your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Request correction of your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Request erasure of your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Object to processing of your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Request restriction of processing your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Request transfer of your personal data.
        </Text>
        <Text variant="bodyMedium" style={styles.bulletPoint}>
          • Right to withdraw consent.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          7. Contact Us
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Email: privacy@medscan.com
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Address: 123 Main Street, Anytown, USA 12345
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
    paddingBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastUpdated: {
    marginBottom: 24,
    opacity: 0.7,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  bulletPoint: {
    marginLeft: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen; 