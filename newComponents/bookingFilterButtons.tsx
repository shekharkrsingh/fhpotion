import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { bookingStyles } from '@/assets/styles/booking.styles';

interface BookingFilterButtonsProps {
  availabilityFilter: 'all' | 'available' | 'treated';
  setAvailabilityFilter: (filter: 'all' | 'available' | 'treated') => void;
}

const BookingFilterButtons: React.FC<BookingFilterButtonsProps> = ({
  availabilityFilter,
  setAvailabilityFilter,
}) => {
  const filters = [
    { key: 'available' as const, label: 'Available' },
    { key: 'treated' as const, label: 'Treated' },
    { key: 'all' as const, label: 'All' },
  ];

  return (
    <View style={bookingStyles.filterButtonsContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            bookingStyles.filterButton,
            availabilityFilter === filter.key && bookingStyles.activeButton,
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BookingFilterButtons;