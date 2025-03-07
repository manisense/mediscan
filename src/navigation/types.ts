import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  History: undefined;
  Profile: undefined;
};

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  MedicationDetail: { medicationId: string };
  ScanResult: { scanData: any; scanType: string };
  Camera: { scanType: 'barcode' | 'pill' | 'imprint' };
  Settings: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  FindDoctor: undefined;
  MyMedicines: undefined;
  EmergencyContacts: undefined;
};

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>; 