import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MedicalTheme } from '@/newConstants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  backgroundColor = MedicalTheme.colors.background.primary,
  titleColor = MedicalTheme.colors.text.primary,
  subtitleColor = MedicalTheme.colors.text.secondary,
}) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + MedicalTheme.spacing[3],
          backgroundColor,
          minHeight: 56 + insets.top,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={titleColor}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: titleColor },
              subtitle && styles.titleWithSubtitle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightAction || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
    backgroundColor: MedicalTheme.colors.background.primary,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingBottom: MedicalTheme.spacing[3],
    minHeight: 56,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: MedicalTheme.spacing[1],
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: MedicalTheme.spacing[2],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  titleWithSubtitle: {
    marginBottom: MedicalTheme.spacing[0.5],
  },
  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    textAlign: 'center',
    marginTop: MedicalTheme.spacing[0.5],
  },
  rightSection: {
    minWidth: 100,
    maxWidth: 180,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
});

export default ScreenHeader;

