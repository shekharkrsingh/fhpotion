import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { profileStyles } from '@/assets/styles/profile.styles';
import { MedicalTheme } from '@/newConstants/theme';
import { router } from 'expo-router';

interface ProfileHeaderProps {
  coverPicture?: string;
  profilePicture?: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  yearsOfExperience?: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  coverPicture,
  profilePicture,
  firstName,
  lastName,
  specialization,
  yearsOfExperience,
}) => {
  const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  const getExperienceColor = (years: number) => {
    if (years >= 20) return MedicalTheme.colors.warning[600];
    if (years >= 10) return MedicalTheme.colors.secondary[500];
    if (years >= 5) return MedicalTheme.colors.primary[400];
    return MedicalTheme.colors.success[400];
  };

  return (
    <>
      {/* Enhanced Cover Section */}
      <View style={profileStyles.coverContainer}>
        <Image 
          source={{ uri: coverPicture || DEFAULT_COVER_IMAGE }} 
          style={profileStyles.coverPhoto} 
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={profileStyles.coverGradient}
        />
        
        {/* Back Button */}
        <TouchableOpacity style={profileStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Header with Enhanced Design */}
      <View style={profileStyles.profileHeader}>
        <View style={profileStyles.profileImageContainer}>
          <Image 
            source={{ uri: profilePicture || DEFAULT_PROFILE_IMAGE }} 
            style={profileStyles.profileImage} 
          />
          <View style={profileStyles.onlineIndicator} />
        </View>

        <View style={profileStyles.basicInfo}>
          <View style={profileStyles.nameContainer}>
            <Text style={profileStyles.name}>
              Dr. {firstName} {lastName}
            </Text>
            <MaterialIcons name="verified" size={20} color={MedicalTheme.colors.success[500]} />
          </View>
          
          {specialization && (
            <Text style={profileStyles.specialization}>{specialization}</Text>
          )}
          
          {yearsOfExperience && (
            <View style={[
              profileStyles.experienceBadge, 
              { backgroundColor: getExperienceColor(yearsOfExperience) }
            ]}>
              <FontAwesome5 name="award" size={12} color="#fff" />
              <Text style={profileStyles.experienceText}>{yearsOfExperience}+ Years</Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default ProfileHeader;