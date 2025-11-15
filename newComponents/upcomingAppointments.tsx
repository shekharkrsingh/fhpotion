// app/(tabs)/components/UpcomingAppointments.tsx
import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { styles } from '@/assets/styles/upcomingAppointments.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface Appointment {
  appointmentId: string;
  patientName: string;
  appointmentType: "IN_PERSON" | "ONLINE"; // Updated to match backend enum
  appointmentDateTime: string;
  treated: boolean;
  availableAtClinic: boolean;
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
  loading: boolean;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ 
  appointments, 
  loading 
}) => {
  const router = useRouter();

  const formatAppointmentTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatAppointmentDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const upcomingAppointments = appointments?.filter(appointment => 
    !appointment.treated && appointment.availableAtClinic
  ).slice(0, 3) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <Pressable 
          style={({ pressed }) => pressed && { opacity: 0.7 }}
          onPress={() => router.navigate("/(tabs)/booking")}
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color={MedicalTheme.colors.primary[500]} />
      ) : upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <Pressable
            key={appointment.appointmentId}
            style={({ pressed }) => [
              styles.appointmentCard,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => router.navigate(`/(tabs)/booking/${appointment.appointmentId}`)}
          >
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatAppointmentTime(appointment.appointmentDateTime)}
              </Text>
              <Text style={styles.dateText}>
                {formatAppointmentDate(appointment.appointmentDateTime)}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.patientName}>
                {appointment.patientName}
              </Text>
              <Text style={styles.appointmentType}>
                {appointment.appointmentType}
              </Text>
            </View>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={MedicalTheme.colors.text.tertiary}
            />
          </Pressable>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-busy" size={48} color={MedicalTheme.colors.text.tertiary} />
          <Text style={styles.emptyText}>
            No upcoming appointments
          </Text>
        </View>
      )}
    </View>
  );
};

export default UpcomingAppointments;