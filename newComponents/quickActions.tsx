// app/(tabs)/components/QuickActions.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { styles } from '@/assets/styles/quickActions.styles';
import { MedicalTheme } from '@/newConstants/theme';

const QuickActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    {
      label: "New Appointment",
      icon: "add",
      color: MedicalTheme.colors.primary[500],
      backgroundColor: MedicalTheme.colors.primary[50],
      route: "/(tabs)/add",
      iconType: 'material' as const,
    },
    {
      label: "All Bookings",
      icon: "calendar-alt",
      color: MedicalTheme.colors.success[500],
      backgroundColor: MedicalTheme.colors.success[50],
      route: "/(tabs)/booking",
      iconType: 'fontawesome5' as const,
    },
    {
      label: "Profile",
      icon: "person",
      color: MedicalTheme.colors.secondary[500],
      backgroundColor: MedicalTheme.colors.secondary[50],
      route: "/(tabs)/profile",
      iconType: 'material' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => router.navigate(action.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.backgroundColor }]}>
              {action.iconType === 'material' ? (
                <MaterialIcons name={action.icon as any} size={24} color={action.color} />
              ) : (
                <FontAwesome5 name={action.icon as any} size={20} color={action.color} />
              )}
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default QuickActions;