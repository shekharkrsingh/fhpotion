// bookingFilterButtons.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { bookingStyles } from '@/assets/styles/booking.styles';

interface FilterOption {
  key: string;
  label: string;
}

interface BookingFilterButtonsProps {
  availabilityFilter: string;
  setAvailabilityFilter: (filter: string) => void;
  selectedMarkAction: 'treated' | 'emergency' | 'cancel' | 'edit';
}

const BookingFilterButtons: React.FC<BookingFilterButtonsProps> = ({
  availabilityFilter,
  setAvailabilityFilter,
  selectedMarkAction,
}) => {
  const getFilterOptions = (): FilterOption[] => {
    switch (selectedMarkAction) {
      case 'treated':
        return [
          { key: 'available', label: 'Available' },
          { key: 'treated', label: 'Treated' },
          { key: 'all', label: 'All' },
        ];
      
      case 'emergency':
        return [
          { key: 'emergency', label: 'Emergency' },
          { key: 'non-emergency', label: 'Non-Emergency' },
          { key: 'all', label: 'All' },
        ];
      
      case 'cancel':
        return [
          { key: 'cancelled', label: 'Cancelled' },
          { key: 'cancellable', label: 'Cancellable' },
          { key: 'all', label: 'All' },
        ];
      
      case 'edit':
        return [
          { key: 'editable', label: 'Editable' },
          { key: 'all', label: 'All' },
        ];
      
      default:
        return [
          { key: 'available', label: 'Available' },
          { key: 'treated', label: 'Treated' },
          { key: 'all', label: 'All' },
        ];
    }
  };

  const filters = getFilterOptions();

  return (
    <View style={bookingStyles.filterButtonsContainer}>
      {filters.map((filter) => (
        <Pressable
          key={filter.key}
          style={({ pressed }) => [
            bookingStyles.filterButton,
            availabilityFilter === filter.key && bookingStyles.activeButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => setAvailabilityFilter(filter.key)}
        >
          <Text
            style={[
              bookingStyles.filterText,
              availabilityFilter === filter.key && bookingStyles.activeFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BookingFilterButtons;