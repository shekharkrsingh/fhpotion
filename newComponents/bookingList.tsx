import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/newStore/index';

import AppointmentCard from '@/newComponents/appointmentCard';
import EmptyScreen from '@/newComponents/EmptyScreen';
import { bookingStyles } from '@/assets/styles/booking.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface BookingListProps {
  filteredData: any[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  refreshing: boolean;
  onRefresh: () => void;
  toggleAvailability: (id: string, value: boolean) => void;
  togglePaymentStatus: (id: string) => void;
  toggleTreatedStatus: (id: string) => void;
}

const BookingList: React.FC<BookingListProps> = ({
  filteredData,
  expandedId,
  setExpandedId,
  refreshing,
  onRefresh,
  toggleAvailability,
  togglePaymentStatus,
  toggleTreatedStatus,
}) => {
  const { success, loading } = useSelector((state: RootState) => state.appointments);

  const renderItem = ({ item }: { item: any }) => (
    <AppointmentCard
      item={item}
      isExpanded={item.appointmentId === expandedId}
      onToggleExpand={(id) => setExpandedId(id)}
      toggleAvailability={toggleAvailability}
      togglePaymentStatus={togglePaymentStatus}
      toggleTreatedStatus={toggleTreatedStatus}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={bookingStyles.loadingContainer}>
        <ActivityIndicator size="large" color={MedicalTheme.colors.primary[500]} />
      </View>
    );
  }

  if (!success || filteredData.length === 0) {
    return (
      <EmptyScreen
        type="no-appointments"
        title="No Appointments Found"
        subtitle={filteredData.length === 0 ? 
          "No appointments match your current filters. Try adjusting your search or filters." :
          "We couldn't load your appointments. Please check your connection and try again."
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={[
          {
            label: refreshing ? 'Refreshing...' : 'Refresh',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
        ]}
      />
    );
  }

  return (
    <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={(item) => item.appointmentId}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[MedicalTheme.colors.primary[500]]}
          tintColor={MedicalTheme.colors.primary[500]}
        />
      }
      contentContainerStyle={bookingStyles.listContent}
    />
  );
};

export default BookingList;