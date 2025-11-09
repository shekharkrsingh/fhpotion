import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { bookingHeaderStyles } from '@/assets/styles/booking.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface BookingHeaderProps {
  onSearch: (query: string) => void;
  onEmergency?: () => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ onSearch, onEmergency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Animation for slide effect
  const searchSlide = useRef(new Animated.Value(-60)).current; // Start above the header

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleSearchToggle = () => {
    if (showSearch) {
      // Slide up and hide
      Animated.timing(searchSlide, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSearch(false);
        setSearchQuery('');
        onSearch('');
      });
    } else {
      // Show and slide down
      setShowSearch(true);
      setTimeout(() => {
        Animated.timing(searchSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 10);
    }
  };

  const handleEmergency = () => {
    if (onEmergency) {
      onEmergency();
    } else {
      alert('Emergency protocol activated!');
    }
  };

  return (
    <View style={bookingHeaderStyles.boookingHeader}>
      <View style={bookingHeaderStyles.headerRow}>
        <Text style={bookingHeaderStyles.title}>Booking List</Text>
        
        <View style={bookingHeaderStyles.headerButtons}>
          {/* Emergency Button */}
          {/* <TouchableOpacity
            style={bookingHeaderStyles.emergencyButton}
            onPress={handleEmergency}
          >
            <MaterialIcons 
              name="emergency" 
              size={20} 
              color={MedicalTheme.colors.error[600]} 
            />
            <Text style={bookingHeaderStyles.emergencyButtonText}>
              Emergency
            </Text>
          </TouchableOpacity> */}

          {/* Search Toggle Button */}
          <TouchableOpacity
            style={bookingHeaderStyles.iconButton}
            onPress={handleSearchToggle}
          >
            <MaterialIcons 
              name={showSearch ? "close" : "search"} 
              size={24} 
              color={MedicalTheme.colors.primary[500]} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Search Input - Slides in from top */}
      {showSearch && (
        <Animated.View 
          style={[
            bookingHeaderStyles.searchContainer,
            {
              transform: [{ translateY: searchSlide }],
              marginTop: MedicalTheme.spacing[2],
            }
          ]}
        >
          <TextInput
            style={bookingHeaderStyles.searchInput}
            placeholder="Search by patient name or contact..."
            placeholderTextColor={MedicalTheme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus={true}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default BookingHeader;