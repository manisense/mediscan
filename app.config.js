import 'dotenv/config';

export default ({ config }) => {
  // Default values for development
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
  const OPENFDA_API_KEY = process.env.EXPO_PUBLIC_OPENFDA_API_KEY || 'your-openfda-api-key';
  const GOOGLE_CLOUD_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY || 'your-google-cloud-vision-api-key';

  // Debug logs for environment variables
  console.log('Environment variables loaded:');
  console.log('- SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
  console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'Not set');
  console.log('- OPENFDA_API_KEY:', OPENFDA_API_KEY ? 'Set (hidden for security)' : 'Not set');
  console.log('- GOOGLE_CLOUD_VISION_API_KEY:', GOOGLE_CLOUD_VISION_API_KEY ? 'Set (hidden for security)' : 'Not set');

  return {
    ...config,
    extra: {
      ...config.extra,
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      openFdaApiKey: OPENFDA_API_KEY,
      googleCloudVisionApiKey: GOOGLE_CLOUD_VISION_API_KEY,
      // Add debug flag for development
      isDebug: process.env.NODE_ENV === 'development',
    },
  };
}; 