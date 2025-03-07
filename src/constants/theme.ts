import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Define custom colors based on the attached design
const customColors = {
  primary: '#000000', // Black for primary actions
  secondary: '#f44336', // Red for emergency/important actions
  tertiary: '#4caf50', // Green for success/valid states
  error: '#f44336', // Red for errors
  background: '#f5f5f5', // Light gray background
  surface: '#ffffff', // White surface
  text: '#000000', // Black text
  disabled: '#BDBDBD', // Light gray for disabled elements
  placeholder: '#9E9E9E', // Medium gray for placeholders
  backdrop: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black for backdrops
  notification: '#f44336', // Red for notifications
};

// Define custom dark colors
const customDarkColors = {
  primary: '#ffffff', // White for primary actions in dark mode
  secondary: '#ff7961', // Lighter red for emergency/important actions
  tertiary: '#80e27e', // Lighter green for success/valid states
  error: '#ff7961', // Lighter red for errors
  background: '#121212', // Dark background
  surface: '#1E1E1E', // Dark surface
  text: '#ffffff', // White text
  disabled: '#757575', // Medium gray for disabled elements
  placeholder: '#BDBDBD', // Light gray for placeholders
  backdrop: 'rgba(0, 0, 0, 0.7)', // More opaque black for backdrops
  notification: '#ff7961', // Lighter red for notifications
};

// Create custom light theme
export const lightTheme = {
  ...MD3LightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationDefaultTheme.colors,
    ...customColors,
  },
};

// Create custom dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    ...customDarkColors,
  },
};

// Export default theme (light theme)
export const theme = lightTheme; 