import Constants from 'expo-constants';

// Get the OpenFDA API key from environment variables
const OPENFDA_API_KEY = Constants.expoConfig?.extra?.openFdaApiKey || '';

/**
 * Service for interacting with the OpenFDA API
 */
export class OpenFdaService {
  private static baseUrl = 'https://api.fda.gov/drug';
  private static apiKey = OPENFDA_API_KEY;

  /**
   * Search for medications by NDC (National Drug Code)
   * @param ndc NDC code
   * @returns Medication data or null if not found
   */
  static async searchByNdc(ndc: string): Promise<any> {
    try {
      console.log('Searching OpenFDA by NDC:', ndc);
      
      // Clean the NDC code (remove dashes, spaces)
      const cleanNdc = ndc.replace(/[-\s]/g, '');
      
      // Try different search patterns for NDC
      const searchPatterns = [
        `product_ndc:"${cleanNdc}"`,
        `product_ndc:"${cleanNdc.substring(0, 5)}-${cleanNdc.substring(5)}"`,
        `product_ndc:"${cleanNdc.substring(0, 4)}-${cleanNdc.substring(4)}"`,
      ];
      
      // Try each search pattern
      for (const pattern of searchPatterns) {
        const url = `${this.baseUrl}/ndc.json?search=${pattern}&limit=1&api_key=${this.apiKey}`;
        console.log('OpenFDA API URL:', url);
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
          console.error('OpenFDA API error:', data.error);
          continue;
        }

        if (data.results && data.results.length > 0) {
          console.log('OpenFDA NDC search successful');
          return data.results[0];
        }
      }
      
      // If no results found with NDC, try searching by UPC/EAN as fallback
      if (cleanNdc.length >= 12) {
        console.log('Trying UPC/EAN search as fallback');
        // For UPC/EAN codes, we can try to search by generic name or brand name
        const genericResults = await this.searchGeneric(cleanNdc);
        if (genericResults && genericResults.length > 0) {
          return genericResults[0];
        }
      }

      console.log('No results found for NDC:', ndc);
      return null;
    } catch (error) {
      console.error('Error searching OpenFDA by NDC:', error);
      return null;
    }
  }

  /**
   * Search for medications by name
   * @param name Medication name
   * @param limit Number of results to return (default: 10)
   * @returns Array of medication data
   */
  static async searchByName(name: string, limit = 10): Promise<any[]> {
    try {
      console.log('Searching OpenFDA by name:', name);
      
      // Try both brand name and generic name searches
      const brandNameUrl = `${this.baseUrl}/label.json?search=openfda.brand_name:"${name}"&limit=${limit}&api_key=${this.apiKey}`;
      const genericNameUrl = `${this.baseUrl}/label.json?search=openfda.generic_name:"${name}"&limit=${limit}&api_key=${this.apiKey}`;
      
      // Execute both searches
      const [brandResponse, genericResponse] = await Promise.all([
        fetch(brandNameUrl),
        fetch(genericNameUrl)
      ]);
      
      const brandData = await brandResponse.json();
      const genericData = await genericResponse.json();
      
      let results: any[] = [];
      
      // Combine results from both searches
      if (!brandData.error && brandData.results && brandData.results.length > 0) {
        results = results.concat(brandData.results);
      }
      
      if (!genericData.error && genericData.results && genericData.results.length > 0) {
        results = results.concat(genericData.results);
      }
      
      // Remove duplicates based on application_number
      const uniqueResults = this.removeDuplicates(results, 'application_number');
      
      console.log(`OpenFDA name search found ${uniqueResults.length} results`);
      return uniqueResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching OpenFDA by name:', error);
      return [];
    }
  }

  /**
   * Search for medications by active ingredient
   * @param ingredient Active ingredient
   * @param limit Number of results to return (default: 10)
   * @returns Array of medication data
   */
  static async searchByActiveIngredient(ingredient: string, limit = 10): Promise<any[]> {
    try {
      console.log('Searching OpenFDA by active ingredient:', ingredient);
      
      const url = `${this.baseUrl}/label.json?search=active_ingredient:"${ingredient}"&limit=${limit}&api_key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('OpenFDA API error:', data.error);
        return [];
      }

      if (data.results && data.results.length > 0) {
        console.log(`OpenFDA active ingredient search found ${data.results.length} results`);
        return data.results;
      }

      return [];
    } catch (error) {
      console.error('Error searching OpenFDA by active ingredient:', error);
      return [];
    }
  }

  /**
   * Generic search for medications
   * @param query Search query
   * @param limit Number of results to return (default: 10)
   * @returns Array of medication data
   */
  static async searchGeneric(query: string, limit = 10): Promise<any[]> {
    try {
      console.log('Generic OpenFDA search:', query);
      
      // Try a more generic search
      const url = `${this.baseUrl}/label.json?search=${query}&limit=${limit}&api_key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('OpenFDA API error:', data.error);
        return [];
      }

      if (data.results && data.results.length > 0) {
        console.log(`OpenFDA generic search found ${data.results.length} results`);
        return data.results;
      }

      return [];
    } catch (error) {
      console.error('Error with generic OpenFDA search:', error);
      return [];
    }
  }

  /**
   * Get medication details by application number
   * @param applicationNumber FDA application number
   * @returns Medication data or null if not found
   */
  static async getByApplicationNumber(applicationNumber: string): Promise<any> {
    try {
      console.log('Getting OpenFDA data by application number:', applicationNumber);
      
      const url = `${this.baseUrl}/label.json?search=openfda.application_number:"${applicationNumber}"&limit=1&api_key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('OpenFDA API error:', data.error);
        return null;
      }

      if (data.results && data.results.length > 0) {
        console.log('OpenFDA application number search successful');
        return data.results[0];
      }

      return null;
    } catch (error) {
      console.error('Error getting OpenFDA by application number:', error);
      return null;
    }
  }

  /**
   * Get medication details by manufacturer name
   * @param manufacturer Manufacturer name
   * @param limit Number of results to return (default: 10)
   * @returns Array of medication data
   */
  static async getByManufacturer(manufacturer: string, limit = 10): Promise<any[]> {
    try {
      console.log('Getting OpenFDA data by manufacturer:', manufacturer);
      
      const url = `${this.baseUrl}/label.json?search=openfda.manufacturer_name:"${manufacturer}"&limit=${limit}&api_key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('OpenFDA API error:', data.error);
        return [];
      }

      if (data.results && data.results.length > 0) {
        console.log(`OpenFDA manufacturer search found ${data.results.length} results`);
        return data.results;
      }

      return [];
    } catch (error) {
      console.error('Error getting OpenFDA by manufacturer:', error);
      return [];
    }
  }

  /**
   * Format OpenFDA data to a standardized format
   * @param fdaData Raw OpenFDA data
   * @returns Formatted medication data
   */
  static formatMedicationData(fdaData: any): any {
    if (!fdaData) return null;

    try {
      const openfda = fdaData.openfda || {};
      
      // Extract active ingredients
      let activeIngredients = [];
      if (fdaData.active_ingredient) {
        activeIngredients = fdaData.active_ingredient.map((ingredient: string) => {
          // Parse ingredient string like "ACETAMINOPHEN 500 mg"
          const match = ingredient.match(/(.+?)\s+(\d+\s*\w+)/);
          if (match) {
            return {
              name: match[1].trim(),
              strength: match[2].trim()
            };
          }
          return { name: ingredient, strength: 'Unknown' };
        });
      }
      
      // Extract active ingredient names for easier access
      const activeIngredientNames = activeIngredients.map((ing: any) => ing.name);
      
      // Format the data
      return {
        name: openfda.brand_name?.[0] || openfda.generic_name?.[0] || 'Unknown',
        genericName: openfda.generic_name?.[0] || null,
        brandName: openfda.brand_name?.[0] || null,
        ndc: openfda.product_ndc?.[0] || null,
        rxcui: openfda.rxcui?.[0] || null,
        spl_id: openfda.spl_id?.[0] || null,
        active_ingredients: activeIngredientNames,
        active_ingredients_details: activeIngredients,
        dosage: fdaData.dosage_and_administration?.[0] || null,
        dosage_forms: openfda.dosage_form?.[0] || null,
        route: openfda.route?.[0] || null,
        manufacturer: openfda.manufacturer_name?.[0] || null,
        description: fdaData.description?.[0] || null,
        indications: fdaData.indications_and_usage?.[0] || null,
        warnings: fdaData.warnings?.[0] || null,
        drug_interactions: fdaData.drug_interactions?.[0] || null,
        pregnancy: fdaData.pregnancy?.[0] || null,
        storage: fdaData.storage_and_handling?.[0] || null,
        package_label: fdaData.package_label_principal_display_panel?.[0] || null,
        matchConfidence: 'High',
      };
    } catch (error) {
      console.error('Error formatting OpenFDA data:', error);
      return {
        name: fdaData.openfda?.brand_name?.[0] || fdaData.openfda?.generic_name?.[0] || 'Unknown Medication',
        matchConfidence: 'Low',
      };
    }
  }

  /**
   * Remove duplicate objects from an array based on a property
   * @param array Array of objects
   * @param property Property to check for duplicates
   * @returns Array with duplicates removed
   */
  private static removeDuplicates(array: any[], property: string): any[] {
    const seen = new Set();
    return array.filter(item => {
      const value = item.openfda?.[property]?.[0];
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
} 