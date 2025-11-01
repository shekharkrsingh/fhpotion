import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/newConstants/theme';
import styles from '@/newAssets/styles/alertPopup.styles';

interface AlertPopupProps {
  // Required props
  message: string;
  visible: boolean;
  onClose: (response?: boolean) => void;
  
  // Optional props for customization
  title?: string;
  type?: 'alert' | 'confirmation';
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showIcon?: boolean;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  message,
  visible,
  onClose,
  title,
  type = 'alert',
  confirmText = 'OK',
  cancelText = 'Cancel',
  variant = 'default',
  showIcon = true,
}) => {
  const theme = useTheme();

  // Get variant-specific colors and icons
  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          primary: theme.colors.success[500],
          light: theme.colors.success[50],
          text: theme.colors.success[700],
          icon: 'checkmark-circle' as const,
          iconColor: theme.colors.success[500],
        };
      case 'warning':
        return {
          primary: theme.colors.warning[500],
          light: theme.colors.warning[50],
          text: theme.colors.warning[700],
          icon: 'warning' as const,
          iconColor: theme.colors.warning[500],
        };
      case 'error':
        return {
          primary: theme.colors.error[500],
          light: theme.colors.error[50],
          text: theme.colors.error[700],
          icon: 'close-circle' as const,
          iconColor: theme.colors.error[500],
        };
      default:
        return {
          primary: theme.colors.primary[500],
          light: theme.colors.primary[50],
          text: theme.colors.primary[700],
          icon: 'information-circle' as const,
          iconColor: theme.colors.primary[500],
        };
    }
  };

  const variantConfig = getVariantConfig();

  const handleConfirm = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleSingleAction = () => {
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => onClose(false)}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* Icon in Top Right Corner */}
          {showIcon && (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={variantConfig.icon} 
                size={24}
                color={variantConfig.iconColor}
              />
            </View>
          )}

          {/* Title */}
          {title && (
            <Text style={styles.title}>
              {title}
            </Text>
          )}

          {/* Message */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* Action Buttons - Both on the right side */}
          <View style={[
            styles.buttonContainer,
            type === 'alert' ? styles.singleButtonContainer : styles.dualButtonsContainer
          ]}>
            {type === 'confirmation' ? (
              // Dual buttons for confirmation - both on right
              <>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryButtonText}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: variantConfig.primary }]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryButtonText}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Single button for alert - on right
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: variantConfig.primary }]}
                onPress={handleSingleAction}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertPopup;