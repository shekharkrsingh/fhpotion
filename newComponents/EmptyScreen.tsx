// newComponents/EmptyScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { styles } from '@/assets/styles/emptyScreen.styles';
import { MedicalTheme } from '@/newConstants/theme';

export type EmptyScreenType = 
  | 'no-data' 
  | 'no-connection' 
  | 'error' 
  | 'no-results' 
  | 'no-appointments' 
  | 'no-patients' 
  | 'no-notifications' 
  | 'no-messages'
  | 'search-empty';

export type ActionButton = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
  disabled?: boolean;
};

interface EmptyScreenProps {
  type?: EmptyScreenType;
  title?: string;
  subtitle?: string;
  customIcon?: React.ReactNode;
  actions?: ActionButton[];
  onRefresh?: () => void;
  refreshing?: boolean;
  showRefresh?: boolean;
  showSupport?: boolean;
  children?: React.ReactNode;
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({
  type = 'no-data',
  title,
  subtitle,
  customIcon,
  actions = [],
  onRefresh,
  refreshing = false,
  showRefresh = true,
  showSupport = true,
  children,
}) => {
  // Default configurations for each type
  const getConfig = () => {
    const configs = {
      'no-data': {
        icon: 'data-exploration',
        defaultTitle: 'No Data Available',
        defaultSubtitle: 'We couldn\'t load the data for this screen. This might be due to network issues or the data not being available yet.',
        iconColor: MedicalTheme.colors.primary[300],
      },
      'no-connection': {
        icon: 'wifi-off',
        defaultTitle: 'No Internet Connection',
        defaultSubtitle: 'Please check your internet connection and try again. Some features may not be available offline.',
        iconColor: MedicalTheme.colors.warning[500],
      },
      'error': {
        icon: 'error-outline',
        defaultTitle: 'Something Went Wrong',
        defaultSubtitle: 'We encountered an error while loading this page. Please try again or contact support if the problem persists.',
        iconColor: MedicalTheme.colors.error[500],
      },
      'no-results': {
        icon: 'search-off',
        defaultTitle: 'No Results Found',
        defaultSubtitle: 'We couldn\'t find any matches for your search. Try adjusting your filters or search terms.',
        iconColor: MedicalTheme.colors.text.tertiary,
      },
      'no-appointments': {
        icon: 'event-busy',
        defaultTitle: 'No Appointments',
        defaultSubtitle: 'You don\'t have any appointments scheduled. Create a new appointment to get started.',
        iconColor: MedicalTheme.colors.primary[300],
      },
      'no-patients': {
        icon: 'people-outline',
        defaultTitle: 'No Patients',
        defaultSubtitle: 'No patients are currently registered. Add patients to start managing their care.',
        iconColor: MedicalTheme.colors.secondary[300],
      },
      'no-notifications': {
        icon: 'notifications-off',
        defaultTitle: 'No Notifications',
        defaultSubtitle: 'You\'re all caught up! There are no new notifications at this time.',
        iconColor: MedicalTheme.colors.text.tertiary,
      },
      'no-messages': {
        icon: 'chat-bubble-outline',
        defaultTitle: 'No Messages',
        defaultSubtitle: 'No messages to display. Start a conversation to see messages here.',
        iconColor: MedicalTheme.colors.primary[300],
      },
      'search-empty': {
        icon: 'search',
        defaultTitle: 'Search to Find Content',
        defaultSubtitle: 'Enter a search term to find patients, appointments, or other content.',
        iconColor: MedicalTheme.colors.text.tertiary,
      },
    };

    return configs[type] || configs['no-data'];
  };

  const config = getConfig();
  const displayTitle = title || config.defaultTitle;
  const displaySubtitle = subtitle || config.defaultSubtitle;

  // Default actions if none provided
  const defaultActions: ActionButton[] = [
    {
      label: refreshing ? 'Refreshing...' : 'Refresh',
      onPress: onRefresh || (() => window.location.reload()),
      variant: 'primary',
      icon: 'refresh',
      disabled: refreshing,
    },
    {
      label: 'Check Connection',
      onPress: () => window.location.reload(),
      variant: 'secondary',
      icon: 'wifi',
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  const renderIcon = () => {
    if (customIcon) return customIcon;

    return (
      <View style={[styles.iconBackground, { backgroundColor: MedicalTheme.colors.primary[50] }]}>
        <MaterialIcons 
          name={config.icon as any} 
          size={48} 
          color={config.iconColor} 
        />
      </View>
    );
  };

  const getButtonStyle = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return [styles.actionButton, styles.primaryButton];
      case 'secondary':
        return [styles.actionButton, styles.secondaryButton];
      case 'outline':
        return [styles.actionButton, styles.outlineButton];
      default:
        return [styles.actionButton, styles.primaryButton];
    }
  };

  const getButtonTextStyle = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return [styles.buttonText, styles.primaryButtonText];
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText];
      case 'outline':
        return [styles.buttonText, styles.outlineButtonText];
      default:
        return [styles.buttonText, styles.primaryButtonText];
    }
  };

  const renderIconForButton = (iconName?: string) => {
    if (!iconName) return null;

    // Determine which icon library to use based on icon name
    if (iconName === 'refresh' || iconName === 'wifi') {
      return (
        <Ionicons 
          name={iconName as any} 
          size={20} 
          color={getButtonTextStyle(displayActions[0].variant)[0].color} 
        />
      );
    } else {
      return (
        <MaterialIcons 
          name={iconName as any} 
          size={20} 
          color={getButtonTextStyle(displayActions[0].variant)[0].color} 
        />
      );
    }
  };

  return (
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          showRefresh && onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[MedicalTheme.colors.primary[500]]}
              tintColor={MedicalTheme.colors.primary[500]}
            />
          ) : undefined
        }
      >
        <View style={styles.content}>
          {renderIcon()}
          
          <Text style={styles.title}>{displayTitle}</Text>
          
          <Text style={styles.subtitle}>{displaySubtitle}</Text>

          {/* Custom children content */}
          {children && (
            <View style={styles.childrenContainer}>
              {children}
            </View>
          )}

          {/* Action Buttons */}
          {displayActions.length > 0 && (
            <View style={styles.actionButtons}>
              {displayActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={getButtonStyle(action.variant)}
                  onPress={action.onPress}
                  disabled={action.disabled}
                >
                  {action.icon && renderIconForButton(action.icon)}
                  <Text style={getButtonTextStyle(action.variant)}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Support Contact */}
          {showSupport && (
            <View style={styles.supportSection}>
              <Text style={styles.supportTitle}>Need help?</Text>
              <Text style={styles.supportText}>
                Contact our support team at {' '}
                <Text style={styles.supportEmail}>support@medicalapp.com</Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
  );
};

export default EmptyScreen;