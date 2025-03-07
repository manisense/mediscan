// Script to set up the database schema in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Supabase URL or key not found in .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to create user_profiles table
async function createUserProfilesTable() {
  console.log('Creating user_profiles table...');
  
  const { error } = await supabase.rpc('create_user_profiles_table');
  
  if (error) {
    console.error('Error creating user_profiles table:', error);
    throw error;
  }
  
  console.log('user_profiles table created successfully');
}

// Function to create medications table
async function createMedicationsTable() {
  console.log('Creating medications table...');
  
  const { error } = await supabase.rpc('create_medications_table');
  
  if (error) {
    console.error('Error creating medications table:', error);
    throw error;
  }
  
  console.log('medications table created successfully');
}

// Function to create scan_history table
async function createScanHistoryTable() {
  console.log('Creating scan_history table...');
  
  const { error } = await supabase.rpc('create_scan_history_table');
  
  if (error) {
    console.error('Error creating scan_history table:', error);
    throw error;
  }
  
  console.log('scan_history table created successfully');
}

// Function to create saved_medications table
async function createSavedMedicationsTable() {
  console.log('Creating saved_medications table...');
  
  const { error } = await supabase.rpc('create_saved_medications_table');
  
  if (error) {
    console.error('Error creating saved_medications table:', error);
    throw error;
  }
  
  console.log('saved_medications table created successfully');
}

// Function to create trigger for new user signup
async function createUserTrigger() {
  console.log('Creating user trigger...');
  
  const { error } = await supabase.rpc('create_user_trigger');
  
  if (error) {
    console.error('Error creating user trigger:', error);
    throw error;
  }
  
  console.log('User trigger created successfully');
}

// Main function to set up the database
async function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    
    // Create tables
    await createUserProfilesTable();
    await createMedicationsTable();
    await createScanHistoryTable();
    await createSavedMedicationsTable();
    await createUserTrigger();
    
    console.log('Database schema set up successfully!');
  } catch (error) {
    console.error('Failed to set up database schema:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 