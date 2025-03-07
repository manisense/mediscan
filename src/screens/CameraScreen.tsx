import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, Platform } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../navigation/types';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { OpenFdaService } from '../api/openFda.service';
import { GoogleVisionService } from '../api/googleVision.service';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../services/auth.service';

// Import camera and barcode scanner directly
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

const CameraScreen: React.FC<RootStackScreenProps<'Camera'>> = ({ navigation, route }) => {
  const { scanType } = route.params;
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permission to use the scanner.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setCameraError('Error accessing camera. Please check permissions and restart the app.');
      }
    };
    
    checkCameraPermissions();
  }, []);

  const toggleFlash = () => {
    setFlashMode(
      flashMode === FlashMode.off
        ? FlashMode.torch
        : FlashMode.off
    );
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || processing) return;
    
    setScanned(true);
    setProcessing(true);
    
    try {
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      
      // Process barcode data
      let medicationData;
      if (data.match(/^[0-9]{12}$/) || data.match(/^[0-9]{13}$/)) {
        // This is likely a UPC/EAN barcode
        medicationData = await OpenFdaService.searchByNdc(data);
      } else if (data.match(/^[0-9]{10}$/) || data.match(/^[0-9]{11}$/)) {
        // This is likely an NDC code
        medicationData = await OpenFdaService.searchByNdc(data);
      } else {
        // Try to search by name as fallback
        medicationData = { name: data, confidence: 'low' };
      }
      
      // Save scan to history
      const user = await AuthService.getCurrentUser();
      if (user) {
        await DatabaseService.recordScan({
          user_id: user.id,
          scan_type: 'barcode',
          scan_data: { type, data },
          result: medicationData,
          is_successful: !!medicationData
        });
      }
      
      // Navigate to results screen
      navigation.replace('ScanResult', {
        scanData: { type, data },
        scanType: 'barcode'
      });
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert(
        'Scan Error',
        'There was an error processing the barcode. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || processing) return;
    
    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      // Resize and compress the image for better processing
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setCapturedImage(manipResult.uri);
      
      if (scanType === 'pill') {
        await processPillImage(manipResult.uri);
      } else if (scanType === 'imprint') {
        await processPillImprint(manipResult.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(
        'Camera Error',
        'There was an error taking the picture. Please try again.',
        [{ text: 'OK' }]
      );
      setProcessing(false);
    }
  };

  const processPillImage = async (imageUri: string) => {
    try {
      // Detect colors in the image
      const colors = await GoogleVisionService.detectColors(imageUri);
      const colorName = GoogleVisionService.getPillColorName(colors);
      
      // Detect labels in the image
      const labels = await GoogleVisionService.detectLabels(imageUri);
      
      // Detect objects for shape detection
      const objects = await GoogleVisionService.detectObjects(imageUri);
      const shape = GoogleVisionService.getPillShape(objects);
      
      // Process the image data
      const pillData = {
        color: colorName,
        shape: shape || 'unknown',
        labels: labels,
        imageUri: imageUri
      };
      
      // Try to find medication by color and shape
      let medicationData = null;
      let searchQuery = '';
      
      // Build search query from detected attributes
      if (colorName && shape) {
        searchQuery = `${colorName} ${shape} pill`;
      } else if (colorName) {
        searchQuery = `${colorName} pill`;
      } else if (shape) {
        searchQuery = `${shape} pill`;
      }
      
      // If we have a good search query, try to find medication
      if (searchQuery) {
        const results = await OpenFdaService.searchGeneric(searchQuery, 1);
        if (results && results.length > 0) {
          medicationData = OpenFdaService.formatMedicationData(results[0]);
        }
      }
      
      // Save scan to history
      const user = await AuthService.getCurrentUser();
      if (user) {
        await DatabaseService.recordScan({
          user_id: user.id,
          scan_type: 'pill',
          scan_data: pillData,
          result: medicationData || { color: colorName, shape, labels },
          is_successful: true
        });
      }
      
      // Navigate to results screen
      navigation.replace('ScanResult', {
        scanData: pillData,
        scanType: 'pill'
      });
    } catch (error) {
      console.error('Error processing pill image:', error);
      Alert.alert(
        'Processing Error',
        'There was an error processing the pill image. Please try again.',
        [{ text: 'OK', onPress: () => setCapturedImage(null) }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const processPillImprint = async (imageUri: string) => {
    try {
      // Detect text in the image
      const detectedText = await GoogleVisionService.detectText(imageUri);
      
      // Extract pill imprint from the detected text
      const imprint = GoogleVisionService.extractPillImprint(detectedText);
      
      // Process the imprint data
      const imprintData = {
        imprint: imprint,
        fullText: detectedText,
        imageUri: imageUri
      };
      
      // Try to find medication by imprint
      let medicationData = null;
      if (imprint) {
        // Search for medication by imprint
        const results = await OpenFdaService.searchGeneric(imprint, 3);
        if (results && results.length > 0) {
          medicationData = OpenFdaService.formatMedicationData(results[0]);
          
          // Add imprint to the medication data
          if (medicationData) {
            medicationData.imprint = imprint;
          }
        }
      }
      
      // Save scan to history
      const user = await AuthService.getCurrentUser();
      if (user) {
        await DatabaseService.recordScan({
          user_id: user.id,
          scan_type: 'imprint',
          scan_data: imprintData,
          result: medicationData || { imprint, fullText: detectedText },
          is_successful: !!imprint
        });
      }
      
      // Navigate to results screen
      navigation.replace('ScanResult', {
        scanData: imprintData,
        scanType: 'imprint'
      });
    } catch (error) {
      console.error('Error processing pill imprint:', error);
      Alert.alert(
        'Processing Error',
        'There was an error processing the pill imprint. Please try again.',
        [{ text: 'OK', onPress: () => setCapturedImage(null) }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const cancelCapture = () => {
    setCapturedImage(null);
    setScanned(false);
    setProcessing(false);
  };

  // Handle camera module errors
  if (cameraError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{cameraError}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {capturedImage ? (
        // Show captured image
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          {processing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Processing image...</Text>
            </View>
          ) : (
            <View style={styles.captureControls}>
              <Button 
                mode="contained" 
                onPress={cancelCapture}
                style={styles.captureButton}
              >
                Retake
              </Button>
            </View>
          )}
        </View>
      ) : (
        // Show camera
        <View style={styles.cameraContainer}>
          {scanType === 'barcode' ? (
            <BarCodeScanner
              style={StyleSheet.absoluteFillObject}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeTypes={[
                BarCodeScanner.Constants.BarCodeType.qr,
                BarCodeScanner.Constants.BarCodeType.ean13,
                BarCodeScanner.Constants.BarCodeType.ean8,
                BarCodeScanner.Constants.BarCodeType.upc_e,
                BarCodeScanner.Constants.BarCodeType.upc_a,
                BarCodeScanner.Constants.BarCodeType.code39,
                BarCodeScanner.Constants.BarCodeType.code128,
              ]}
            >
              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                </View>
                
                <View style={styles.cameraControls}>
                  <IconButton
                    icon="close"
                    iconColor="#fff"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={styles.controlButton}
                  />
                  
                  <View style={styles.scanInstructions}>
                    <Text style={styles.scanText}>
                      {scanned ? 'Barcode detected!' : 'Position barcode in frame'}
                    </Text>
                    {processing && (
                      <ActivityIndicator size="small" color="#fff" style={styles.scanSpinner} />
                    )}
                  </View>
                </View>
              </View>
            </BarCodeScanner>
          ) : (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={cameraType}
              flashMode={flashMode}
            >
              <View style={styles.overlay}>
                <View style={styles.cameraControls}>
                  <IconButton
                    icon="close"
                    iconColor="#fff"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={styles.controlButton}
                  />
                  
                  <View style={styles.bottomControls}>
                    <IconButton
                      icon={flashMode === FlashMode.torch ? "flash" : "flash-off"}
                      iconColor="#fff"
                      size={30}
                      onPress={toggleFlash}
                      style={styles.controlButton}
                    />
                    
                    <TouchableOpacity
                      style={styles.captureButton}
                      onPress={takePicture}
                      disabled={processing}
                    >
                      <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
                    
                    <IconButton
                      icon="camera-flip"
                      iconColor="#fff"
                      size={30}
                      onPress={toggleCameraType}
                      style={styles.controlButton}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  scanFrame: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: '25%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  scanCorner: {
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  cameraControls: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  scanInstructions: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  scanSpinner: {
    marginTop: 10,
  },
  previewContainer: {
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
  },
  processingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  captureControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default CameraScreen; 