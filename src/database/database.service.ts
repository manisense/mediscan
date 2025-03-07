import { supabase } from './supabase';
import { Database, Tables, Insertable, Updatable } from './schema';

/**
 * Database service for interacting with Supabase
 */
export class DatabaseService {
  /**
   * Get a medication by ID
   * @param id Medication ID
   * @returns Medication or null if not found
   */
  static async getMedicationById(id: string): Promise<Tables<'medications'> | null> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching medication:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Search medications by various criteria
   * @param searchParams Search parameters
   * @returns Array of medications matching the criteria
   */
  static async searchMedications(searchParams: {
    name?: string;
    ndc?: string;
    gtin?: string;
    imprint?: string;
    shape?: string;
    color?: string;
  }): Promise<Tables<'medications'>[]> {
    let query = supabase.from('medications').select('*');
    
    // Apply filters based on provided search parameters
    if (searchParams.name) {
      query = query.ilike('name', `%${searchParams.name}%`);
    }
    
    if (searchParams.ndc) {
      query = query.eq('ndc', searchParams.ndc);
    }
    
    if (searchParams.gtin) {
      query = query.eq('gtin', searchParams.gtin);
    }
    
    if (searchParams.imprint) {
      query = query.ilike('imprint', `%${searchParams.imprint}%`);
    }
    
    if (searchParams.shape) {
      query = query.eq('shape', searchParams.shape);
    }
    
    if (searchParams.color) {
      query = query.eq('color', searchParams.color);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching medications:', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Create a new medication
   * @param medication Medication data
   * @returns Created medication or null if error
   */
  static async createMedication(medication: Insertable<'medications'>): Promise<Tables<'medications'> | null> {
    const { data, error } = await supabase
      .from('medications')
      .insert(medication)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating medication:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Update an existing medication
   * @param id Medication ID
   * @param medication Updated medication data
   * @returns Updated medication or null if error
   */
  static async updateMedication(id: string, medication: Updatable<'medications'>): Promise<Tables<'medications'> | null> {
    const { data, error } = await supabase
      .from('medications')
      .update(medication)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating medication:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Delete a medication
   * @param id Medication ID
   * @returns Success status
   */
  static async deleteMedication(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting medication:', error);
      return false;
    }
    
    return true;
  }

  /**
   * Record a scan in the scan history
   * @param scanData Scan data
   * @returns Created scan history entry or null if error
   */
  static async recordScan(scanData: Insertable<'scan_history'>): Promise<Tables<'scan_history'> | null> {
    const { data, error } = await supabase
      .from('scan_history')
      .insert(scanData)
      .select()
      .single();
    
    if (error) {
      console.error('Error recording scan:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Get scan history for a user
   * @param userId User ID
   * @returns Array of scan history entries
   */
  static async getUserScanHistory(userId: string): Promise<Tables<'scan_history'>[]> {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*, medications(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching scan history:', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Get user profile
   * @param userId User ID
   * @returns User profile or null if not found
   */
  static async getUserProfile(userId: string): Promise<Tables<'user_profiles'> | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param profile Updated profile data
   * @returns Updated profile or null if error
   */
  static async updateUserProfile(userId: string, profile: Updatable<'user_profiles'>): Promise<Tables<'user_profiles'> | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Save a medication for a user
   * @param savedMedication Saved medication data
   * @returns Created saved medication entry or null if error
   */
  static async saveMedication(savedMedication: Insertable<'saved_medications'>): Promise<Tables<'saved_medications'> | null> {
    const { data, error } = await supabase
      .from('saved_medications')
      .insert(savedMedication)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving medication:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Get saved medications for a user
   * @param userId User ID
   * @returns Array of saved medications with medication details
   */
  static async getUserSavedMedications(userId: string): Promise<(Tables<'saved_medications'> & { medication: Tables<'medications'> })[]> {
    const { data, error } = await supabase
      .from('saved_medications')
      .select('*, medication:medications(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching saved medications:', error);
      return [];
    }
    
    return data as (Tables<'saved_medications'> & { medication: Tables<'medications'> })[] || [];
  }

  /**
   * Remove a saved medication
   * @param id Saved medication ID
   * @returns Success status
   */
  static async removeSavedMedication(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_medications')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing saved medication:', error);
      return false;
    }
    
    return true;
  }
} 