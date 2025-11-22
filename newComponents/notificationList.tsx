import React from 'react';
import { ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/newStore/index';

import NotificationCard from '@/newComponents/notificationCard';
import EmptyScreen from '@/newComponents/EmptyScreen';
import { notificationStyles } from '@/assets/styles/notification.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface NotificationListProps {
  onRefresh: () => void;
  refreshing: boolean;
  onNotificationPress: (notificationId: string, isRead: boolean) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  onRefresh,
  refreshing,
  onNotificationPress,
}) => {
  const { notifications, isLoading } = useSelector((state: RootState) => state.notification);

  // Show loading state when loading and not refreshing
  if (isLoading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ActivityIndicator size="large" color={MedicalTheme.colors.primary[500]} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyScreen
        type="no-notifications"
        title="No Notifications"
        subtitle="You're all caught up! There are no new notifications at this time."
        onRefresh={onRefresh}
        refreshing={refreshing}
        showRefresh={true}
        actions={[
          {
            label: refreshing ? 'Refreshing...' : 'Refresh',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
        ]}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={notificationStyles.notificationList}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[MedicalTheme.colors.primary[500]]}
          tintColor={MedicalTheme.colors.primary[500]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onPress={onNotificationPress}
          isLoading={isLoading}
        />
      ))}
    </ScrollView>
  );
};

export default NotificationList;