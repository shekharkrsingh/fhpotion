import styles from '@/assets/styles/popup.styles';
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ConfirmationPopupProps {
  message: string;
  visible: boolean;
  onClose: (response: boolean) => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ message, visible, onClose }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => onClose(false)} // Handle back button press
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => onClose(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.okButton]}
              onPress={() => onClose(true)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default ConfirmationPopup;
