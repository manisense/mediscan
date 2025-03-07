import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';

const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Notifications"
            description="Enable push notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={props => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Enable dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Privacy</List.Subheader>
          <List.Item
            title="Location Services"
            description="Allow app to access your location"
            left={props => <List.Icon {...props} icon="map-marker-outline" />}
            right={props => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Analytics"
            description="Share anonymous usage data"
            left={props => <List.Icon {...props} icon="chart-bar" />}
            right={props => (
              <Switch
                value={analyticsEnabled}
                onValueChange={setAnalyticsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={props => <List.Icon {...props} icon="account-edit-outline" />}
            onPress={() => console.log('Edit profile')}
          />
          <Divider />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            onPress={() => console.log('Change password')}
          />
          <Divider />
          <List.Item
            title="Delete Account"
            description="Permanently delete your account"
            left={props => <List.Icon {...props} icon="delete-outline" color={theme.colors.error} />}
            titleStyle={{ color: theme.colors.error }}
            onPress={() => console.log('Delete account')}
          />
        </List.Section>

        <View style={styles.versionContainer}>
          <Text variant="bodySmall" style={styles.versionText}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    opacity: 0.5,
  },
});

export default SettingsScreen; 