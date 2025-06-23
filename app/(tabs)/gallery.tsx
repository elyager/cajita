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
      className="m-1 rounded-lg overflow-hidden bg-gray-100"
      onPress={() => handlePhotoPress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-10">
      {Platform.OS === 'web' ? (
        <>
          <AlertCircle size={64} color="#666" />
          <Text className="text-2xl font-bold text-gray-800 mt-5 mb-3 text-center">Gallery Not Available</Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-7">
            Gallery access is not supported in web browsers. Your photos will be available when using the app on mobile devices.
          </Text>
        </>
      ) : !permission?.granted ? (
        <>
          <ImageIcon size={64} color="#666" />
          <Text className="text-2xl font-bold text-gray-800 mt-5 mb-3 text-center">Gallery Access Required</Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-7">
            We need permission to access your photos to show them in the gallery.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-7 py-4 rounded-xl"
            onPress={requestPermission}
          >
            <Text className="text-white text-base font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Camera size={64} color="#666" />
          <Text className="text-2xl font-bold text-gray-800 mt-5 mb-3 text-center">No Photos Yet</Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-7">
            Start taking photos with the camera to see them here!
          </Text>
          <TouchableOpacity
            className="bg-black px-7 py-4 rounded-xl"
            onPress={() => router.push('/')}
          >
            <Text className="text-white text-base font-semibold">Open Camera</Text>
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
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">Loading photos...</Text>
        </View>
      ) : photos.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}