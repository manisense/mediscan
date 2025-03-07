import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

console.log('Supabase URL:', supabaseUrl); // Debug log
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set (hidden for security)' : 'Not set'); // Debug log

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anon key is missing. Please check your environment variables.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Log auth configuration
console.log('Supabase client created with auth config:', {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});

// Export a function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Export a function to check if the user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}; 