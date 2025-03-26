import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { AppTheme } from "@/constants/theme"; // Import your theme

const NotificationScreen = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'New Appointment Booked',
      message: 'John Smith has booked an appointment for tomorrow at 10:30 AM',
      time: '2 hours ago',
      read: false,
      icon: 'calendar',
      color: AppTheme.colors.appointmentBooked
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: 'Your appointment with Sarah Johnson is in 1 hour',
      time: '30 minutes ago',
      read: true,
      icon: 'clock',
      color: AppTheme.colors.info
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Prescription Request',
      message: 'Michael Brown has requested a prescription renewal',
      time: '1 day ago',
      read: true,
      icon: 'prescription',
      color: AppTheme.colors.prescription
    },
    {
      id: 4,
      type: 'emergency',
      title: 'Emergency Case',
      message: 'Emergency case reported by Lisa Wong - needs immediate attention',
      time: '5 minutes ago',
      read: false,
      icon: 'alert',
      color: AppTheme.colors.emergency
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features available in version 2.1.0',
      time: '3 days ago',
      read: true,
      icon: 'update',
      color: AppTheme.colors.gray600
    }
  ];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: AppTheme.colors.primaryLight }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: AppTheme.colors.white }]}>
        <Text style={[styles.headerTitle, { color: AppTheme.colors.gray800 }]}>Notifications</Text>
        <TouchableOpacity>
          <Text style={[styles.markAllRead, { color: AppTheme.colors.primary }]}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView contentContainerStyle={styles.notificationList}>
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={[
              styles.notificationCard, 
              { 
                backgroundColor: AppTheme.colors.white,
                borderLeftWidth: 4,
                borderLeftColor: notification.read ? AppTheme.colors.gray200 : notification.color,
                ...AppTheme.shadows.sm
              }
            ]}
          >
            {/* Notification Icon */}
            <View style={[
              styles.iconContainer, 
              { backgroundColor: notification.read ? AppTheme.colors.gray200 : notification.color }
            ]}>
              {notification.icon === 'calendar' && (
                <MaterialIcons name="event" size={20} color={AppTheme.colors.white} />
              )}
              {notification.icon === 'clock' && (
                <MaterialIcons name="access-time" size={20} color={AppTheme.colors.white} />
              )}
              {notification.icon === 'prescription' && (
                <FontAwesome name="medkit" size={20} color={AppTheme.colors.white} />
              )}
              {notification.icon === 'alert' && (
                <Ionicons name="alert-circle" size={20} color={AppTheme.colors.white} />
              )}
              {notification.icon === 'update' && (
                <MaterialIcons name="system-update" size={20} color={AppTheme.colors.white} />
              )}
            </View>

            {/* Notification Content */}
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={[
                  styles.notificationTitle, 
                  { 
                    color: notification.read ? AppTheme.colors.gray600 : AppTheme.colors.gray800,
                    fontWeight: notification.read ? 'normal' : '600'
                  }
                ]}>
                  {notification.title}
                </Text>
                {!notification.read && (
                  <View style={[styles.unreadBadge, { backgroundColor: AppTheme.colors.primary }]} />
                )}
              </View>
              <Text style={[styles.notificationMessage, { color: AppTheme.colors.gray700 }]}>
                {notification.message}
              </Text>
              <Text style={[styles.notificationTime, { color: AppTheme.colors.gray500 }]}>
                {notification.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Empty State (commented out but available if needed) */}
      {/* <View style={styles.emptyState}>
        <MaterialIcons name="notifications-off" size={48} color={AppTheme.colors.gray400} />
        <Text style={[styles.emptyStateText, { color: AppTheme.colors.gray600 }]}>
          No new notifications
        </Text>
      </View> */}
    </SafeAreaView>
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
  },
});

export default NotificationScreen;