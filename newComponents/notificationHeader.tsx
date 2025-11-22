import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';
// Reverted: remove ScreenHeader usage

interface NotificationHeaderProps {
  onMarkAllAsRead: () => void;
  isLoading: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onMarkAllAsRead,
  isLoading,
}) => {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Notifications</Text>
      <Pressable onPress={onMarkAllAsRead} disabled={isLoading}>
        <Text style={{ color: MedicalTheme.colors.primary[600], opacity: isLoading ? 0.5 : 1 }}>
          Mark all as read
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationHeader;