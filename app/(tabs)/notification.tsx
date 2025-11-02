import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import { 
  markAllNotificationAsRead, 
  markNotificationAsRead, 
  getAllNotification 
} from '@/service/properties/notificationApi';

import NotificationHeader from '@/newComponents/notificationHeader';
import NotificationList from '@/newComponents/notificationList';
import { notificationStyles } from '@/assets/styles/notification.styles';

const NotificationScreen = () => {
  const dispatch = useDispatch();
  
  const { notifications, isLoading } = useSelector((state: RootState) => state.notification);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    await getAllNotification(dispatch);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllNotificationAsRead(dispatch);
  };

  // Handle individual notification click
  const handleNotificationPress = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationAsRead(dispatch, notificationId);
    }
    // You can add additional navigation logic here if needed
  };

  return (
    <View style={notificationStyles.container}>
      <NotificationHeader 
        onMarkAllAsRead={handleMarkAllAsRead}
        isLoading={isLoading}
      />
      
      <NotificationList
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onNotificationPress={handleNotificationPress}
      />
    </View>
  );
};

export default NotificationScreen;