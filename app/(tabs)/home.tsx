// app/(tabs)/index.tsx
import React from 'react';
import {
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/newStore';

import { styles } from '@/assets/styles/dashboard.styles';
import { MedicalTheme } from '@/newConstants/theme';
import DashboardHeader from '@/newComponents/DashboardHeader';
import StatsCards from '@/newComponents/StatsCards';
import PerformanceMetrics from '@/newComponents/performanceMetrics';
import ChartsSection from '@/newComponents/chartsSection';
import UpcomingAppointments from '@/newComponents/upcomingAppointments';
import QuickActions from '@/newComponents/quickActions';
import LoadingState from '@/newComponents/loadingState';
import EmptyScreen from '@/newComponents/EmptyScreen';
import { fetchDoctorStatistics } from '@/newService/config/api/statisticsApi';
import { getProfile } from '@/newService/config/api/profileApi';
import { getAppointments } from '@/newService/config/api/appointmentApi';

const DoctorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector((state: RootState) => state.profile);
  const { data: statistics, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  const { appointments: upcomingAppointments, loading: upcomingAppointmentsLoading } = useSelector(
    (state: RootState) => state.appointments
  );

  const [refreshing, setRefreshing] = React.useState(false);

  // Fixed refresh function
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Dispatch the statistics fetch and wait for it to complete
      await dispatch(fetchDoctorStatistics());
      await dispatch(getProfile());
      await dispatch(getAppointments());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Load initial data on component mount
  React.useEffect(() => {
    // Load initial statistics if not already loaded

      if(!statistics && !loading){
        dispatch(fetchDoctorStatistics());
        dispatch(getProfile());
        dispatch(getAppointments());
      }

  }, [dispatch, profileData, upcomingAppointments, statistics, loading, upcomingAppointmentsLoading, profileData.isLoading]);

  // Check if we have meaningful data to display
  const hasData = statistics && (
    statistics.totalAppointment > 0 ||
    statistics.totalTreatedAppointment > 0 ||
    statistics.totalAvailableAtClinic > 0
  );

  if (loading && !refreshing) {
    return <LoadingState />;
  }

  if (error && !refreshing) {
    return (
      <EmptyScreen
        type="error"
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={[
          {
            label: refreshing ? 'Retrying...' : 'Retry',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
          {
            label: 'Restart App',
            onPress: () => window.location.reload(),
            variant: 'outline',
            icon: 'restart-alt',
          },
        ]}
      />
    );
  }

  // Show empty state if no data
  if (!statistics && !loading && !refreshing) {
    return (
      <EmptyScreen
        type="no-data"
        onRefresh={onRefresh}
        refreshing={refreshing}
        title="Dashboard Data Unavailable"
        subtitle="We couldn't load your dashboard statistics. This might be because you don't have any appointments yet or there's a temporary service issue."
        actions={[
          {
            label: refreshing ? 'Refreshing...' : 'Refresh Dashboard',
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
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[MedicalTheme.colors.primary[500]]}
          tintColor={MedicalTheme.colors.primary[500]}
        />
      }
    >
      <DashboardHeader profileData={profileData} />
      <StatsCards statistics={statistics} />
      <PerformanceMetrics statistics={statistics} />
      <ChartsSection statistics={statistics} />
      <UpcomingAppointments 
        appointments={upcomingAppointments}
        loading={upcomingAppointmentsLoading || refreshing}
      />
      <QuickActions />
    </ScrollView>
  );
};

export default DoctorDashboard;