// import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
// import React, { useState, useEffect, useRef } from 'react';
// import { Switch } from 'react-native-gesture-handler';
// import { AppTheme } from '@/constants/theme';
// import ConfirmationPopup from './ConfirmationPopup';
// import { MaterialIcons } from '@expo/vector-icons';

// interface AppointmentCardProps {
//   item: {
//     appointmentId: string;
//     doctorId: string;
//     patientName: string;
//     contact: string;
//     description: string | null;
//     appointmentDateTime: string;
//     bookingDateTime: string;
//     availableAtClinic: boolean;
//     treated: boolean;
//     treatedDateTime: string | null;
//     status: string;
//     appointmentType: string;
//     paymentStatus: boolean;
//     avatar?: string;
//   };
//   isExpanded: boolean;
//   onToggleExpand: (id: string | null) => void;
//   toggleAvailability: (id: string, value: boolean) => void;
//   togglePaymentStatus: (id: string) => void;
//   toggleTreatedStatus: (id: string) => void;
// }

// const AppointmentCard: React.FC<AppointmentCardProps> = ({
//   item,
//   isExpanded,
//   onToggleExpand,
//   toggleAvailability,
//   togglePaymentStatus,
//   toggleTreatedStatus,
// }) => {
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
//   const heightAnim = useRef(new Animated.Value(80)).current;

//   // Calculate expanded height based on content
//   const expandedHeight = 220; // Adjust this based on your content height



//   const showPopup = (message: string, action: () => void) => {
//     setConfirmationMessage(message);
//     setConfirmationAction(() => action);
//     setPopupVisible(true);
//   };

//   const handleTogglePaymentStatus = () => {
//     if (item.paymentStatus) {
//       showPopup(
//         'Are you sure you want to mark this booking as unpaid?',
//         () => togglePaymentStatus(item.appointmentId)
//       );
//     } else {
//       togglePaymentStatus(item.appointmentId);
//     }
//   };

//   const handleToggleTreatedStatus = () => {
//     if (item.treated) {
//       showPopup(
//         'Are you sure you want to mark this booking as untreated?',
//         () => toggleTreatedStatus(item.appointmentId)
//       );
//     } else {
//       toggleTreatedStatus(item.appointmentId);
//     }
//   };

  
//   const  extractFormattedTime=(isoString: string): string =>{
//     const dateObj = new Date(isoString);
//     let hours: number = dateObj.getHours();
//     const minutes: string = String(dateObj.getMinutes()).padStart(2, '0');
//     const ampm: string = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     const time: string = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
//     return time;
//   }
  


//   return (
//     <>
//       <ConfirmationPopup
//         message={confirmationMessage}
//         visible={popupVisible}
//         onClose={(confirmed) => {
//           setPopupVisible(false);
//           if (confirmed) confirmationAction();
//         }}
//       />
      
//       <View style={styles.container}>
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPress={() => onToggleExpand(isExpanded ? null : item.appointmentId)}
//           style={styles.header}
//         >
//           <View style={styles.availabilityContainer}>
//             <Switch
//               value={item.availableAtClinic}
//               onValueChange={(value) => toggleAvailability(item.appointmentId, value)}
//               thumbColor={item.availableAtClinic ? AppTheme.colors.success : AppTheme.colors.gray200}
//               trackColor={{ 
//                 false: AppTheme.colors.gray200, 
//                 true: AppTheme.colors.primaryLight 
//               }}
//             />
//             <Text style={[styles.availabilityText, { 
//               color: item.availableAtClinic ? AppTheme.colors.primary : AppTheme.colors.gray500 
//             }]}>
//               {item.availableAtClinic ? 'Available' : 'Unavailable'}
//             </Text>
//           </View>

//           {item.avatar && (
//             <Image 
//               source={{ uri: item.avatar }} 
//               style={styles.avatar}
//               resizeMode="cover"
//             />
//           )}

