import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemContent}>
        <View style={styles.settingsItemIcon}>
          {icon}
        </View>
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <SettingsIcon size={32} color="#000" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Camera Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera</Text>
          <View style={styles.sectionContent}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.sectionContent}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.sectionContent}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
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
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              ℹ️ Some features may be limited in web browsers. For the best experience, use the mobile app.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  webNotice: {
    margin: 20,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  webNoticeText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
});