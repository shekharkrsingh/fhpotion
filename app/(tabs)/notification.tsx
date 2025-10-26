import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { AppTheme } from "@/constants/theme";
import { useDispatch, useSelector } from 'react-redux';
import { markAllNotificationAsRead, markNotificationAsRead, getAllNotification } from '@/service/properties/notificationApi';
import { RootState } from '@/redux/store';

const NotificationScreen = () => {
  const dispatch = useDispatch();
  
  const { notifications, isLoading } = useSelector((state: RootState) => state.notification);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications from Redux store when component mounts
  useEffect(() => {
    // Notifications are already in the store, no need to call API initially
  }, []);

  // Handle refresh - call getNotification API
  const handleRefresh = async () => {
    setRefreshing(true);
    await getAllNotification(dispatch);
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

  // Map notification type to icon and color
  const getNotificationConfig = (type: string) => {
    switch (type) {
      case 'SYSTEM':
        return {
          icon: 'update',
          color: AppTheme.colors.gray600,
          iconComponent: <MaterialIcons name="system-update" size={20} color={AppTheme.colors.white} />
        };
      case 'INFO':
        return {
          icon: 'info',
          color: AppTheme.colors.info,
          iconComponent: <Ionicons name="information-circle" size={20} color={AppTheme.colors.white} />
        };
      case 'UPDATE':
        return {
          icon: 'update',
          color: AppTheme.colors.primary,
          iconComponent: <MaterialIcons name="update" size={20} color={AppTheme.colors.white} />
        };
      case 'ALERT':
        return {
          icon: 'alert',
          color: AppTheme.colors.warning,
          iconComponent: <Ionicons name="alert-circle" size={20} color={AppTheme.colors.white} />
        };
      case 'EMERGENCY':
        return {
          icon: 'emergency',
          color: AppTheme.colors.emergency,
          iconComponent: <Ionicons name="warning" size={20} color={AppTheme.colors.white} />
        };
      case 'appointment':
        return {
          icon: 'calendar',
          color: AppTheme.colors.appointmentBooked,
          iconComponent: <MaterialIcons name="event" size={20} color={AppTheme.colors.white} />
        };
      case 'reminder':
        return {
          icon: 'clock',
          color: AppTheme.colors.info,
          iconComponent: <MaterialIcons name="access-time" size={20} color={AppTheme.colors.white} />
        };
      case 'prescription':
        return {
          icon: 'prescription',
          color: AppTheme.colors.prescription,
          iconComponent: <FontAwesome name="medkit" size={20} color={AppTheme.colors.white} />
        };
      default:
        return {
          icon: 'notifications',
          color: AppTheme.colors.primary,
          iconComponent: <MaterialIcons name="notifications" size={20} color={AppTheme.colors.white} />
        };
    }
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
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.container, {backgroundColor: AppTheme.colors.primaryLight }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: AppTheme.colors.white }]}>
        <Text style={[styles.headerTitle, { color: AppTheme.colors.gray800 }]}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead} disabled={isLoading}>
          <Text style={[
            styles.markAllRead, 
            { 
              color: AppTheme.colors.primary,
              opacity: isLoading ? 0.5 : 1
            }
          ]}>
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView 
        contentContainerStyle={styles.notificationList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[AppTheme.colors.primary]}
            tintColor={AppTheme.colors.primary}
          />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            return (
              <TouchableOpacity 
                key={notification.id} 
                style={[
                  styles.notificationCard, 
                  { 
                    backgroundColor: AppTheme.colors.white,
                    borderLeftWidth: 4,
                    borderLeftColor: notification.isRead ? AppTheme.colors.gray200 : config.color,
                    ...AppTheme.shadows.sm
                  }
                ]}
                onPress={() => handleNotificationPress(notification.id, notification.isRead)}
                disabled={isLoading}
              >
                {/* Notification Icon */}
                <View style={[
                  styles.iconContainer, 
                  { 
                    backgroundColor: notification.isRead ? AppTheme.colors.gray200 : config.color 
                  }
                ]}>
                  {config.iconComponent}
                </View>

                {/* Notification Content */}
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[
                      styles.notificationTitle, 
                      { 
                        color: notification.isRead ? AppTheme.colors.gray600 : AppTheme.colors.gray800,
                        fontWeight: notification.isRead ? 'normal' : '600'
                      }
                    ]}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && (
                      <View style={[styles.unreadBadge, { backgroundColor: AppTheme.colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.notificationMessage, { color: AppTheme.colors.gray700 }]}>
                    {notification.message}
                  </Text>
                  <Text style={[styles.notificationTime, { color: AppTheme.colors.gray500 }]}>
                    {formatTime(notification.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          // Empty State
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-off" size={48} color={AppTheme.colors.gray400} />
            <Text style={[styles.emptyStateText, { color: AppTheme.colors.gray600 }]}>
              No notifications found
            </Text>
            <Text style={[styles.emptyStateSubText, { color: AppTheme.colors.gray500 }]}>
              Pull down to refresh
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.gray200,
  },
  headerTitle: {
    fontSize: AppTheme.typography.heading3.fontSize,
    fontWeight: AppTheme.typography.heading3.fontWeight,
  },
  markAllRead: {
    fontSize: AppTheme.typography.caption.fontSize,
    fontWeight: '500',
  },
  notificationList: {
    padding: AppTheme.spacing.md,
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.sm,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.xs,
  },
  notificationTitle: {
    fontSize: AppTheme.typography.body.fontSize,
    flex: 1,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: AppTheme.spacing.sm,
  },
  notificationMessage: {
    fontSize: AppTheme.typography.body.fontSize,
    marginBottom: AppTheme.spacing.xs,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: AppTheme.typography.caption.fontSize,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.xxl,
  },
  emptyStateText: {
    fontSize: AppTheme.typography.body.fontSize,
    marginTop: AppTheme.spacing.md,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: AppTheme.typography.caption.fontSize,
    marginTop: AppTheme.spacing.xs,
    textAlign: 'center',
  },
});

export default NotificationScreen;