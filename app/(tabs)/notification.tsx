import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/newStore/index';
import { 
  fetchAllNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/newService/config/api/notificationApi';

import NotificationHeader from '@/newComponents/notificationHeader';
import NotificationList from '@/newComponents/notificationList';
import LoadingState from '@/newComponents/loadingState';
import ErrorState from '@/newComponents/errorState';
import EmptyScreen from '@/newComponents/EmptyScreen';
import { notificationStyles } from '@/assets/styles/notification.styles';

const NotificationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { notifications, isLoading, error } = useSelector((state: RootState) => state.notification);
  const [refreshing, setRefreshing] = useState(false);
  const hasAttemptedInitialLoad = React.useRef(false);

  // Load notifications on component mount - ONLY ONCE
  useEffect(() => {
    // Only attempt initial load once - prevents infinite loops on API failures
    if (!hasAttemptedInitialLoad.current) {
      hasAttemptedInitialLoad.current = true;
      loadNotifications();
    }
  }, []); // Empty deps - only run once on mount

  const loadNotifications = async () => {
    await dispatch(fetchAllNotifications());
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  // Handle individual notification click
  const handleNotificationPress = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await dispatch(markNotificationAsRead(notificationId));
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={notificationStyles.container}>
        <LoadingState message="Loading notifications..." />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={notificationStyles.container}>
        <ErrorState 
          title="Failed to Load Notifications"
          message={error || "We couldn't load your notifications. Please check your connection and try again."}
          onRetry={loadNotifications}
          retryLabel="Retry"
        />
      </View>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <View style={notificationStyles.container}>
        <EmptyScreen
          type="no-notifications"
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  }

  return (
    <>
      <View style={notificationStyles.container}>
        <NotificationHeader 
          onMarkAllAsRead={handleMarkAllAsRead}
          isLoading={isLoading}
        />
      
      <NotificationList
        notifications={notifications}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onNotificationPress={handleNotificationPress}
      />
      </View>
    </>
  );
};

export default NotificationScreen;