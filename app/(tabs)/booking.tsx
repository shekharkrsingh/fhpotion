import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import BookingHeader from '@/componets/BookingHeader';
import AppointmentCard from '@/componets/AppointmentCard';
import { AppTheme } from '@/constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAppointments, updateAppointment } from '@/service/properties/appointmentApi';
import { useDispatch } from 'react-redux';

interface BookingItem {
  appointmentId: string;
    doctorId: string;
    patientName: string;
    contact: string;
    description: string | null;
    appointmentDateTime: string;
    bookingDateTime: string;
    availableAtClinic: boolean;
    treated: boolean;
    treatedDateTime: string | null;
    status: string;
    appointmentType: string;
    paymentStatus: boolean;
}

export default function BookingScreen() {
  const { data, loading, error, success} = useSelector((state: RootState) => state.appointments);
  const dispatch=useDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // const data = [
  //   {
  //     appointmentId: "apt-001",
  //     doctorId: "doc-101",
  //     patientName: "John Smith",
  //     contact: "john.smith@example.com",
  //     description: "Annual checkup and vaccination",
  //     appointmentDateTime: "2023-11-15T09:30:00",
  //     bookingDateTime: "2023-11-01T14:15:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "general",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-002",
  //     doctorId: "doc-101",
  //     patientName: "Sarah Johnson",
  //     contact: "sarahj@example.com",
  //     description: "Follow-up for blood test results",
  //     appointmentDateTime: "2023-11-15T10:15:00",
  //     bookingDateTime: "2023-11-03T10:45:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "follow-up",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-003",
  //     doctorId: "doc-102",
  //     patientName: "Michael Brown",
  //     contact: "mbrown@example.com",
  //     description: "Dental cleaning and examination",
  //     appointmentDateTime: "2023-11-16T11:00:00",
  //     bookingDateTime: "2023-10-30T16:20:00",
  //     availableAtClinic: false,
  //     treated: true,
  //     treatedDateTime: "2023-11-16T11:45:00",
  //     status: "completed",
  //     appointmentType: "dental",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-004",
  //     doctorId: "doc-103",
  //     patientName: "Emily Davis",
  //     contact: "emily.d@example.com",
  //     description: "Initial consultation for back pain",
  //     appointmentDateTime: "2023-11-17T14:00:00",
  //     bookingDateTime: "2023-11-10T09:30:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "pending",
  //     appointmentType: "consultation",
  //     paymentStatus: false
  //   },
  //   {
  //     appointmentId: "apt-005",
  //     doctorId: "doc-101",
  //     patientName: "Robert Wilson",
  //     contact: "robertw@example.com",
  //     description: "Vaccination booster shot",
  //     appointmentDateTime: "2023-11-18T15:30:00",
  //     bookingDateTime: "2023-11-05T11:15:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "vaccination",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-006",
  //     doctorId: "doc-104",
  //     patientName: "Jennifer Lee",
  //     contact: "j.lee@example.com",
  //     description: "Physical therapy session",
  //     appointmentDateTime: "2023-11-19T10:00:00",
  //     bookingDateTime: "2023-11-12T13:45:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "therapy",
  //     paymentStatus: false
  //   },
  //   {
  //     appointmentId: "apt-007",
  //     doctorId: "doc-102",
  //     patientName: "David Miller",
  //     contact: "davidm@example.com",
  //     description: "Emergency tooth extraction",
  //     appointmentDateTime: "2023-11-20T16:00:00",
  //     bookingDateTime: "2023-11-20T10:30:00",
  //     availableAtClinic: true,
  //     treated: true,
  //     treatedDateTime: "2023-11-20T17:15:00",
  //     status: "completed",
  //     appointmentType: "emergency",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-008",
  //     doctorId: "doc-103",
  //     patientName: "Jessica Taylor",
  //     contact: "jess.t@example.com",
  //     description: "Routine physical examination",
  //     appointmentDateTime: "2023-11-21T09:00:00",
  //     bookingDateTime: "2023-11-15T14:00:00",
  //     availableAtClinic: false,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "general",
  //     paymentStatus: true
  //   },
  //   {
  //     appointmentId: "apt-009",
  //     doctorId: "doc-101",
  //     patientName: "Daniel Anderson",
  //     contact: "daniel.a@example.com",
  //     description: "Blood pressure monitoring",
  //     appointmentDateTime: "2023-11-22T11:30:00",
  //     bookingDateTime: "2023-11-18T15:45:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "pending",
  //     appointmentType: "monitoring",
  //     paymentStatus: false
  //   },
  //   {
  //     appointmentId: "apt-010",
  //     doctorId: "doc-104",
  //     patientName: "Amanda White",
  //     contact: "awhite@example.com",
  //     description: "Post-surgery rehabilitation",
  //     appointmentDateTime: "2023-11-23T13:15:00",
  //     bookingDateTime: "2023-11-10T11:20:00",
  //     availableAtClinic: true,
  //     treated: false,
  //     treatedDateTime: null,
  //     status: "confirmed",
  //     appointmentType: "rehabilitation",
  //     paymentStatus: true
  //   }
  // ];
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'treated'>('all');
  const [searchQuery, setSearchQuery] = useState('');


 

  const fetchData = async () => {
    await getAppointments(dispatch);
  };

  const update = async (id: string,change: any) => {
    await updateAppointment(dispatch, id, change);
  };



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const handleSearch = (query: string) => setSearchQuery(query);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    switch (availabilityFilter) {
      case 'available':
        filtered = filtered.filter(item => item.availableAtClinic && item.paymentStatus && !item.treated);
        break;
      case 'treated':
        filtered = filtered.filter(item => item.treated);
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact.includes(searchQuery)
      );
    }

    return filtered;
  }, [data, availabilityFilter, searchQuery]);

  const toggleAvailability = async (id: string, value: boolean) => {
    const itemToToggle = data.find((item) => item.appointmentId === id);

    if (itemToToggle && itemToToggle.paymentStatus) {
        // Update the availability field
        await update(id, { availableAtClinic: value });
    } else {
        alert("Cannot change availability status. Payment is required before changing availability.");
    }
};

  const togglePaymentStatus = (id: string) => {
    data.filter( async (item) =>{
      if(item.appointmentId===id){
        await update(id, {paymentStatus: !item.paymentStatus});
      }
    }
    );
    
  };

  const toggleTreatedStatus = async (id: string) => {
    const itemToUpdate = data.find(item => item.appointmentId === id);

    if (!itemToUpdate) {
        alert("Appointment not found.");
        return;
    }

    if (!itemToUpdate.paymentStatus || !itemToUpdate.availableAtClinic) {
        alert("Item must be paid and available to toggle the treated status.");
        return;
    }

    const updatedTreatedStatus = !itemToUpdate.treated;

    await update(id, { treated: updatedTreatedStatus });
};

  
  const renderItem = ({ item }: { item: BookingItem }) => (
    <AppointmentCard
      item={item}
      isExpanded={item.appointmentId === expandedId}
      onToggleExpand={(id) => setExpandedId(id)}
      toggleAvailability={toggleAvailability}
      togglePaymentStatus={togglePaymentStatus}
      toggleTreatedStatus={toggleTreatedStatus}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: AppTheme.colors.primaryLight }}>
      <View style={[styles.container, { backgroundColor: AppTheme.colors.gray100 }]}>
        <BookingHeader toggleModal={toggleModal} onSearch={handleSearch} />
        
        <View style={styles.filterButtonsContainer}>
          {['available', 'treated', 'all'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                availabilityFilter === filter && styles.activeButton,
              ]}
              onPress={() => setAvailabilityFilter(filter as 'available' | 'treated' | 'all')}
            >
              <Text style={[
                styles.filterText,
                availabilityFilter === filter && styles.activeFilterText,
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {success ?(<FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.appointmentId}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />):(
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={AppTheme.colors.primary} />
                  {/* <Text style={styles.loadingText}>Loading profile...</Text> */}
                </View>
        )
        
        }
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.sm,
    // backgroundColor: AppTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.gray200,
  },
  filterButton: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    marginHorizontal: AppTheme.spacing.xs,
  },
  activeButton: {
    backgroundColor: AppTheme.colors.primary,
  },
  filterText: {
    color: AppTheme.colors.gray600,
    fontWeight: '500',
  },
  activeFilterText: {
    color: AppTheme.colors.white,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: AppTheme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primaryLight,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppTheme.colors.primary,
  },
});