//           <View style={styles.nameContainer}>
//             <Text 
//               style={styles.name}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {item.patientName}
//             </Text>
//             <View style={[
//               styles.statusContainer,
//               { backgroundColor: item.paymentStatus ? AppTheme.colors.success : AppTheme.colors.gray400 }
//             ]}>
//               <Text style={styles.statusText}>
//                 {item.paymentStatus ? 'Paid' : 'Unpaid'}
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity 
//             onPress={handleToggleTreatedStatus}
//             style={[
//               styles.treatedButton,
//             ]}
//           >
//             <MaterialIcons 
//               name={item.treated ? 'check-circle' : 'radio-button-unchecked'} 
//               size={24} 
//               color={item.treated ? AppTheme.colors.success : AppTheme.colors.gray400} 
//             />
//           </TouchableOpacity>
//         </TouchableOpacity>

//         <View style={[styles.detailsContainer, { display: isExpanded ? 'flex' : 'none' }]}>
//           <View style={styles.detailCard}>
//             <MaterialIcons 
//               name="access-time" 
//               size={20} 
//               color={AppTheme.colors.primary} 
//               style={styles.detailIcon}
//             />
//             <Text style={styles.detailLabel}>Time</Text>
//             <Text style={styles.detailValue}>
//               {extractFormattedTime(item.appointmentDateTime)}
//             </Text>
//           </View>
        
//           <View style={styles.detailCard}>
//             <MaterialIcons 
//               name="phone" 
//               size={20} 
//               color={AppTheme.colors.primary} 
//               style={styles.detailIcon}
//             />
//             <Text style={styles.detailLabel}>Contact</Text>
//             <Text style={styles.detailValue}>
//               {item.contact}
//             </Text>
//           </View>
        
//           <View style={styles.detailCard}>
//             <MaterialIcons 
//               name="description" 
//               size={20} 
//               color={AppTheme.colors.primary} 
//               style={styles.detailIcon}
//             />
//             <Text style={styles.detailLabel}>Description</Text>
//             <Text style={styles.detailValue}>
//               {item.description || 'No description'}
//             </Text>
//           </View>
        
//           <View style={styles.actionsContainer}>
//             <TouchableOpacity
//               style={[
//                 styles.actionButton,
//                 { 
//                   backgroundColor: item.paymentStatus 
//                     ? AppTheme.colors.gray200
//                     : AppTheme.colors.primaryLight,
//                 }
//               ]}
//               onPress={handleTogglePaymentStatus}
//             >
//               <Text style={[
//                 styles.actionButtonText,
//                 { 
//                   color: item.paymentStatus 
//                     ? AppTheme.colors.danger 
//                     : AppTheme.colors.success 
//                 }
//               ]}>
//                 {item.paymentStatus ? 'Mark as Unpaid' : 'Mark as Paid'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: AppTheme.colors.white,
//     borderRadius: AppTheme.borderRadius.lg,
//     paddingVertical: AppTheme.spacing.sm,
//     paddingRight: AppTheme.spacing.md,
//     paddingLeft: AppTheme.spacing.xs,
//     marginBottom: AppTheme.spacing.sm,
//     marginHorizontal: AppTheme.spacing.sm,
//     ...AppTheme.shadows.md,
//     overflow: 'hidden',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: 60,
//   },
//   availabilityContainer: {
//     alignItems: 'center',
//     width: 80,
//   },
//   availabilityText: {
//     fontSize: 10,
//     fontWeight: '500',
//     marginTop: 4,
//   },
//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: AppTheme.colors.primaryLight,
//   },
//   nameContainer: {
//     flex: 1,
//     marginHorizontal: AppTheme.spacing.sm,
//   },
//   name: {
//     fontSize: AppTheme.typography.body.fontSize,
//     fontWeight: '600',
//     color: AppTheme.colors.gray800,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: AppTheme.spacing.sm,
//     paddingVertical: 2,
//     borderRadius: AppTheme.borderRadius.full,
//     alignSelf: 'flex-start',
//     marginTop: AppTheme.spacing.xs,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '800',
//     color: AppTheme.colors.white,
//   },
//   treatedButton: {
//     padding: AppTheme.spacing.xs,
//     borderRadius: AppTheme.borderRadius.full,
//   },
//   detailsContainer: {
//     padding: AppTheme.spacing.md,
//   },
//   detailCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: AppTheme.colors.gray200,
//   },
//   detailIcon: {
//     marginRight: 12,
//     width: 24,
//     textAlign: 'center',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: AppTheme.colors.gray600,
//     width: 100,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: AppTheme.colors.gray800,
//     flex: 1,
//     fontWeight: '400',
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   actionButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   actionButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default AppointmentCard;