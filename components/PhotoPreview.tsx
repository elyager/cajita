import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Photo Display */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Header with close button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onRetake}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.controlsRow}>
          {/* Retake Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onRetake}
            disabled={isSaving}
          >
            <RotateCcw size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Saving...</Text>
              </>
            ) : (
              <>
                <Check size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});