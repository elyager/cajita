import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { Image as ImageIcon, Camera, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const imageSize = (screenWidth - 40) / 3;

interface Photo {
  id: string;
  uri: string;
  creationTime: number;
}

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't support MediaLibrary, show placeholder
        setPhotos([]);
        setLoading(false);
        return;
      }

      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          setLoading(false);
          return;
        }
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: 'creationTime',
        first: 50,
      });

      const photoData: Photo[] = media.assets.map(asset => ({
        id: asset.id,
        uri: asset.uri,
        creationTime: asset.creationTime,
      }));

      setPhotos(photoData);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert(
        'Error',
        'Failed to load photos from your gallery.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    Alert.alert(
      'Photo Options',
      'What would you like to do with this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Full Size', onPress: () => viewFullSize(photo) },
      ]
    );
  };

  const viewFullSize = (photo: Photo) => {
    // In a real app, you might navigate to a full-screen photo viewer
    console.log('Viewing photo:', photo.uri);
  };

  const renderPhoto = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => handlePhotoPress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {Platform.OS === 'web' ? (
        <>
          <AlertCircle size={64} color="#666" />
          <Text style={styles.emptyTitle}>Gallery Not Available</Text>
          <Text style={styles.emptyText}>
            Gallery access is not supported in web browsers. Your photos will be available when using the app on mobile devices.
          </Text>
        </>
      ) : !permission?.granted ? (
        <>
          <ImageIcon size={64} color="#666" />
          <Text style={styles.emptyTitle}>Gallery Access Required</Text>
          <Text style={styles.emptyText}>
            We need permission to access your photos to show them in the gallery.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Camera size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptyText}>
            Start taking photos with the camera to see them here!
          </Text>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.cameraButtonText}>Open Camera</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 border-b border-gray-200">
        <Text className="text-3xl font-bold text-black">Gallery</Text>
        <Text className="text-base text-gray-600 mt-1">
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      ) : photos.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.photoGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  photoGrid: {
    padding: 10,
  },
  photoContainer: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  photo: {
    width: imageSize,
    height: imageSize,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});