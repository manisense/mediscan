export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      medications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          ndc: string | null;
          gtin: string | null;
          imprint: string | null;
          shape: string | null;
          color: string | null;
          size: number | null;
          manufacturer: string | null;
          active_ingredients: Json | null;
          dosage: string | null;
          route: string | null;
          packaging: string | null;
          image_url: string | null;
          verified: boolean;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          ndc?: string | null;
          gtin?: string | null;
          imprint?: string | null;
          shape?: string | null;
          color?: string | null;
          size?: number | null;
          manufacturer?: string | null;
          active_ingredients?: Json | null;
          dosage?: string | null;
          route?: string | null;
          packaging?: string | null;
          image_url?: string | null;
          verified?: boolean;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          ndc?: string | null;
          gtin?: string | null;
          imprint?: string | null;
          shape?: string | null;
          color?: string | null;
          size?: number | null;
          manufacturer?: string | null;
          active_ingredients?: Json | null;
          dosage?: string | null;
          route?: string | null;
          packaging?: string | null;
          image_url?: string | null;
          verified?: boolean;
          user_id?: string | null;
        };
      };
      scan_history: {
        Row: {
          id: string;
          created_at: string;
          medication_id: string | null;
          user_id: string;
          scan_type: string;
          scan_data: Json;
          result: Json | null;
          is_successful: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          medication_id?: string | null;
          user_id: string;
          scan_type: string;
          scan_data: Json;
          result?: Json | null;
          is_successful?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          medication_id?: string | null;
          user_id?: string;
          scan_type?: string;
          scan_data?: Json;
          result?: Json | null;
          is_successful?: boolean;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          email: string | null;
          is_healthcare_provider: boolean;
          preferences: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          email?: string | null;
          is_healthcare_provider?: boolean;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          email?: string | null;
          is_healthcare_provider?: boolean;
          preferences?: Json | null;
        };
      };
      saved_medications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          medication_id: string;
          notes: string | null;
          reminder_enabled: boolean;
          reminder_frequency: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          medication_id: string;
          notes?: string | null;
          reminder_enabled?: boolean;
          reminder_frequency?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          medication_id?: string;
          notes?: string | null;
          reminder_enabled?: boolean;
          reminder_frequency?: Json | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 