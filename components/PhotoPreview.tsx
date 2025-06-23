import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { X, Check, RotateCcw, Download, Loader as Loader2 } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onSave: () => void;
}

export function PhotoPreview({ photoUri, onRetake, onSave }: PhotoPreviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Check if we have media library permissions
      if (Platform.OS !== 'web' && !mediaPermission?.granted) {
        const { granted } = await requestMediaPermission();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'We need permission to save photos to your device.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // Save to media library (on native platforms)
      if (Platform.OS !== 'web') {
        await MediaLibrary.saveToLibraryAsync(photoUri);
        
        Alert.alert(
          'Photo Saved!',
          'Your photo has been saved to your device.',
          [
            {
              text: 'View Gallery',
              onPress: () => {
                onSave();
                router.push('/gallery');
              }
            },
            {
              text: 'Take Another',
              onPress: onSave
            }
          ]
        );
      } else {
        // Web fallback - just show success message
        Alert.alert(
          'Photo Captured!',
          'Your photo has been processed successfully.',
          [{ text: 'OK', onPress: onSave }]
        );
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert(
        'Save Failed',
        'Unable to save the photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Photo Display */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={{ uri: photoUri }}
          resizeMode="contain"
        />
      </View>

      {/* Header with close button */}
      <View style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        zIndex: 1,
      }}>
        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-black/50 justify-center items-center"
          onPress={onRetake}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View>
        <View className="flex-row justify-around items-center">
          {/* Retake Button */}
          <TouchableOpacity
            className="bg-white/20 px-6 py-4 rounded-full items-center min-w-[120px] border border-white/30"
            onPress={onRetake}
            disabled={isSaving}
          >
            <RotateCcw size={24} color="#fff" />
            <Text className="text-white text-sm font-semibold mt-1">Retake</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-blue-500 border-blue-500 px-6 py-4 rounded-full items-center min-w-[120px] border"
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={24} color="#fff" />
                <Text className="text-white text-sm font-semibold mt-1">Saving...</Text>
              </>
            ) : (
              <>
                <Check size={24} color="#fff" />
                <Text className="text-white text-sm font-semibold mt-1">Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}