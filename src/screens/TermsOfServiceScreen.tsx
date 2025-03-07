import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';

const TermsOfServiceScreen: React.FC<RootStackScreenProps<'TermsOfService'>> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms of Service
        </Text>
        <Text variant="bodySmall" style={styles.lastUpdated}>
          Last Updated: March 7, 2023
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          1. Acceptance of Terms
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          By accessing or using the MedScan application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          2. Medical Disclaimer
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          MedScan is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          The information provided by MedScan is for informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the application or the information, products, services, or related graphics contained in the application for any purpose.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          3. User Accounts
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our application.
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          You are responsible for safeguarding the password that you use to access the application and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          4. Intellectual Property
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          The application and its original content, features, and functionality are and will remain the exclusive property of MedScan and its licensors. The application is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MedScan.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          5. User Content
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Our application may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the application, including its legality, reliability, and appropriateness.
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          By posting content to the application, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the application. You retain any and all of your rights to any content you submit, post, or display on or through the application and you are responsible for protecting those rights.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          6. Termination
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the application will immediately cease.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          7. Limitation of Liability
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          In no event shall MedScan, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the application; (ii) any conduct or content of any third party on the application; (iii) any content obtained from the application; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          8. Changes to Terms
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          9. Contact Us
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at:
        </Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          Email: legal@medscan.com
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
});

export default TermsOfServiceScreen; 