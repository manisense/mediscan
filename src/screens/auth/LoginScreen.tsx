import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme, HelperText, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreenProps } from '../../navigation/types';
import { AuthService } from '../../services/auth.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation: authNavigation }) => {
  const rootNavigation = useNavigation<RootNavigationProp>();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async () => {
    // Validate email and password
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      
      if (isSignUp) {
        // Sign up
        result = await AuthService.signUp(email, password);
        
        if (result.success) {
          setSuccess('Account created successfully! Please check your email for verification.');
        } else {
          setError(result.message);
        }
      } else {
        // Sign in
        result = await AuthService.signIn(email, password);
        
        if (result.success) {
          // Navigate to main app
          rootNavigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text variant="headlineMedium" style={styles.title}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              {isSignUp 
                ? 'Create a new account to use MedScan' 
                : 'Sign in to your MedScan account'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="your.email@example.com"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              error={!!error}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              placeholder="Your password"
              left={<TextInput.Icon icon="lock" />}
              style={styles.input}
              error={!!error}
            />
            
            {error && <HelperText type="error">{error}</HelperText>}
            {success && <HelperText type="info" style={styles.successText}>{success}</HelperText>}

            <Button
              mode="contained"
              onPress={handleAuth}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            
            <Divider style={styles.divider} />
            
            <Button
              mode="text"
              onPress={toggleAuthMode}
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : 'Don\'t have an account? Sign Up'}
            </Button>
            
            {__DEV__ && (
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('Testing Supabase configuration...');
                  AuthService.signIn('test@example.com', 'password123')
                    .then(result => console.log('Test result:', result))
                    .catch(error => console.error('Test error:', error));
                }}
                style={[styles.button, { marginTop: 8 }]}
              >
                Test Supabase Config
              </Button>
            )}
          </View>

          <View style={styles.footerContainer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text
                style={styles.link}
                onPress={() => rootNavigation.navigate('TermsOfService')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.link}
                onPress={() => rootNavigation.navigate('PrivacyPolicy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  link: {
    fontWeight: 'bold',
  },
  successText: {
    color: 'green',
  },
});

export default LoginScreen; 