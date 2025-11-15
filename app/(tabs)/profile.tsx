import React, { useCallback, useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import { profileStyles } from '@/assets/styles/profile.styles';
import { MedicalTheme } from '@/newConstants/theme';
import ProfileHeader from '@/newComponents/profileHeader';
import ProfileActionButtons from '@/newComponents/profileActionButtons';
import ProfileSection from '@/newComponents/profileSection';
import InfoRow from '@/newComponents/infoRow';
import ListSection from '@/newComponents/listSection';
import EmptyScreen from '@/newComponents/EmptyScreen';
import { AppDispatch, RootState } from '@/newStore';
import { getProfile } from '@/newService/config/api/profileApi';

const DoctorProfileScreen = () => {
  const profileData = useSelector((state: RootState) => state.profile);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const hasAttemptedInitialLoad = React.useRef(false);

  // Load profile data on component mount - ONLY ONCE
  useEffect(() => {
    // Only attempt initial load once - prevents infinite loops on API failures
    if (!hasAttemptedInitialLoad.current) {
      hasAttemptedInitialLoad.current = true;
      loadProfileData();
    }
  }, []); // Empty deps - only run once on mount

  const loadProfileData = async () => {
    try {
      setError(null);
       await dispatch(getProfile());
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Failed to load profile:', err);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await dispatch(getProfile()); // Fixed: Use dispatch instead of direct function call
    } catch (err) {
      setError('Failed to refresh profile data');
      console.error('Failed to refresh profile:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]); // dispatch is stable from Redux

  const formatAvailableDays = (days: string[]) => {
    if (!days || days.length === 0) return 'Not specified';
    return days.join(', ');
  };

  const formatTimeSlots = (slots: { startTime: string; endTime: string }[]) => {
    if (!slots || slots.length === 0) return 'Not specified';
    return slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  };

  // Show loading state
  if (profileData.isLoading && !refreshing) {
    return (
      <EmptyScreen
        type="no-data"
        title="Loading Profile..."
        subtitle="Please wait while we load your profile information."
        showRefresh={false}
        showSupport={false}
      />
    );
  }

  // Show error state
  if (error || !profileData.success) {
    return (
      <EmptyScreen
        type="error"
        title="Profile Unavailable"
        subtitle={error || "We couldn't load your profile information. Please check your connection and try again."}
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={[
          {
            label: refreshing ? 'Retrying...' : 'Retry',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
          {
            label: 'Restart App',
            onPress: async () => {
              if (Platform.OS === 'web') {
                window.location.reload();
              } else {
                // For React Native, navigate to splash screen to reinitialize
                router.replace('/splashScreen');
              }
            },
            variant: 'outline',
            icon: 'restart-alt',
          },
        ]}
      />
    );
  }

  // Show empty state if no profile data
  if (!profileData.firstName && !profileData.lastName) {
    return (
      <EmptyScreen
        type="no-data"
        title="Profile Not Found"
        subtitle="We couldn't find your profile information. This might be because your profile hasn't been set up yet or there's a temporary service issue."
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={[
          {
            label: refreshing ? 'Refreshing...' : 'Refresh Profile',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
          {
            label: 'Setup Profile',
            onPress: () => console.log('Navigate to profile setup'),
            variant: 'secondary',
            icon: 'person-add',
          },
        ]}
      />
    );
  }

  return (
    <GestureHandlerRootView style={profileStyles.container}>
      <View style={profileStyles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={profileStyles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[MedicalTheme.colors.primary[500]]}
              tintColor={MedicalTheme.colors.primary[500]}
            />
          }
        >
          <ProfileHeader
            coverPicture={profileData.coverPicture}
            profilePicture={profileData.profilePicture}
            firstName={profileData.firstName}
            lastName={profileData.lastName}
            specialization={profileData.specialization}
            yearsOfExperience={profileData.yearsOfExperience}
          />

          <ProfileActionButtons />

          {/* Enhanced Details Section */}
          <View style={profileStyles.detailsContainer}>
            {/* About Section */}
            <ProfileSection
              title="Professional Summary"
              icon={<Ionicons name="document-text" size={20} color={MedicalTheme.colors.primary[500]} />}
            >
              {profileData.about ? (
                <Text style={profileStyles.sectionContent}>
                  {profileData.about}
                </Text>
              ) : (
                <EmptyScreen
                  type="no-data"
                  title="No Summary Available"
                  subtitle="Add a professional summary to let patients know more about your expertise."
                  showRefresh={false}
                  showSupport={false}
                  customIcon={
                    <View style={[profileStyles.iconBackground, { backgroundColor: MedicalTheme.colors.primary[50] }]}>
                      <Ionicons name="document-text" size={32} color={MedicalTheme.colors.primary[300]} />
                    </View>
                  }
                  actions={[
                    {
                      label: 'Add Summary',
                      onPress: () => console.log('Navigate to edit profile'),
                      variant: 'outline',
                      icon: 'edit',
                    },
                  ]}
                />
              )}
            </ProfileSection>

            {/* Bio Section */}
            <ProfileSection
              title="Biography"
              icon={<FontAwesome5 name="user-md" size={18} color={MedicalTheme.colors.primary[500]} />}
            >
              {profileData.bio ? (
                <Text style={profileStyles.sectionContent}>
                  {profileData.bio}
                </Text>
              ) : (
                <EmptyScreen
                  type="no-data"
                  title="No Biography Available"
                  subtitle="Share your background and experience with patients by adding a biography."
                  showRefresh={false}
                  showSupport={false}
                  customIcon={
                    <View style={[profileStyles.iconBackground, { backgroundColor: MedicalTheme.colors.primary[50] }]}>
                      <FontAwesome5 name="user-md" size={32} color={MedicalTheme.colors.primary[300]} />
                    </View>
                  }
                  actions={[
                    {
                      label: 'Add Biography',
                      onPress: () => console.log('Navigate to edit profile'),
                      variant: 'outline',
                      icon: 'edit',
                    },
                  ]}
                />
              )}
            </ProfileSection>

            {/* Contact Information */}
            {(profileData.phoneNumber || profileData.clinicAddress || 
              (profileData.availableDays && profileData.availableTimeSlots)) ? (
              <ProfileSection
                title="Contact & Availability"
                icon={<Ionicons name="business" size={20} color={MedicalTheme.colors.primary[500]} />}
              >
                <View style={profileStyles.infoContainer}>
                  {profileData.phoneNumber && (
                    <InfoRow
                      icon={<Ionicons name="call" size={16} color={MedicalTheme.colors.primary[500]} />}
                      text={profileData.phoneNumber}
                    />
                  )}
                  {profileData.clinicAddress && (
                    <InfoRow
                      icon={<Ionicons name="location" size={16} color={MedicalTheme.colors.primary[500]} />}
                      text={profileData.clinicAddress}
                    />
                  )}
                  {profileData.availableDays && profileData.availableTimeSlots && (
                    <InfoRow
                      icon={<Ionicons name="time" size={16} color={MedicalTheme.colors.primary[500]} />}
                      text={`${formatAvailableDays(profileData.availableDays)}, ${formatTimeSlots(profileData.availableTimeSlots)}`}
                      isLast={true}
                    />
                  )}
                </View>
              </ProfileSection>
            ) : (
              <ProfileSection
                title="Contact & Availability"
                icon={<Ionicons name="business" size={20} color={MedicalTheme.colors.primary[500]} />}
              >
                <EmptyScreen
                  type="no-data"
                  title="No Contact Information"
                  subtitle="Add your contact details and availability to help patients reach you."
                  showRefresh={false}
                  showSupport={false}
                  customIcon={
                    <View style={[profileStyles.iconBackground, { backgroundColor: MedicalTheme.colors.primary[50] }]}>
                      <Ionicons name="business" size={32} color={MedicalTheme.colors.primary[300]} />
                    </View>
                  }
                  actions={[
                    {
                      label: 'Add Contact Info',
                      onPress: () => console.log('Navigate to edit profile'),
                      variant: 'outline',
                      icon: 'edit',
                    },
                  ]}
                />
              </ProfileSection>
            )}

            {/* Professional Information */}
            {(profileData.education || profileData.achievementsAndAwards) ? (
              <ProfileSection
                title="Qualifications"
                icon={<Ionicons name="ribbon" size={20} color={MedicalTheme.colors.primary[500]} />}
              >
                <View style={profileStyles.professionalInfo}>
                  {profileData.education && (
                    <ListSection title="Education" items={profileData.education} />
                  )}
                  {profileData.achievementsAndAwards && (
                    <ListSection title="Achievements & Awards" items={profileData.achievementsAndAwards} />
                  )}
                </View>
              </ProfileSection>
            ) : (
              <ProfileSection
                title="Qualifications"
                icon={<Ionicons name="ribbon" size={20} color={MedicalTheme.colors.primary[500]} />}
              >
                <EmptyScreen
                  type="no-data"
                  title="No Qualifications Added"
                  subtitle="Showcase your education, certifications, and achievements to build trust with patients."
                  showRefresh={false}
                  showSupport={false}
                  customIcon={
                    <View style={[profileStyles.iconBackground, { backgroundColor: MedicalTheme.colors.primary[50] }]}>
                      <Ionicons name="ribbon" size={32} color={MedicalTheme.colors.primary[300]} />
                    </View>
                  }
                  actions={[
                    {
                      label: 'Add Qualifications',
                      onPress: () => console.log('Navigate to edit profile'),
                      variant: 'outline',
                      icon: 'edit',
                    },
                  ]}
                />
              </ProfileSection>
            )}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default DoctorProfileScreen;