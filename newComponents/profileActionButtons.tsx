import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { profileStyles } from '@/assets/styles/profile.styles';
import { router } from 'expo-router';

const ProfileActionButtons: React.FC = () => {
  const buttons = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <AntDesign name="edit" size={18} color="#fff" />,
      colors: ['#667eea', '#764ba2'],
      onPress: () => router.navigate("/editProfile"),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <AntDesign name="setting" size={18} color="#fff" />,
      colors: ['#f093fb', '#f5576c'],
      onPress: () => router.navigate("/settings"),
    },
    {
      id: 'book',
      label: 'Book',
      icon: <Ionicons name="calendar" size={16} color="#fff" />,
      colors: ['#4facfe', '#00f2fe'],
      onPress: () => console.log('Book appointment'),
    },
  ];

  return (
    <View style={profileStyles.actionButtons}>
      {buttons.map((button) => (
        <TouchableOpacity 
          key={button.id}
          style={[profileStyles.button, profileStyles[`${button.id}Button`]]}
          onPress={button.onPress}
        >
          <LinearGradient
            colors={button.colors}
            style={profileStyles.buttonGradient}
          >
            {button.icon}
            <Text style={profileStyles.buttonText}>{button.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProfileActionButtons;