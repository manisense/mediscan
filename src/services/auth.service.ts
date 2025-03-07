import { supabase } from '../database/supabase';
import { DatabaseService } from '../database/database.service';
import { Tables, Updatable } from '../database/schema';

/**
 * Authentication service for handling user authentication
 */
export class AuthService {
  /**
   * Sign up with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Success status and message
   */
  static async signUp(email: string, password: string): Promise<{ success: boolean; message: string; user: any }> {
    try {
      console.log('Attempting to sign up with email:', email); // Debug log
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error); // Debug log
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }

      return {
        success: true,
        message: 'Sign up successful. Please check your email for verification.',
        user: data.user,
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        user: null,
      };
    }
  }

  /**
   * Sign in with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Success status and message
   */
  static async signIn(email: string, password: string): Promise<{ success: boolean; message: string; session?: any }> {
    try {
      console.log('Attempting to sign in with email:', email); // Debug log
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error); // Debug log
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: 'Sign in successful.',
        session: data.session,
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Success status and message
   */
  static async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: 'Signed out successfully.',
      };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Get the current user
   * @returns Current user or null if not authenticated
   */
  static async getCurrentUser() {
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
  }

  /**
   * Get the current session
   * @returns Current session or null if not authenticated
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting current session:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  /**
   * Get the user profile
   * @returns User profile or null if not authenticated or profile not found
   */
  static async getUserProfile(): Promise<Tables<'user_profiles'> | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      return await DatabaseService.getUserProfile(user.id);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update the user profile
   * @param profile Updated profile data
   * @returns Updated profile or null if error
   */
  static async updateUserProfile(profile: Updatable<'user_profiles'>): Promise<Tables<'user_profiles'> | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      return await DatabaseService.updateUserProfile(user.id, profile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
} 