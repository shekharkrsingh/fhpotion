import React from 'react';
import { Text, Pressable } from 'react-native';
import { notificationStyles } from '@/assets/styles/notification.styles';
import ScreenHeader from '@/newComponents/ScreenHeader';

interface NotificationHeaderProps {
  onMarkAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onMarkAllAsRead,
  isLoading,
}) => {
  return (
    <ScreenHeader
      title="Notifications"
      showBack={false}
      rightAction={
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
      }
    />
  );
};

export default NotificationHeader;