import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { AppTheme } from '@/constants/theme';
import ConfirmationPopup from './ConfirmationPopup';
import { MaterialIcons } from '@expo/vector-icons';

interface AppointmentCardProps {
  item: {
    id: string;
    avatar: string;
    name: string;
    timing: string;
    contact: string;
    description: string;
    paid: boolean;
    available: boolean;
    treated: boolean;
  };
  isExpanded: boolean;
  onToggleExpand: (id: string | null) => void;
  toggleAvailability: (id: string, value: boolean) => void;
  togglePaymentStatus: (id: string) => void;
  toggleTreatedStatus: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  toggleAvailability,
  togglePaymentStatus,
  toggleTreatedStatus,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  const heightAnim = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 220 : 80,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const showPopup = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setPopupVisible(true);
  };

  const handleTogglePaymentStatus = () => {
    if (item.paid) {
      showPopup(
        'Are you sure you want to mark this booking as unpaid?',
        () => togglePaymentStatus(item.id)
      );
    } else {
      togglePaymentStatus(item.id);
    }
  };

  const handleToggleTreatedStatus = () => {
    if (item.treated) {
      showPopup(
        'Are you sure you want to mark this booking as untreated?',
        () => toggleTreatedStatus(item.id)
      );
    } else {
      toggleTreatedStatus(item.id);
    }
  };

  return (
    <>
      <ConfirmationPopup
        message={confirmationMessage}
        visible={popupVisible}
        onClose={(confirmed) => {
          setPopupVisible(false);
          if (confirmed) confirmationAction();
        }}
      />
      
      <Animated.View style={[styles.container, { 
        backgroundColor: AppTheme.colors.white,
        height: heightAnim,
        overflow: 'hidden'
      }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onToggleExpand(isExpanded ? null : item.id)}
          style={styles.header}
        >
          <View style={styles.availabilityContainer}>
            <Switch
              value={item.available}
              onValueChange={(value) => toggleAvailability(item.id, value)}
              thumbColor={item.available ? AppTheme.colors.success : AppTheme.colors.gray200}
              trackColor={{ 
                false: AppTheme.colors.gray200, 
                true: AppTheme.colors.primaryLight 
              }}
            />
            <Text style={[styles.availabilityText, { 
              color: item.available ? AppTheme.colors.primary : AppTheme.colors.gray500 
            }]}>
              {item.available ? 'Available' : 'Unavailable'}
            </Text>
          </View>

          <Image 
            source={{ uri: item.avatar }} 
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.nameContainer}>
            <Text 
              style={[styles.name, { color: AppTheme.colors.gray800 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <View style={[
              styles.statusContainer,
              { backgroundColor: item.paid ? AppTheme.colors.success : AppTheme.colors.gray400 }
            ]}>
              {/* <View style={[
                styles.statusIndicator,
                { backgroundColor: item.paid ? AppTheme.colors.white : AppTheme.colors.danger }
              ]} /> */}
              <Text style={[
                styles.statusText,
                { color: item.paid ? AppTheme.colors.white : AppTheme.colors.gray800}
              ]}>
                {item.paid ? 'Paid' : 'Unpaid'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleToggleTreatedStatus}
            style={[
              styles.treatedButton,
              { 
                backgroundColor: item.treated 
                  ? AppTheme.colors.successLight 
                  : AppTheme.colors.gray100 
              }
            ]}
          >
            <MaterialIcons 
              name={item.treated ? 'check-circle' : 'radio-button-unchecked'} 
              size={24} 
              color={item.treated ? AppTheme.colors.success : AppTheme.colors.gray400} 
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <MaterialIcons name="access-time" size={18} color={AppTheme.colors.gray600} />
              <Text style={[styles.detailText, { color: AppTheme.colors.gray700 }]}>
                {item.timing}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="phone" size={18} color={AppTheme.colors.gray600} />
              <Text style={[styles.detailText, { color: AppTheme.colors.gray700 }]}>
                {item.contact}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="description" size={18} color={AppTheme.colors.gray600} />
              <Text style={[styles.detailText, { color: AppTheme.colors.gray700 }]}>
                {item.description}
              </Text>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: item.paid 
                      ? AppTheme.colors.dangerLight 
                      : AppTheme.colors.successLight 
                  }
                ]}
                onPress={handleTogglePaymentStatus}
              >
                <Text style={[
                  styles.actionButtonText,
                  { 
                    color: item.paid 
                      ? AppTheme.colors.danger 
                      : AppTheme.colors.success 
                  }
                ]}>
                  {item.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionRow}>
              
            {/* <Text>SHekhar</Text> */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: item.paid 
                      ? AppTheme.colors.dangerLight 
                      : AppTheme.colors.successLight 
                  }
                ]}
                onPress={handleTogglePaymentStatus}
              >
                <Text style={[
                  styles.actionButtonText,
                  { 
                    color: item.paid 
                      ? AppTheme.colors.danger 
                      : AppTheme.colors.success 
                  }
                ]}>
                  {item.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: AppTheme.colors.primaryLight }]}
                onPress={() => {}}
              >
                <Text style={[styles.actionButtonText, { color: AppTheme.colors.primary }]}>
                  View Details
                </Text>
              </TouchableOpacity> */}
            </View> 
          </View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.sm,
    marginHorizontal: AppTheme.spacing.sm,
    ...AppTheme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  availabilityContainer: {
    alignItems: 'center',
    width: 80,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: AppTheme.colors.primaryLight,
  },
  nameContainer: {
    flex: 1,
    marginHorizontal: AppTheme.spacing.sm,
  },
  name: {
    fontSize: AppTheme.typography.body.fontSize,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: AppTheme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: AppTheme.spacing.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: AppTheme.spacing.xs,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '800',
  },
  treatedButton: {
    padding: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.full,
  },
  details: {
    marginTop: AppTheme.spacing.sm,
    paddingTop: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.gray200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  detailText: {
    marginLeft: AppTheme.spacing.sm,
    fontSize: AppTheme.typography.body.fontSize,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: AppTheme.spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: AppTheme.spacing.xs,
  },
  actionButtonText: {
    fontWeight: '500',
    fontSize: AppTheme.typography.caption.fontSize,
  },
});

export default AppointmentCard;