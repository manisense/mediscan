import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

// Get the Google Cloud Vision API key from environment variables
const GOOGLE_CLOUD_VISION_API_KEY = Constants.expoConfig?.extra?.googleCloudVisionApiKey || '';

/**
 * Service for interacting with the Google Cloud Vision API
 */
export class GoogleVisionService {
  private static apiKey = GOOGLE_CLOUD_VISION_API_KEY;
  private static baseUrl = 'https://vision.googleapis.com/v1/images:annotate';
  private static euBaseUrl = 'https://eu-vision.googleapis.com/v1/images:annotate';

  /**
   * Detect text in an image using Google Cloud Vision API
   * @param imageUri URI of the image to analyze
   * @returns Detected text or null if error
   */
  static async detectText(imageUri: string): Promise<string | null> {
    try {
      console.log('Detecting text in image...');
      
      // Read the image as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the request body
      const body = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION', // Using DOCUMENT_TEXT_DETECTION for better results with pill imprints
                maxResults: 10,
              },
            ],
            imageContext: {
              languageHints: ["en"], // English language hint
            }
          },
        ],
      };

      // Make the API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Check for errors
      if (data.error) {
        console.error('Google Vision API error:', data.error);
        return null;
      }

      // Extract the text annotations
      const textAnnotations = data.responses?.[0]?.textAnnotations;
      if (!textAnnotations || textAnnotations.length === 0) {
        console.log('No text detected in image');
        return null;
      }

      // Return the full text (first annotation contains the entire text)
      console.log('Text detected:', textAnnotations[0].description);
      return textAnnotations[0].description || null;
    } catch (error) {
      console.error('Error detecting text with Google Vision API:', error);
      return null;
    }
  }

  /**
   * Extract pill imprint from detected text
   * @param text Detected text from the image
   * @returns Extracted pill imprint or null if not found
   */
  static extractPillImprint(text: string | null): string | null {
    if (!text) return null;

    try {
      console.log('Extracting pill imprint from text:', text);
      
      // Split the text into lines
      const lines = text.split('\n');

      // Filter out lines that are likely to be pill imprints
      // This is a simple heuristic and may need to be adjusted based on real-world data
      const potentialImprints = lines.filter(line => {
        // Remove whitespace and convert to uppercase
        const cleanLine = line.trim().toUpperCase();
        
        // Check if the line matches common pill imprint patterns
        // 1. Alphanumeric characters, possibly with hyphens or slashes
        // 2. Not too long (most imprints are short)
        // 3. Not just a single letter or number
        return (
          /^[A-Z0-9\-\/]+$/.test(cleanLine) &&
          cleanLine.length >= 2 &&
          cleanLine.length <= 10
        );
      });

      // If no potential imprints found using strict criteria, try a more lenient approach
      if (potentialImprints.length === 0) {
        // Look for short strings that might be imprints
        const shortLines = lines.filter(line => {
          const cleanLine = line.trim();
          return cleanLine.length >= 2 && cleanLine.length <= 10;
        });
        
        if (shortLines.length > 0) {
          console.log('Potential imprint found (lenient):', shortLines[0]);
          return shortLines[0].trim();
        }
        
        return null;
      }

      // Return the first potential imprint
      console.log('Potential imprint found:', potentialImprints[0]);
      return potentialImprints.length > 0 ? potentialImprints[0].trim() : null;
    } catch (error) {
      console.error('Error extracting pill imprint:', error);
      return null;
    }
  }

  /**
   * Detect labels in an image using Google Cloud Vision API
   * @param imageUri URI of the image to analyze
   * @returns Array of detected labels or empty array if error
   */
  static async detectLabels(imageUri: string): Promise<string[]> {
    try {
      console.log('Detecting labels in image...');
      
      // Read the image as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the request body
      const body = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 15,
              },
            ],
          },
        ],
      };

      // Make the API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Check for errors
      if (data.error) {
        console.error('Google Vision API error:', data.error);
        return [];
      }

      // Extract the label annotations
      const labelAnnotations = data.responses?.[0]?.labelAnnotations;
      if (!labelAnnotations || labelAnnotations.length === 0) {
        console.log('No labels detected in image');
        return [];
      }

      // Return the labels
      const labels = labelAnnotations.map((label: any) => label.description);
      console.log('Labels detected:', labels);
      return labels;
    } catch (error) {
      console.error('Error detecting labels with Google Vision API:', error);
      return [];
    }
  }

  /**
   * Detect colors in an image using Google Cloud Vision API
   * @param imageUri URI of the image to analyze
   * @returns Dominant colors or null if error
   */
  static async detectColors(imageUri: string): Promise<any | null> {
    try {
      console.log('Detecting colors in image...');
      
      // Read the image as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the request body
      const body = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'IMAGE_PROPERTIES',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      // Make the API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Check for errors
      if (data.error) {
        console.error('Google Vision API error:', data.error);
        return null;
      }

      // Extract the color properties
      const colorProperties = data.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors;
      if (!colorProperties || colorProperties.length === 0) {
        console.log('No colors detected in image');
        return null;
      }

      // Return the dominant colors
      console.log('Colors detected:', colorProperties.length);
      return colorProperties;
    } catch (error) {
      console.error('Error detecting colors with Google Vision API:', error);
      return null;
    }
  }

  /**
   * Get the pill color name from RGB values
   * @param colors Array of color objects with RGB values
   * @returns Color name or null if not determined
   */
  static getPillColorName(colors: any[] | null): string | null {
    if (!colors || colors.length === 0) return null;

    try {
      // Get the most dominant color
      const dominantColor = colors[0].color;
      const { red, green, blue } = dominantColor;
      
      console.log('Dominant color RGB:', red, green, blue);

      // Simple color classification based on RGB values
      if (red > 200 && green < 100 && blue < 100) return 'red';
      if (red < 100 && green > 200 && blue < 100) return 'green';
      if (red < 100 && green < 100 && blue > 200) return 'blue';
      if (red > 200 && green > 200 && blue < 100) return 'yellow';
      if (red > 200 && green > 100 && blue < 100) return 'orange';
      if (red > 150 && green < 100 && blue > 150) return 'purple';
      if (red > 200 && green > 200 && blue > 200) return 'white';
      if (red < 50 && green < 50 && blue < 50) return 'black';
      if (red > 150 && green > 150 && blue > 150) return 'gray';
      if (red > 150 && green > 100 && blue > 50) return 'brown';
      if (red > 200 && green > 150 && blue > 150) return 'pink';

      // If no specific color is matched, determine if it's light or dark
      const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
      if (brightness > 125) return 'light';
      return 'dark';
    } catch (error) {
      console.error('Error determining pill color:', error);
      return null;
    }
  }

  /**
   * Detect objects in an image using Google Cloud Vision API
   * @param imageUri URI of the image to analyze
   * @returns Array of detected objects or empty array if error
   */
  static async detectObjects(imageUri: string): Promise<any[]> {
    try {
      console.log('Detecting objects in image...');
      
      // Read the image as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the request body
      const body = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      // Make the API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Check for errors
      if (data.error) {
        console.error('Google Vision API error:', data.error);
        return [];
      }

      // Extract the object annotations
      const objectAnnotations = data.responses?.[0]?.localizedObjectAnnotations;
      if (!objectAnnotations || objectAnnotations.length === 0) {
        console.log('No objects detected in image');
        return [];
      }

      // Return the objects
      console.log('Objects detected:', objectAnnotations.length);
      return objectAnnotations;
    } catch (error) {
      console.error('Error detecting objects with Google Vision API:', error);
      return [];
    }
  }

  /**
   * Determine the shape of a pill from object detection
   * @param objects Array of detected objects
   * @returns Shape name or null if not determined
   */
  static getPillShape(objects: any[]): string | null {
    if (!objects || objects.length === 0) return null;

    try {
      // Look for shape-related objects
      const shapeObjects = objects.filter(obj => {
        const name = obj.name.toLowerCase();
        return name.includes('circle') || 
               name.includes('oval') || 
               name.includes('rectangle') || 
               name.includes('square') || 
               name.includes('triangle') ||
               name.includes('pill') ||
               name.includes('capsule') ||
               name.includes('tablet');
      });

      if (shapeObjects.length === 0) return null;

      // Get the most confident shape
      const mostConfidentShape = shapeObjects.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );

      const name = mostConfidentShape.name.toLowerCase();
      
      // Map detected object to pill shape
      if (name.includes('circle')) return 'round';
      if (name.includes('oval')) return 'oval';
      if (name.includes('rectangle')) return 'rectangle';
      if (name.includes('square')) return 'square';
      if (name.includes('triangle')) return 'triangle';
      if (name.includes('capsule')) return 'capsule';
      if (name.includes('pill') || name.includes('tablet')) {
        // For generic pill/tablet, try to determine shape from bounding box
        const vertices = mostConfidentShape.boundingPoly.normalizedVertices;
        if (vertices && vertices.length === 4) {
          const width = Math.abs(vertices[1].x - vertices[0].x);
          const height = Math.abs(vertices[2].y - vertices[1].y);
          const ratio = width / height;
          
          if (ratio > 1.5) return 'oval';
          if (ratio < 1.2 && ratio > 0.8) return 'round';
          return 'rectangle';
        }
      }

      return null;
    } catch (error) {
      console.error('Error determining pill shape:', error);
      return null;
    }
  }
} 