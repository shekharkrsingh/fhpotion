import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
      <Pressable 
        onPress={onMarkAllAsRead} 
        disabled={isLoading}
        style={({ pressed }) => [
          pressed && { opacity: 0.7 }
        ]}
      >
        <Text style={[
          notificationStyles.markAllRead,
          { opacity: isLoading ? 0.5 : 1 }
        ]}>
          Mark all as read
        </Text>
      </Pressable>
    </View>
  );
};

export default NotificationHeader;