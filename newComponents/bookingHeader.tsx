import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Animated, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { bookingHeaderStyles } from '@/assets/styles/booking.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface BookingHeaderProps {
  onSearch: (query: string) => void;
  onMarkAction?: (action: 'treated' | 'emergency' | 'cancel' | 'edit') => void;
}

type MarkAction = 'treated' | 'emergency' | 'cancel' | 'edit';

const BookingHeader: React.FC<BookingHeaderProps> = ({ onSearch, onMarkAction }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMarkDropdown, setShowMarkDropdown] = useState(false);
  const [selectedMarkAction, setSelectedMarkAction] = useState<MarkAction>('treated');
  
  const searchSlide = useRef(new Animated.Value(-60)).current;

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleSearchToggle = () => {
    if (showSearch) {
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

  const handleMarkActionSelect = (action: MarkAction) => {
    setSelectedMarkAction(action);
    setShowMarkDropdown(false);
    if (onMarkAction) {
      onMarkAction(action);
    }
  };

  const getMarkActionIcon = (action: MarkAction) => {
    switch (action) {
      case 'emergency':
        return 'emergency';
      case 'cancel':
        return 'cancel';
      case 'edit':
        return 'edit';
      case 'treated':
      default:
        return 'check-circle';
    }
  };

  const getMarkActionColor = (action: MarkAction) => {
    switch (action) {
      case 'emergency':
        return MedicalTheme.colors.error[600];
      case 'cancel':
        return MedicalTheme.colors.warning[600];
      case 'edit':
        return MedicalTheme.colors.primary[500];
      case 'treated':
      default:
        return MedicalTheme.colors.success[600];
    }
  };

  return (
    <View style={[
      bookingHeaderStyles.boookingHeader,
      { paddingTop: insets.top + MedicalTheme.spacing[3] }
    ]}>
      <View style={bookingHeaderStyles.headerRow}>
        <Text style={bookingHeaderStyles.title}>Booking List</Text>
        
        <View style={bookingHeaderStyles.headerButtons}>
          <Pressable
            style={({ pressed }) => [
              bookingHeaderStyles.markButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => setShowMarkDropdown(true)}
          >
            <MaterialIcons 
              name={getMarkActionIcon(selectedMarkAction)} 
              size={20} 
              color={getMarkActionColor(selectedMarkAction)} 
            />
            <Text style={bookingHeaderStyles.markButtonText}>
              Mark
            </Text>
            <MaterialIcons 
              name="arrow-drop-down" 
              size={16} 
              color={MedicalTheme.colors.text.secondary} 
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              bookingHeaderStyles.iconButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={handleSearchToggle}
          >
            <MaterialIcons 
              name={showSearch ? "close" : "search"} 
              size={24} 
              color={MedicalTheme.colors.primary[500]} 
            />
          </Pressable>
        </View>
      </View>

      <Modal
        visible={showMarkDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMarkDropdown(false)}
      >
        <Pressable 
          style={bookingHeaderStyles.dropdownOverlay}
          onPress={() => setShowMarkDropdown(false)}
        >
          <Pressable 
            style={bookingHeaderStyles.dropdownContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              style={({ pressed }) => [
                bookingHeaderStyles.dropdownItem,
                selectedMarkAction === 'treated' && bookingHeaderStyles.dropdownItemSelected,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => handleMarkActionSelect('treated')}
            >
              <MaterialIcons 
                name="check-circle" 
                size={20} 
                color={MedicalTheme.colors.success[600]} 
              />
              <Text style={bookingHeaderStyles.dropdownItemText}>Treated</Text>
              {selectedMarkAction === 'treated' && (
                <MaterialIcons 
                  name="check" 
                  size={16} 
                  color={MedicalTheme.colors.success[600]} 
                />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                bookingHeaderStyles.dropdownItem,
                selectedMarkAction === 'emergency' && bookingHeaderStyles.dropdownItemSelected,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => handleMarkActionSelect('emergency')}
            >
              <MaterialIcons 
                name="emergency" 
                size={20} 
                color={MedicalTheme.colors.error[600]} 
              />
              <Text style={bookingHeaderStyles.dropdownItemText}>Emergency</Text>
              {selectedMarkAction === 'emergency' && (
                <MaterialIcons 
                  name="check" 
                  size={16} 
                  color={MedicalTheme.colors.error[600]} 
                />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                bookingHeaderStyles.dropdownItem,
                selectedMarkAction === 'cancel' && bookingHeaderStyles.dropdownItemSelected,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => handleMarkActionSelect('cancel')}
            >
              <MaterialIcons 
                name="cancel" 
                size={20} 
                color={MedicalTheme.colors.warning[600]} 
              />
              <Text style={bookingHeaderStyles.dropdownItemText}>Cancel</Text>
              {selectedMarkAction === 'cancel' && (
                <MaterialIcons 
                  name="check" 
                  size={16} 
                  color={MedicalTheme.colors.warning[600]} 
                />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                bookingHeaderStyles.dropdownItem,
                selectedMarkAction === 'edit' && bookingHeaderStyles.dropdownItemSelected,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => handleMarkActionSelect('edit')}
            >
              <MaterialIcons 
                name="edit" 
                size={20} 
                color={MedicalTheme.colors.primary[500]} 
              />
              <Text style={bookingHeaderStyles.dropdownItemText}>Edit</Text>
              {selectedMarkAction === 'edit' && (
                <MaterialIcons 
                  name="check" 
                  size={16} 
                  color={MedicalTheme.colors.primary[500]} 
                />
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

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
