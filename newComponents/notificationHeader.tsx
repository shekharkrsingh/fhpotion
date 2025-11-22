import React from 'react';
import { Text, Pressable, View, StyleSheet, Platform } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

interface NotificationHeaderProps {
  onMarkAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onMarkAllAsRead,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Pressable 
        onPress={onMarkAllAsRead} 
        disabled={isLoading}
        style={({ pressed }) => [
          styles.markAllButton,
          pressed && { opacity: 0.7 }
        ]}
      >
        <Text style={[styles.markAllText, { opacity: isLoading ? 0.5 : 1 }]}>
          Mark all as read
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: MedicalTheme.colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
  },
  markAllButton: {
    padding: MedicalTheme.spacing[1],
  },
  markAllText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.primary[600],
  },
});

export default NotificationHeader;