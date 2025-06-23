import { Tabs } from 'expo-router';
import { Camera, Image, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ size, color }) => (
            <Image size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'CAMARA',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size + 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}