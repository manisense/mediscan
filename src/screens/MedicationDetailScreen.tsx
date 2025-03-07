import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';

const MedicationDetailScreen: React.FC<RootStackScreenProps<'MedicationDetail'>> = ({ navigation, route }) => {
  const { medicationId } = route.params;
  const theme = useTheme();

  // This is a placeholder. In a real app, you would fetch the medication data from your database
  const medication = {
    id: medicationId,
    name: 'Sample Medication',
    manufacturer: 'Sample Manufacturer',
    ndc: '12345-678-90',
    dosage: '500mg',
    route: 'Oral',
    active_ingredients: [{ name: 'Active Ingredient', strength: '500mg' }],
    shape: 'Round',
    color: 'White',
    imprint: 'ABC123',
    size: 10,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {medication.name}
            </Text>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                General Information
              </Text>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Manufacturer:
                </Text>
                <Text variant="bodyMedium">
                  {medication.manufacturer}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  NDC:
                </Text>
                <Text variant="bodyMedium">
                  {medication.ndc}
                </Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Medication Details
              </Text>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Dosage:
                </Text>
                <Text variant="bodyMedium">
                  {medication.dosage}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Route:
                </Text>
                <Text variant="bodyMedium">
                  {medication.route}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Active Ingredients:
                </Text>
                <Text variant="bodyMedium">
                  {medication.active_ingredients[0].name} ({medication.active_ingredients[0].strength})
                </Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Physical Characteristics
              </Text>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Shape:
                </Text>
                <Text variant="bodyMedium">
                  {medication.shape}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Color:
                </Text>
                <Text variant="bodyMedium">
                  {medication.color}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Imprint:
                </Text>
                <Text variant="bodyMedium">
                  {medication.imprint}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Size:
                </Text>
                <Text variant="bodyMedium">
                  {medication.size} mm
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={() => {
            // Save medication logic would go here
            console.log('Save medication:', medicationId);
            navigation.goBack();
          }}
        >
          Save Medication
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  detailSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 120,
  },
  saveButton: {
    marginBottom: 16,
  },
});

export default MedicationDetailScreen; 