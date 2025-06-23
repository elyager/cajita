import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  Camera, 
  Image, 
  Smartphone, 
  Info, 
  ChevronRight,
  Shield,
  Settings as SettingsIcon
} from 'lucide-react-native';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

function SettingsItem({ icon, title, subtitle, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100"
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="flex-row items-center flex-1">
        <View className="mr-4 w-6 items-center">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-black">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-gray-600 mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>
      {onPress && (
        <ChevronRight size={20} color="#666" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const handleCameraSettings = () => {
    console.log('Camera settings pressed');
  };

  const handleStorageSettings = () => {
    console.log('Storage settings pressed');
  };

  const handlePrivacySettings = () => {
    console.log('Privacy settings pressed');
  };

  const handleAbout = () => {
    console.log('About pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-300">
        <SettingsIcon size={32} color="#000" />
        <Text className="text-3xl font-bold text-black ml-3">Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Camera Section */}
        <View className="mt-5">
          <Text className="text-lg font-semibold text-black mb-2 px-5">Camera</Text>
          <View className="bg-white border-t border-b border-gray-300">
            <SettingsItem
              icon={<Camera size={22} color="#007AFF" />}
              title="Camera Quality"
              subtitle="High quality (recommended)"
              onPress={handleCameraSettings}
            />
            <SettingsItem
              icon={<Image size={22} color="#007AFF" />}
              title="Photo Format"
              subtitle="JPEG with EXIF data"
              onPress={handleStorageSettings}
            />
          </View>
        </View>

        {/* Storage Section */}
        <View className="mt-5">
          <Text className="text-lg font-semibold text-black mb-2 px-5">Storage</Text>
          <View className="bg-white border-t border-b border-gray-300">
            <SettingsItem
              icon={<Smartphone size={22} color="#34C759" />}
              title="Save to Device"
              subtitle="Photos saved to camera roll"
            />
            <SettingsItem
              icon={<Shield size={22} color="#34C759" />}
              title="Privacy"
              subtitle="Your photos stay on your device"
              onPress={handlePrivacySettings}
            />
          </View>
        </View>

        {/* Device Information */}
        <View className="mt-5">
          <Text className="text-lg font-semibold text-black mb-2 px-5">Device Information</Text>
          <View className="bg-white border-t border-b border-gray-300">
            <SettingsItem
              icon={<Info size={22} color="#666" />}
              title="Platform"
              subtitle={Platform.OS === 'web' ? 'Web Browser' : Platform.OS === 'ios' ? 'iOS' : 'Android'}
            />
            <SettingsItem
              icon={<Info size={22} color="#666" />}
              title="Version"
              subtitle="1.0.0"
            />
          </View>
        </View>

        {/* About Section */}
        <View className="mt-5">
          <Text className="text-lg font-semibold text-black mb-2 px-5">About</Text>
          <View className="bg-white border-t border-b border-gray-300">
            <SettingsItem
              icon={<Info size={22} color="#666" />}
              title="About Camera App"
              subtitle="Simple, professional camera app"
              onPress={handleAbout}
            />
          </View>
        </View>

        {/* Platform Specific Information */}
        {Platform.OS === 'web' && (
          <View className="m-5 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <Text className="text-sm text-blue-800 leading-5">
              ℹ️ Some features may be limited in web browsers. For the best experience, use the mobile app.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}