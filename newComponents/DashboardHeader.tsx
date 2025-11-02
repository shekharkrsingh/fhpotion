// app/(tabs)/components/DashboardHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { styles } from '@/assets/styles/DashboardHeader.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface ProfileData {
  firstName: string;
  lastName: string;
}

interface DashboardHeaderProps {
  profileData: ProfileData;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profileData }) => {
  const router = useRouter();

  const getGreeting = (): string => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>
          {getGreeting()},
        </Text>
        <Text style={styles.doctorName}>
          Dr. {profileData.firstName} {profileData.lastName}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => router.navigate('/(tabs)/notification')}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={MedicalTheme.colors.text.primary}
        />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardHeader;