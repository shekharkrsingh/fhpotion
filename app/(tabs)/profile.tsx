import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import COLORS from '@/constants/colors';
import { AppTheme } from '@/constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { width } = Dimensions.get('window');

// Dummy image URLs
const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const DEFAULT_COVER_IMAGE = 'https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg';

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
  profilePicture?: string;
  coverPicture?: string;
}

const DoctorProfileScreen = () => {
  const profileData = useSelector((state: RootState) => state.profile)
  // const profileData = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   doctorId: "DOC789012",
  //   specialization: "Cardiologist",
  //   phoneNumber: "+1 987 654 3210",
  //   availableDays: ["Monday", "Wednesday", "Friday"],
  //   availableTimeSlots: [
  //     {
  //       startTime: "09:00 AM",
  //       endTime: "12:00 PM"
  //     },
  //     {
  //       startTime: "02:00 PM",
  //       endTime: "05:00 PM"
  //     }
  //   ],
  //   clinicAddress: "123 Heart Lane, Cardiology Center, 10101",
  //   address: {
  //     street: "456 Health Ave",
  //     city: "Medville",
  //     postalCode: "10101",
  //     state: "Health State",
  //     country: "Medland"
  //   },
  //   education: [
  //     "MD in Cardiology from Prestigious Medical University",
  //     "Board Certified in Cardiovascular Disease"
  //   ],
  //   achievementsAndAwards: [
  //     "Best Cardiologist Award 2022",
  //     "Top Doctor in Cardiology 2021-2023"
  //   ],
  //   about: "Dr. John Doe is a highly skilled cardiologist with extensive experience in diagnosing and treating heart conditions. He is dedicated to providing compassionate care and the latest treatment options to his patients.",
  //   bio: "I am passionate about cardiovascular health and committed to helping patients achieve their best heart health through personalized care plans.",
  //   yearsOfExperience: 12,
  //   gender: "MALE",
  //   profilePicture: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
  //   coverPicture: "https://img.freepik.com/free-photo/medical-banner-with-doctor-wearing-gown_23-2149611198.jpg"
  // };

  const formatAvailableDays = (days: string[]) => {
    if (!days || days.length === 0) return 'Not specified';
    return days.join(', ');
  };

  const formatTimeSlots = (slots: TimeSlot[]) => {
    if (!slots || slots.length === 0) return 'Not specified';
    return slots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  };

  const renderSection = (title: string, icon: string, content: React.ReactNode) => {
    if (!content) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={icon as any} size={20} color={AppTheme.colors.primary} />
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

  const renderInfoRow = (icon: string, text: string) => {
    if (!text) return null;
    
    return (
      <View style={styles.infoRow}>
        <Ionicons name={icon as any} size={18} color={AppTheme.colors.primary} />
        <Text style={styles.infoText}>{text}</Text>
      </View>
    );
  };

  const renderListItems = (items: string[]) => {
    if (!items || items.length === 0) return null;
    
    return (
      <View>
        {items.map((item, index) => (
          <View key={index} style={styles.infoRow}>
            <Ionicons name="ellipse" size={8} color={AppTheme.colors.primary} />
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: profileData.coverPicture || DEFAULT_COVER_IMAGE }} 
            style={styles.coverPhoto} 
            blurRadius={1}
          />
          <View style={styles.coverOverlay}/>
          {profileData.bio && (
            <View style={styles.coverTextContainer}>
              <Text style={styles.coverText}>{profileData.bio}</Text>
            </View>
          )}
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileData.profilePicture || DEFAULT_PROFILE_IMAGE }} 
              style={styles.profileImage} 
            />
            {/* <View style={styles.onlineIndicator} /> */}
          </View>

          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.name}>
              Dr. {profileData.firstName} {profileData.lastName}
            </Text>
            {profileData.specialization && (
              <Text style={styles.specialization}>{profileData.specialization}</Text>
            )}
            {profileData.doctorId && (
              <View style={styles.idContainer}>
                <MaterialIcons name="verified" size={16} color="#4CAF50" />
                <Text style={styles.idText}>{profileData.doctorId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.callButton]}>
            <AntDesign name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.messageButton]}>
            <AntDesign name="setting" size={24} color="#fff" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.bookButton]}>
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={styles.buttonText}>Book</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          {/* About Section */}
          {renderSection('About', 'information-circle', profileData.about)}

          {/* Bio Section */}
          {renderSection('Bio', 'document-text', profileData.bio)}

          {/* Contact Info */}
          {profileData.phoneNumber || profileData.clinicAddress || 
           (profileData.availableDays && profileData.availableTimeSlots) ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="call" size={20} color={AppTheme.colors.primary} />
                <Text style={styles.sectionTitle}>Contact Information</Text>
              </View>
              {renderInfoRow('call', profileData.phoneNumber)}
              {renderInfoRow('location', profileData.clinicAddress)}
              {profileData.availableDays && profileData.availableTimeSlots && (
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={18} color={AppTheme.colors.primary} />
                  <Text style={styles.infoText}>
                    {formatAvailableDays(profileData.availableDays)}, {formatTimeSlots(profileData.availableTimeSlots)}
                  </Text>
                </View>
              )}
            </View>
          ) : null}

          {/* Professional Info */}
          {profileData.education || profileData.achievementsAndAwards || profileData.yearsOfExperience ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase" size={20} color={AppTheme.colors.primary} />
                <Text style={styles.sectionTitle}>Professional Information</Text>
              </View>
              {renderListItems(profileData.education)}
              {renderListItems(profileData.achievementsAndAwards)}
              {profileData.yearsOfExperience && (
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={18} color={AppTheme.colors.primary} />
                  <Text style={styles.infoText}>
                    {profileData.yearsOfExperience} years of experience
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Fixed Footer */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 H Potion</Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.primaryLight,
  },
  scrollContainer: {
    paddingBottom: 60, // Add padding for the footer
  },
  coverContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhoto: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  coverTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    marginTop: -70,
  },
  profileImageContainer: {
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0', // Background color for placeholder
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  specialization: {
    fontSize: 16,
    color: AppTheme.colors.primary,
    fontWeight: '600',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  idText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  messageButton: {
    backgroundColor: '#2196F3',
  },
  bookButton: {
    backgroundColor: '#FF5722',
    width: '35%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
});

export default DoctorProfileScreen;