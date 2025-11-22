import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDoctorReports } from '@/newService/config/api/reportsAPI';
import { MedicalTheme } from '@/newConstants/theme';
import AlertPopup from '@/newComponents/alertPopup';
import ErrorBoundary from '@/newComponents/ErrorBoundary';
import { reportScreenStyles as styles } from '@/assets/styles/ReportScreen.styles';
import logger from '@/utils/logger';

const ReportScreen: React.FC = () => {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowFromDatePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setFromDate(selectedDate);
      if (error && error.includes('date')) {
        setError(null);
      }
      if (toDate && selectedDate > toDate) {
        setToDate(null);
      }
    } else if (event.type === 'dismissed') {
      setShowFromDatePicker(false);
    }
  };

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowToDatePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setToDate(selectedDate);
    if (error && error.includes('date')) {
      setError(null);
    }
    } else if (event.type === 'dismissed') {
      setShowToDatePicker(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  };

  const getFirstDayOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getFirstDayOfYear = () => {
    const today = new Date();
    return new Date(today.getFullYear(), 0, 1);
  };

  const validateDates = (): boolean => {
    if (!fromDate) {
      setError('Please select a from date');
      return false;
    }
    
    const today = getTodayDate();
    if (fromDate > today) {
      setError('From date cannot be in the future');
      return false;
    }
    
    if (toDate) {
      if (toDate > today) {
      setError('To date cannot be in the future');
      return false;
      }
      if (fromDate > toDate) {
        setError('From date cannot be after to date');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  // Fixed base64 conversion
  const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const generateReport = async (customFromDate?: Date, customToDate?: Date) => {
    const useFromDate = customFromDate || fromDate;
    const useToDate = customToDate || toDate;

    if (!customFromDate && !validateDates()) return;

    const fromDateStr = useFromDate ? formatDateToString(useFromDate) : '';
    const toDateStr = useToDate ? formatDateToString(useToDate) : undefined;

    try {
      setLoading(true);
      setError(null);
      setPdfData(null);

      logger.log(`Generating report for: ${fromDateStr} to ${toDateStr || 'today'}`);

      const result = await getDoctorReports(fromDateStr, toDateStr);
      
      logger.log(`Report generated successfully: ${result.fileName}, Size: ${result.pdfData.length} bytes`);
      
      setPdfData(result.pdfData);
      setFileName(result.fileName);
      
      // Show success alert
      setShowAlert(true);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate report';
      setError(errorMessage);
      logger.error('Generate report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!pdfData) return;

    try {
      logger.log(`Downloading PDF: ${fileName}, Size: ${pdfData.length} bytes`);
      
      if (Platform.OS === 'web') {
        // Web download - direct blob approach
        if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof Blob !== 'undefined') {
          const blob = new Blob([pdfData as any], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        // Append to body and click
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
          logger.log('PDF download initiated on web');
        } else {
          throw new Error('Web APIs not available');
        }
      } else {
        // React Native - Save and share with proper base64 encoding
        const base64Data = uint8ArrayToBase64(pdfData);
        // Use cacheDirectory for temporary files (will be cleaned by system)
        const directory = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
        if (!directory) {
          throw new Error('File system directory not available');
        }
        const fileUri = `${directory}${fileName}`;
        
        logger.log(`Writing PDF to cache: ${fileUri}`);
        
        // Use FileSystem.EncodingType.Base64 if available, otherwise use string
        const encoding = (FileSystem as any).EncodingType?.Base64 || 'base64';
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: encoding as any,
        });

        // Verify file was written
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          logger.log(`File written successfully: ${fileUri}`);
        } else {
          throw new Error('File was not written successfully');
        }

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Download Doctor Report',
            UTI: 'com.adobe.pdf',
          });
        }
      }
    } catch (err: any) {
      logger.error('Download error:', err);
      setError(`Failed to download PDF: ${err.message}`);
    }
  };

  const sharePdf = async () => {
    if (!pdfData) return;

    try {
      if (Platform.OS === 'web') {
        // Web share API
        if (typeof navigator !== 'undefined' && navigator.share && typeof Blob !== 'undefined' && typeof File !== 'undefined') {
          const blob = new Blob([pdfData as any], { type: 'application/pdf' });
        const file = new File([blob], fileName, { type: 'application/pdf' });
        
          await navigator.share({
            files: [file],
            title: 'Doctor Report',
          });
        } else {
          // Fallback to download if share not supported
          logger.log('Web Share API not supported, falling back to download');
          downloadPdf();
        }
      } else {
        // React Native share
        const base64Data = uint8ArrayToBase64(pdfData);
        const directory = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
        if (!directory) {
          throw new Error('File system directory not available');
        }
        const fileUri = `${directory}${fileName}`;
        
        const encoding = (FileSystem as any).EncodingType?.Base64 || 'base64';
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: encoding as any,
        });

        await Share.share({
          url: fileUri,
          title: 'Doctor Report',
        });
      }
    } catch (err: any) {
      // Share cancellation is not an error, just log it
      if (err.message && !err.message.includes('cancelled')) {
        logger.error('Share error:', err);
      }
    }
  };

  const handleTodayReport = () => {
    const today = getTodayDate();
    generateReport(today, today);
  };

  const handleYesterdayReport = () => {
    const yesterday = getYesterdayDate();
    generateReport(yesterday, yesterday);
  };

  const handleThisMonth = () => {
    generateReport(getFirstDayOfMonth(), getTodayDate());
  };

  const handleThisYear = () => {
    generateReport(getFirstDayOfYear(), getTodayDate());
  };

  const handleCustomReport = () => generateReport();

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if can't go back
      router.replace('/');
    }
  };

  const handleContactUs = () => {
    logger.log('Contact us button pressed');
  };

  return (
    <ErrorBoundary>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={handleBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color={MedicalTheme.colors.primary[500]} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Medical Reports</Text>
          <Text style={{ fontSize: 12, color: MedicalTheme.colors.text.secondary }}>Generate and download patient reports</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Generate Doctor Report</Text>
        <Text style={styles.subtitle}>Select date range to generate PDF report</Text>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reports</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionButtonLeft, loading && styles.disabledButton]}
              onPress={handleTodayReport}
              disabled={loading}
            >
              <MaterialIcons name="today" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionButtonRight, loading && styles.disabledButton]}
              onPress={handleYesterdayReport}
              disabled={loading}
            >
              <MaterialIcons name="history" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>Yesterday</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionButtonLeft, loading && styles.disabledButton]}
              onPress={handleThisMonth}
              disabled={loading}
            >
              <MaterialIcons name="calendar-today" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>This Month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionButtonRight, loading && styles.disabledButton]}
              onPress={handleThisYear}
              disabled={loading}
            >
              <MaterialIcons name="date-range" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>This Year</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Date Range</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>From Date <Text style={styles.required}>*</Text></Text>
            <Pressable
              onPress={() => !loading && setShowFromDatePicker(true)}
              style={({ pressed }) => [
                styles.input,
                error && !fromDate && styles.inputError,
                pressed && { opacity: 0.7 },
                { justifyContent: 'center' }
              ]}
              disabled={loading}
            >
              <Text style={[
                { color: fromDate ? MedicalTheme.colors.text.primary : MedicalTheme.colors.text.tertiary },
                { fontSize: 16 }
              ]}>
                {fromDate ? formatDateDisplay(fromDate) : 'Select from date'}
              </Text>
            </Pressable>
            <Text style={styles.hint}>Tap to select a date</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Date (Optional)</Text>
            <Pressable
              onPress={() => !loading && setShowToDatePicker(true)}
              style={({ pressed }) => [
                styles.input,
                error && toDate && styles.inputError,
                pressed && { opacity: 0.7 },
                { justifyContent: 'center' }
              ]}
              disabled={loading}
            >
              <Text style={[
                { color: toDate ? MedicalTheme.colors.text.primary : MedicalTheme.colors.text.tertiary },
                { fontSize: 16 }
              ]}>
                {toDate ? formatDateDisplay(toDate) : 'Select to date (optional)'}
              </Text>
            </Pressable>
            <Text style={styles.hint}>Leave empty for today's date</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleCustomReport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={MedicalTheme.colors.text.inverse} />
            ) : (
              <MaterialIcons name="picture-as-pdf" size={20} color={MedicalTheme.colors.text.inverse} />
            )}
            <Text style={styles.primaryButtonText}>
              {loading ? 'Generating...' : 'Generate PDF Report'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Actions (shown when PDF is generated) - Only Download and Share */}
        {pdfData && (
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Report Ready</Text>
            <Text style={styles.actionsDescription} numberOfLines={3} ellipsizeMode="tail">
              Your report "{fileName}" is ready. Choose an action below:
            </Text>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadPdf}
              >
                <MaterialIcons name="download" size={20} color={MedicalTheme.colors.text.inverse} />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={sharePdf}
              >
                <MaterialIcons name="share" size={20} color={MedicalTheme.colors.text.inverse} />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How to use:</Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText} numberOfLines={2}>Tap on date fields to open date picker</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText} numberOfLines={2}>Dates are automatically validated</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText} numberOfLines={2}>Use quick actions for common time periods</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText} numberOfLines={2}>Report will be generated and ready for download</Text>
          </View>
        </View>
      </ScrollView>

      {/* Success Alert Popup */}
      <AlertPopup
        visible={showAlert}
        onClose={handleAlertClose}
        title="Report Generated Successfully!"
        message={`Your report "${fileName}" is ready. You can now download or share it using the buttons below.`}
        type="alert"
        variant="success"
        confirmText="Got It"
      />

      {Platform.OS === 'android' && (
        <>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate || getTodayDate()}
              mode="date"
              display="default"
              onChange={handleFromDateChange}
              maximumDate={getTodayDate()}
            />
          )}
          {showToDatePicker && (
            <DateTimePicker
              value={toDate || getTodayDate()}
              mode="date"
              display="default"
              onChange={handleToDateChange}
              minimumDate={fromDate || undefined}
              maximumDate={getTodayDate()}
            />
          )}
        </>
      )}

      {Platform.OS === 'ios' && (
        <>
          <Modal
            visible={showFromDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFromDatePicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: MedicalTheme.colors.background.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Select From Date</Text>
                  <Pressable onPress={() => setShowFromDatePicker(false)}>
                    <Text style={{ fontSize: 16, color: MedicalTheme.colors.primary[500], fontWeight: '600' }}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={fromDate || getTodayDate()}
                  mode="date"
                  display="spinner"
                  onChange={handleFromDateChange}
                  maximumDate={getTodayDate()}
                  textColor={MedicalTheme.colors.text.primary}
                />
              </View>
            </View>
          </Modal>

          <Modal
            visible={showToDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowToDatePicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: MedicalTheme.colors.background.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Select To Date</Text>
                  <Pressable onPress={() => setShowToDatePicker(false)}>
                    <Text style={{ fontSize: 16, color: MedicalTheme.colors.primary[500], fontWeight: '600' }}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={toDate || getTodayDate()}
                  mode="date"
                  display="spinner"
                  onChange={handleToDateChange}
                  minimumDate={fromDate || undefined}
                  maximumDate={getTodayDate()}
                  textColor={MedicalTheme.colors.text.primary}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </ErrorBoundary>
  );
};

export default ReportScreen;