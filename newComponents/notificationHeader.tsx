import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { notificationStyles } from '@/assets/styles/notification.styles';

interface NotificationHeaderProps {
  onMarkAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onMarkAllAsRead,
  isLoading,
}) => {
  return (
    <View style={notificationStyles.header}>
      <Text style={notificationStyles.headerTitle}>Notifications</Text>
      <TouchableOpacity 
        onPress={onMarkAllAsRead} 
        disabled={isLoading}
      >
        <Text style={[
          notificationStyles.markAllRead,
          { opacity: isLoading ? 0.5 : 1 }
        ]}>
          Mark all as read
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationHeader;