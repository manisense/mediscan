-- Create tables for the MedScan application

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  ndc TEXT,
  gtin TEXT,
  imprint TEXT,
  shape TEXT,
  color TEXT,
  size NUMERIC,
  manufacturer TEXT,
  active_ingredients JSONB,
  dosage TEXT,
  route TEXT,
  packaging TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id)
);

-- Create scan_history table
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  medication_id UUID REFERENCES medications(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scan_type TEXT NOT NULL,
  scan_data JSONB NOT NULL,
  result JSONB,
  is_successful BOOLEAN DEFAULT FALSE
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  email TEXT,
  is_healthcare_provider BOOLEAN DEFAULT FALSE,
  preferences JSONB
);

-- Create saved_medications table
CREATE TABLE IF NOT EXISTS saved_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  medication_id UUID NOT NULL REFERENCES medications(id),
  notes TEXT,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_frequency JSONB,
  UNIQUE(user_id, medication_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS medications_name_idx ON medications(name);
CREATE INDEX IF NOT EXISTS medications_ndc_idx ON medications(ndc);
CREATE INDEX IF NOT EXISTS medications_gtin_idx ON medications(gtin);
CREATE INDEX IF NOT EXISTS medications_imprint_idx ON medications(imprint);
CREATE INDEX IF NOT EXISTS scan_history_user_id_idx ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS saved_medications_user_id_idx ON saved_medications(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON medications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_medications ENABLE ROW LEVEL SECURITY;

-- Medications policies
CREATE POLICY "Public medications are viewable by everyone"
  ON medications FOR SELECT
  USING (verified = TRUE);

CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  USING (auth.uid() = user_id);

-- Scan history policies
CREATE POLICY "Users can view their own scan history"
  ON scan_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan history"
  ON scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scan history"
  ON scan_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan history"
  ON scan_history FOR DELETE
  USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved medications policies
CREATE POLICY "Users can view their own saved medications"
  ON saved_medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved medications"
  ON saved_medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved medications"
  ON saved_medications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved medications"
  ON saved_medications FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 