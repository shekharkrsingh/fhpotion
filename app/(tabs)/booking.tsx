import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import BookingHeader from '@/componets/BookingHeader';
import AppointmentCard from '@/componets/AppointmentCard';
import { AppTheme } from '@/constants/theme';

interface BookingItem {
  id: string;
  name: string;
  timing: string;
  contact: string;
  description: string;
  avatar: string;
  available: boolean;
  paid: boolean;
  treated: boolean;
}

export default function BookingScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
   const [data, setData] = useState<BookingItem[]>([
    {
        id: '1',
        name: 'John Doe',
        timing: '9:00 AM - 5:00 PM',
        contact: '9549964878',
        description: 'Software Developer',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '2',
        name: 'Jane Smith',
        timing: '10:00 AM - 6:00 PM',
        contact: '9345632871',
        description: 'UX Designer',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '3',
        name: 'Tom Harris',
        timing: '8:00 AM - 4:00 PM',
        contact: '9841237654',
        description: 'Data Analyst',
        avatar: 'https://via.placeholder.com/50',
        available: true,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '4',
        name: 'Sarah Lee',
        timing: '11:00 AM - 7:00 PM',
        contact: '9578463021',
        description: 'Product Manager',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '5',
        name: 'Michael Brown',
        timing: '9:30 AM - 5:30 PM',
        contact: '9703225678',
        description: 'Marketing Specialist',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '6',
        name: 'Lisa White',
        timing: '9:00 AM - 6:00 PM',
        contact: '9847765453',
        description: 'Product Designer',
        avatar: 'https://via.placeholder.com/50',
        available: true,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '7',
        name: 'David Green',
        timing: '10:30 AM - 4:30 PM',
        contact: '9708254637',
        description: 'Business Analyst',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '8',
        name: 'Emma Harris',
        timing: '8:00 AM - 5:00 PM',
        contact: '9999999888',
        description: 'Software Engineer',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '9',
        name: 'Sophia Johnson',
        timing: '9:30 AM - 6:00 PM',
        contact: '9876543210',
        description: 'Account Manager',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '10',
        name: 'James Lee',
        timing: '7:00 AM - 3:00 PM',
        contact: '9000456789',
        description: 'DevOps Engineer',
        avatar: 'https://via.placeholder.com/50',
        available: true,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '11',
        name: 'Olivia Martinez',
        timing: '9:00 AM - 4:00 PM',
        contact: '9543245678',
        description: 'HR Manager',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '12',
        name: 'Lucas Perez',
        timing: '10:00 AM - 5:00 PM',
        contact: '9537641823',
        description: 'Graphic Designer',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '13',
        name: 'Chloe Wilson',
        timing: '8:00 AM - 4:30 PM',
        contact: '9551239876',
        description: 'Business Development',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: false,
        treated: false, // Add treated field
      },
      {
        id: '14',
        name: 'Mason Walker',
        timing: '9:00 AM - 6:00 PM',
        contact: '9876954321',
        description: 'SEO Specialist',
        avatar: 'https://via.placeholder.com/50',
        available: false,
        paid: true,
        treated: false, // Add treated field
      },
      {
        id: '15',
        name: 'Ava Scott',
        timing: '9:30 AM - 5:30 PM',
        contact: '9018234567',
        description: 'Social Media Manager',
        avatar: 'https://via.placeholder.com/50',
        available: true,
        paid: true,
        treated: false, // Add treated field
      },
    // Add other initial booking items with the "treated" field
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'treated'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const handleSearch = (query: string) => setSearchQuery(query);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    switch (availabilityFilter) {
      case 'available':
        filtered = filtered.filter(item => item.available && item.paid && !item.treated);
        break;
      case 'treated':
        filtered = filtered.filter(item => item.treated);
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact.includes(searchQuery)
      );
    }

    return filtered;
  }, [data, availabilityFilter, searchQuery]);

  const toggleAvailability = (id: string, value: boolean) => {
    const itemToToggle = data.find(item => item.id === id);
    if (itemToToggle && itemToToggle.paid) {
      const newData = data.map(item =>
        item.id === id ? { ...item, available: value } : item
      );
      setData(newData);
    } else {
      alert('Cannot change availability status. Payment is required before changing availability.');
    }
  };

  const togglePaymentStatus = (id: string) => {
    const newData = data.map(item =>
      item.id === id ? { ...item, paid: !item.paid } : item
    );
    setData(newData);
  };

  const toggleTreatedStatus = (id: string) => {
    const newData = data.map(item => {
      if (item.id === id) {
        if (item.paid && item.available) {
          return { ...item, treated: !item.treated };
        } else {
          alert('Item must be paid and available to toggle the treated status.');
          return item;
        }
      }
      return item;
    });
    setData(newData);
  };
  
  const renderItem = ({ item }: { item: BookingItem }) => (
    <AppointmentCard
      item={item}
      isExpanded={item.id === expandedId}
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

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
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
});