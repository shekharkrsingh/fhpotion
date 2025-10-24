import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AppTheme } from '@/constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getProfile } from '@/service/properties/profileApi';
import { useDispatch } from 'react-redux';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy image URLs
const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  doctorId: string;
  specialization: string;
  phoneNumber: string;
  availableDays: string[];
  availableTimeSlots: TimeSlot[];
  clinicAddress: string;
  address: Address;
  education: string[];
  achievementsAndAwards: string[];
  about: string;
  bio: string;
  yearsOfExperience: number;
  gender: string;
  profilePicture: string;
  coverPicture: string;
}

const DoctorProfileScreen = () => {
  const profileData = useSelector((state: RootState) => state.profile);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await getProfile(dispatch);
    } catch (err) {
      setError('Failed to refresh profile data');
      console.error('Failed to refresh profile:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const formatAvailableDays = (days: string[]) => {
    if (!days || days.length === 0) return 'Not specified';
    return days.join(', ');
  };

  const formatTimeSlots = (slots: TimeSlot[]) => {
    if (!slots || slots.length === 0) return 'Not specified';
    return slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  };

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    if (!content) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {typeof content === 'string' ? (
          <Text style={styles.sectionContent}>{content}</Text>
        ) : (
          content
        )}
      </View>
    );
  };

  const renderInfoRow = (icon: React.ReactNode, text: string, isLast = false) => {
    if (!text) return null;
    
    return (
      <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
        <View style={styles.infoIcon}>
          {icon}
        </View>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    );
  };

  const renderListItems = (items: string[], title: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>{title}</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const getExperienceColor = (years: number) => {
    if (years >= 20) return '#FF6B35';
    if (years >= 10) return '#4ECDC4';
    if (years >= 5) return '#45B7D1';
    return '#96CEB4';
  };

  if (!profileData.success) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
              progressBackgroundColor={AppTheme.colors.white}
            />
          }
        >
          {/* Enhanced Cover Section */}
          <View style={styles.coverContainer}>
            <Image 
              source={{ uri: profileData.coverPicture || DEFAULT_COVER_IMAGE }} 
              style={styles.coverPhoto} 
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
              style={styles.coverGradient}
            />
            
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Header with Enhanced Design */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: profileData.profilePicture || DEFAULT_PROFILE_IMAGE }} 
                style={styles.profileImage} 
              />
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.basicInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  Dr. {profileData.firstName} {profileData.lastName}
                </Text>
                <MaterialIcons name="verified" size={20} color="#4CAF50" />
              </View>
              
              {profileData.specialization && (
                <Text style={styles.specialization}>{profileData.specialization}</Text>
              )}
              
              {profileData.yearsOfExperience && (
                <View style={[styles.experienceBadge, { backgroundColor: getExperienceColor(profileData.yearsOfExperience) }]}>
                  <FontAwesome5 name="award" size={12} color="#fff" />
                  <Text style={styles.experienceText}>{profileData.yearsOfExperience}+ Years</Text>
                </View>
              )}
            </View>
          </View>

          {/* Enhanced Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={() => router.navigate("/editProfile")}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <AntDesign name="edit" size={18} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.settingsButton]}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.buttonGradient}
              >
                <AntDesign name="setting" size={18} color="#fff" />
                <Text style={styles.buttonText}>Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.bookButton]}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.buttonGradient}
              >
                <Ionicons name="calendar" size={16} color="#fff" />
                <Text style={styles.buttonText}>Book</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Enhanced Details Section */}
          <View style={styles.detailsContainer}>
            {/* About Section */}
            {renderSection(
              'Professional Summary',
              <Ionicons name="document-text" size={20} color={AppTheme.colors.primary} />,
              profileData.about
            )}

            {/* Bio Section */}
            {renderSection(
              'Biography',
              <FontAwesome5 name="user-md" size={18} color={AppTheme.colors.primary} />,
              profileData.bio
            )}

            {/* Contact Information */}
            {(profileData.phoneNumber || profileData.clinicAddress || 
              (profileData.availableDays && profileData.availableTimeSlots)) && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="business" size={20} color={AppTheme.colors.primary} />
                  <Text style={styles.sectionTitle}>Contact & Availability</Text>
                </View>
                <View style={styles.infoContainer}>
                  {profileData.phoneNumber && renderInfoRow(
                    <Ionicons name="call" size={16} color={AppTheme.colors.primary} />,
                    profileData.phoneNumber
                  )}
                  {profileData.clinicAddress && renderInfoRow(
                    <Ionicons name="location" size={16} color={AppTheme.colors.primary} />,
                    profileData.clinicAddress
                  )}
                  {profileData.availableDays && profileData.availableTimeSlots && renderInfoRow(
                    <Ionicons name="time" size={16} color={AppTheme.colors.primary} />,
                    `${formatAvailableDays(profileData.availableDays)}, ${formatTimeSlots(profileData.availableTimeSlots)}`,
                    true
                  )}
                </View>
              </View>
            )}

            {/* Professional Information */}
            {(profileData.education || profileData.achievementsAndAwards) && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="ribbon" size={20} color={AppTheme.colors.primary} />
                  <Text style={styles.sectionTitle}>Qualifications</Text>
                </View>
                <View style={styles.professionalInfo}>
                  {profileData.education && renderListItems(profileData.education, "Education")}
                  {profileData.achievementsAndAwards && renderListItems(profileData.achievementsAndAwards, "Achievements & Awards")}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  coverContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  coverPhoto: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: -60,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 6,
  },
  specialization: {
    fontSize: 16,
    color: AppTheme.colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  experienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  experienceText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginVertical: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  editButton: {
    shadowColor: '#667eea',
  },
  settingsButton: {
    shadowColor: '#f5576c',
  },
  bookButton: {
    shadowColor: '#4facfe',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  infoContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
  },
  professionalInfo: {
    gap: 16,
  },
  listContainer: {
    gap: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppTheme.colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  listText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default DoctorProfileScreen;