// app/(tabs)/components/StatsCards.tsx
import React from 'react';
import { View } from 'react-native';

import { styles } from '@/assets/styles/statsCards.styles';
import StatCard from '@/newComponents/StatCard';

interface Statistics {
  totalAppointment?: number;
  totalTreatedAppointment?: number;
  totalUntreatedAppointmentAndNotAvailable?: number;
  totalAvailableAtClinic?: number;
}

interface StatsCardsProps {
  statistics?: Statistics;
}

const StatsCards: React.FC<StatsCardsProps> = ({ statistics }) => {
  const totalAppointments = statistics?.totalAppointment || 0;
  const treatedPercentage = totalAppointments !== 0
    ? Math.round(((statistics?.totalTreatedAppointment || 0) / totalAppointments) * 100) + "%"
    : "0%";

  const cards = [
    {
      title: "Total Appointments",
      value: statistics?.totalAppointment || 0,
      subtitle: "This month",
      icon: "calendar-alt",
      color: 'primary' as const,
      iconType: 'fontawesome5' as const,
    },
    {
      title: "Treated",
      value: statistics?.totalTreatedAppointment || 0,
      subtitle: `${treatedPercentage} completion`,
      icon: "healing",
      color: 'success' as const,
      iconType: 'material' as const,
    },
    {
      title: "Pending",
      value: statistics?.totalUntreatedAppointmentAndNotAvailable || 0,
      subtitle: "Awaiting treatment",
      icon: "pending-actions",
      color: 'warning' as const,
      iconType: 'material' as const,
    },
    {
      title: "Available",
      value: statistics?.totalAvailableAtClinic || 0,
      subtitle: "At clinic today",
      icon: "event-available",
      color: 'secondary' as const,
      iconType: 'material' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            iconType={card.iconType}
          />
        ))}
      </View>
    </View>
  );
};

export default StatsCards;