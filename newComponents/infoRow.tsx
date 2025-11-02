import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles } from '@/assets/styles/profile.styles';

interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
  isLast?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, text, isLast = false }) => {
  if (!text) return null;

  return (
    <View style={[profileStyles.infoRow, isLast && profileStyles.lastInfoRow]}>
      <View style={profileStyles.infoIcon}>
        {icon}
      </View>
      <Text style={profileStyles.infoText}>{text}</Text>
    </View>
  );
};

export default InfoRow;