import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { notificationStyles } from '@/assets/styles/notification.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onPress: (notificationId: string, isRead: boolean) => void;
  isLoading: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  isLoading,
}) => {
  const getNotificationConfig = (type: string) => {
    const configs = {
      'SYSTEM': {
        color: MedicalTheme.colors.neutral[500],
        iconComponent: <MaterialIcons name="system-update" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'INFO': {
        color: MedicalTheme.colors.primary[500],
        iconComponent: <Ionicons name="information-circle" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'UPDATE': {
        color: MedicalTheme.colors.primary[400],
        iconComponent: <MaterialIcons name="update" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'ALERT': {
        color: MedicalTheme.colors.warning[500],
        iconComponent: <Ionicons name="alert-circle" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'EMERGENCY': {
        color: MedicalTheme.colors.error[500],
        iconComponent: <Ionicons name="warning" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'appointment': {
        color: MedicalTheme.colors.secondary[500],
        iconComponent: <MaterialIcons name="event" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'reminder': {
        color: MedicalTheme.colors.primary[300],
        iconComponent: <MaterialIcons name="access-time" size={20} color={MedicalTheme.colors.text.inverse} />
      },
      'prescription': {
        color: MedicalTheme.colors.medical.prescription,
        iconComponent: <FontAwesome name="medkit" size={20} color={MedicalTheme.colors.text.inverse} />
      },
    };

    return configs[type as keyof typeof configs] || {
      color: MedicalTheme.colors.primary[500],
      iconComponent: <MaterialIcons name="notifications" size={20} color={MedicalTheme.colors.text.inverse} />
    };
  };

  const config = getNotificationConfig(notification.type);
  const isUnread = !notification.isRead;

  return (
    <TouchableOpacity
      style={[
        notificationStyles.notificationCard,
        {
          borderLeftWidth: 4,
          borderLeftColor: isUnread ? config.color : MedicalTheme.colors.border.light,
          opacity: notification.isRead ? 0.8 : 1,
        }
      ]}
      onPress={() => onPress(notification.id, notification.isRead)}
      disabled={isLoading}
    >
      {/* Notification Icon */}
      <View style={[
        notificationStyles.iconContainer,
        {
          backgroundColor: isUnread ? config.color : MedicalTheme.colors.neutral[300],
        }
      ]}>
        {config.iconComponent}
      </View>

      {/* Notification Content */}
      <View style={notificationStyles.notificationContent}>
        <View style={notificationStyles.notificationHeader}>
          <Text style={[
            notificationStyles.notificationTitle,
            {
              color: isUnread ? MedicalTheme.colors.text.primary : MedicalTheme.colors.text.secondary,
              fontWeight: isUnread ? 
                MedicalTheme.typography.fontWeight.semibold : 
                MedicalTheme.typography.fontWeight.medium,
            }
          ]}>
            {notification.title}
          </Text>
          {isUnread && (
            <View style={[
              notificationStyles.unreadBadge,
              { backgroundColor: config.color }
            ]} />
          )}
        </View>
        <Text style={notificationStyles.notificationMessage}>
          {notification.message}
        </Text>
        <Text style={notificationStyles.notificationTime}>
          {formatTime(notification.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Format date to relative time
const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: diffInDays >= 365 ? 'numeric' : undefined
  });
};

export default NotificationCard;