import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles } from '@/assets/styles/profile.styles';

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  children,
}) => {
  if (!children) return null;

  return (
    <View style={profileStyles.section}>
      <View style={profileStyles.sectionHeader}>
        {icon}
        <Text style={profileStyles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default ProfileSection;