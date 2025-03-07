# MedScan - Medication Identification App

MedScan is a cross-platform mobile application that helps users identify medications through various scanning methods. The app uses advanced machine learning and image recognition technology to provide accurate information about medications.

## Features

- **Pill Identification**: Identify pills by shape, color, and imprint using TensorFlow Lite
- **Barcode Scanning**: Scan medication barcodes for instant information
- **OCR Technology**: Use Google Vision API to read pill imprints
- **Medication Database**: Access comprehensive medication information via OpenFDA API
- **Scan History**: Keep track of your scanned medications
- **Saved Medications**: Save medications for quick reference

## Technology Stack

- **Frontend**: React Native with Expo (Managed Workflow)
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **Machine Learning**: TensorFlow Lite for on-device pill recognition
- **OCR**: Google Vision API for reading pill imprints
- **Medication Data**: OpenFDA API
- **Language**: TypeScript

## Project Structure

```
src/
├── api/                  # API service integrations (OpenFDA, Google Vision)
├── components/           # Reusable UI components
├── constants/            # App constants and theme
├── database/             # Supabase database configuration and services
├── hooks/                # Custom React hooks
├── navigation/           # Navigation configuration
├── screens/              # App screens
│   ├── auth/             # Authentication screens
│   └── main/             # Main app screens
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account
- OpenFDA API key
- Google Cloud Vision API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/medscan.git
   cd medscan
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENFDA_API_KEY=your-openfda-api-key
   GOOGLE_CLOUD_VISION_API_KEY=your-google-cloud-vision-api-key
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Run on iOS or Android:
   ```
   npm run ios
   # or
   npm run android
   ```

## Database Setup

1. Create a new Supabase project
2. Run the SQL script in `src/database/schema.sql` to set up the database schema
3. Configure Row Level Security (RLS) policies as defined in the SQL script

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenFDA for providing medication data
- Google Cloud Vision API for OCR capabilities
- TensorFlow for machine learning tools
- Supabase for backend services
- Expo team for the React Native framework 