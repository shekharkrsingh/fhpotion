import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';
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
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled
          ]}
        >
          <Text style={[
            styles.buttonText,
            isLoading && styles.buttonTextDisabled
          ]}>
            Mark all as read
          </Text>
        </Pressable>
      }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: MedicalTheme.spacing[2],
    paddingVertical: MedicalTheme.spacing[1.5],
    borderRadius: MedicalTheme.borderRadius.md,
    backgroundColor: MedicalTheme.colors.primary[50],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: MedicalTheme.colors.primary[100],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.primary[600],
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonTextDisabled: {
    color: MedicalTheme.colors.primary[400],
  },
});

export default NotificationHeader;