import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCcw, Zap, ZapOff, Loader as Loader2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PhotoPreview } from '@/components/PhotoPreview';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  // Show loading while permissions are being checked
  if (!permission) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Loader2 size={48} color="#fff" />
        <Text className="text-white text-base mt-4 font-medium">Loading camera...</Text>
      </View>
    );
  }

  // Request permission if not granted
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-5">
        <Camera size={80} color="#fff" className="mb-7 opacity-80" />
        <Text className="text-2xl font-bold text-white text-center mb-4">Camera Access Required</Text>
        <Text className="text-base text-gray-300 text-center leading-6 mb-10">
          We need access to your camera to take photos. Your privacy is important to us.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-7 py-4 rounded-xl min-w-[200px]"
          onPress={requestPermission}
        >
          <Text className="text-white text-base font-semibold text-center">Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: true,
      });
      
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(
        'Camera Error',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleSave = () => {
    setCapturedPhoto(null);
    // Navigation to gallery will be handled by PhotoPreview component
  };

  // Show photo preview if a photo was captured
  if (capturedPhoto) {
    return (
      <PhotoPreview
        photoUri={capturedPhoto}
        onRetake={handleRetake}
        onSave={handleSave}
      />
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={facing}
        flash={flash}
        mode="picture"
      >
        {/* Header Controls */}
        <View>
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-black/50 justify-center items-center mb-2"
            onPress={toggleFlash}
          >
            {flash === 'on' ? (
              <Zap size={24} color="#fff" />
            ) : (
              <ZapOff size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View>
          <View className="flex-row justify-between items-center">
            {/* Flip Camera Button */}
            <TouchableOpacity
              className="w-12 h-12 rounded-full bg-white/20 justify-center items-center"
              onPress={toggleCameraFacing}
            >
              <RotateCcw size={24} color="#fff" />
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              className={`w-20 h-20 rounded-full bg-white justify-center items-center ${isCapturing ? 'opacity-70' : ''}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View className="w-[70px] h-[70px] rounded-full bg-white justify-center items-center border-4 border-black">
                {isCapturing ? (
                  <Loader2 size={28} color="#000" />
                ) : (
                  <Camera size={28} color="#000" />
                )}
              </View>
            </TouchableOpacity>

            {/* Placeholder for symmetry */}
            <View className="w-12 h-12 rounded-full bg-white/20 justify-center items-center" />
          </View>
        </View>
      </CameraView>
    </View>
  );
}