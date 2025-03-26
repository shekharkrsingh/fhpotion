import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  TextInput,
  ScrollView,
  Switch,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '@/constants/theme';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';

interface PatientData {
  firstName: string;
  lastName: string;
  contact: string;
  email?: string;
  description?: string;
  timing?: string;
  paymentStatus: boolean;
  availability: boolean;
}

const ModernAppointmentForm = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    contact: '',
    paymentStatus: true,
    availability: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const additionalFieldsHeight = useRef(new Animated.Value(0)).current;
  const additionalFieldsOpacity = useRef(new Animated.Value(0)).current;

  // Initial animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Toggle additional fields with animation
  const toggleAdditionalFields = () => {
    if (showAdditionalFields) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(additionalFieldsHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(additionalFieldsOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      ]).start(() => {
        setShowAdditionalFields(false);
      });
    } else {
      setShowAdditionalFields(true);
      // Expand animation
      Animated.parallel([
        Animated.timing(additionalFieldsHeight, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(additionalFieldsOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
          delay: 100
        })
      ]).start();
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    setPatientData({
      firstName: '',
      lastName: '',
      contact: '',
      paymentStatus: true,
      availability: true,
    });
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setShowAdditionalFields(false);
    // Reset animations when refreshing
    additionalFieldsHeight.setValue(0);
    additionalFieldsOpacity.setValue(0);
    setRefreshing(false);
  }, []);

  const handleChange = (name: keyof PatientData, value: string | boolean) => {
    setPatientData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!patientData.firstName.trim() || !patientData.contact.trim()) {
      Alert.alert("Required Fields", "Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    Alert.alert("Success", "Appointment created successfully!");
    setPatientData({
      firstName: '',
      lastName: '',
      contact: '',
      paymentStatus: true,
      availability: true,
    });
    setShowAdditionalFields(false);
    // Reset animations on successful submission
    additionalFieldsHeight.setValue(0);
    additionalFieldsOpacity.setValue(0);
  };

  // Interpolate height for smooth animation
  const animatedHeight = additionalFieldsHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220] // Adjust based on your content height
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: AppTheme.colors.primaryLight }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? "padding" : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
              progressBackgroundColor={AppTheme.colors.white}
            />
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            <MaterialCommunityIcons 
              name="calendar-plus" 
              size={32} 
              color={AppTheme.colors.white} 
            />
            <Text style={styles.headerTitle}>New Appointment</Text>
            <Text style={styles.headerSubtitle}>Schedule patient consultation</Text>
          </Animated.View>

          {/* Main Form Card */}
          <Animated.View style={[
            styles.card,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            {/* Basic Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Information</Text>
              
              {/* First Name */}
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color={AppTheme.colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="First Name*"
                  placeholderTextColor={AppTheme.colors.gray400}
                  value={patientData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  autoCapitalize="words"
                />
              </View>

              {/* Last Name */}
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color={AppTheme.colors.gray500}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={AppTheme.colors.gray400}
                  value={patientData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  autoCapitalize="words"
                />
              </View>

              {/* Contact */}
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={22}
                  color={AppTheme.colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number*"
                  placeholderTextColor={AppTheme.colors.gray400}
                  value={patientData.contact}
                  onChangeText={(text) => handleChange('contact', text)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Appointment Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appointment Settings</Text>
              
              {/* Payment Status */}
              <View style={styles.settingItem}>
                <View style={styles.settingLabel}>
                  <MaterialCommunityIcons
                    name={patientData.paymentStatus ? "credit-card-check" : "credit-card-remove"}
                    size={22}
                    color={patientData.paymentStatus ? AppTheme.colors.success : AppTheme.colors.danger}
                  />
                  <Text style={styles.settingText}>
                    {patientData.paymentStatus ? 'Payment Confirmed' : 'Payment Pending'}
                  </Text>
                </View>
                <Switch
                  value={patientData.paymentStatus}
                  onValueChange={(value) => handleChange('paymentStatus', value)}
                  thumbColor={AppTheme.colors.white}
                  trackColor={{
                    false: AppTheme.colors.gray200,
                    true: AppTheme.colors.successLight
                  }}
                />
              </View>

              {/* Availability */}
              <View style={styles.settingItem}>
                <View style={styles.settingLabel}>
                  <MaterialCommunityIcons
                    name={patientData.availability ? "calendar-check" : "calendar-remove"}
                    size={22}
                    color={patientData.availability ? AppTheme.colors.success : AppTheme.colors.danger}
                  />
                  <Text style={styles.settingText}>
                    {patientData.availability ? 'Slot Available' : 'Slot Booked'}
                  </Text>
                </View>
                <Switch
                  value={patientData.availability}
                  onValueChange={(value) => handleChange('availability', value)}
                  thumbColor={AppTheme.colors.white}
                  trackColor={{
                    false: AppTheme.colors.gray200,
                    true: AppTheme.colors.successLight
                  }}
                />
              </View>
            </View>

            {/* Additional Fields Toggle */}
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={toggleAdditionalFields}
              activeOpacity={0.8}
            >
              <Text style={styles.expandButtonText}>
                {showAdditionalFields ? 'Hide Additional Details' : 'Show Additional Details'}
              </Text>
              <MaterialCommunityIcons
                name={showAdditionalFields ? "chevron-up" : "chevron-down"}
                size={24}
                color={AppTheme.colors.primary}
              />
            </TouchableOpacity>

            {/* Additional Fields - Animated */}
            <Animated.View 
              style={[
                styles.additionalFieldsContainer,
                { 
                  height: animatedHeight,
                  opacity: additionalFieldsOpacity
                }
              ]}
            >
              {/* Email */}
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color={AppTheme.colors.gray500}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={AppTheme.colors.gray400}
                  value={patientData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Notes */}
              <View style={styles.notesContainer}>
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={22}
                  color={AppTheme.colors.gray500}
                  style={[styles.inputIcon, { alignSelf: 'flex-start' }]}
                />
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Clinical Notes (Symptoms, History, etc.)"
                  placeholderTextColor={AppTheme.colors.gray400}
                  value={patientData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </Animated.View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && { backgroundColor: AppTheme.colors.primaryDark }
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={AppTheme.colors.white} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={22}
                    color={AppTheme.colors.white}
                  />
                  <Text style={styles.submitButtonText}>Confirm Appointment</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: AppTheme.colors.primary,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppTheme.colors.white,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppTheme.colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    margin: 16,
    marginTop: -20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.colors.gray700,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.gray100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.gray100,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: AppTheme.colors.gray800,
    paddingVertical: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.gray100,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.gray100,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    color: AppTheme.colors.gray700,
    marginLeft: 12,
  },
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppTheme.colors.gray100,
    marginBottom: 6,
  },
  expandButtonText: {
    color: AppTheme.colors.primary,
    fontWeight: '500',
    fontSize: 15,
  },
  additionalFieldsContainer: {
    overflow: 'hidden',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
});

export default ModernAppointmentForm;