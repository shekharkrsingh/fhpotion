import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles } from '@/assets/styles/profile.styles';

interface ListSectionProps {
  title: string;
  items: string[];
}

const ListSection: React.FC<ListSectionProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={profileStyles.listContainer}>
      <Text style={profileStyles.listTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={profileStyles.listItem}>
          <View style={profileStyles.bulletPoint} />
          <Text style={profileStyles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default ListSection;