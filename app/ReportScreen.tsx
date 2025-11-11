import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDoctorReports } from '@/newService/config/api/reportsAPI';
import { MedicalTheme } from '@/newConstants/theme';
import AlertPopup from '@/newComponents/alertPopup';
import { reportScreenStyles as styles } from '@/assets/styles/ReportScreen.styles';

const ReportScreen: React.FC = () => {
  const router = useRouter();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);

  // Date calculation helpers
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };
  const getFirstDayOfYear = () => {
    const today = new Date();
    return new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
  };

  const validateDates = (): boolean => {
    if (!fromDate) {
      setError('Please select a from date');
      return false;
    }
    if (toDate && fromDate > toDate) {
      setError('From date cannot be after to date');
      return false;
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

  const generateReport = async (customFromDate?: string, customToDate?: string) => {
    const useFromDate = customFromDate || fromDate;
    const useToDate = customToDate || toDate;

    if (!validateDates() && !customFromDate) return;

    try {
      setLoading(true);
      setError(null);
      setPdfData(null); // Reset previous data

      console.log(`Generating report for: ${useFromDate} to ${useToDate}`);

      const result = await getDoctorReports(useFromDate, useToDate || undefined);
      
      console.log(`Report generated successfully: ${result.fileName}, Size: ${result.pdfData.length} bytes`);
      
      setPdfData(result.pdfData);
      setFileName(result.fileName);
      
      // Show success alert
      setShowAlert(true);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate report';
      setError(errorMessage);
      console.error('Generate report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!pdfData) return;

    try {
      console.log(`Downloading PDF: ${fileName}, Size: ${pdfData.length} bytes`);
      
      if (Platform.OS === 'web') {
        // Web download - direct blob approach
        const blob = new Blob([pdfData], { type: 'application/pdf' });
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
        
        console.log('PDF download initiated on web');
      } else {
        // React Native - Save and share with proper base64 encoding
        const base64Data = uint8ArrayToBase64(pdfData);
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        
        console.log(`Writing PDF to cache: ${fileUri}`);
        
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Verify file was written
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log(`File written: ${fileInfo.exists}, Size: ${fileInfo.size} bytes`);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Download Doctor Report',
            UTI: 'com.adobe.pdf',
          });
        }
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setError(`Failed to download PDF: ${err.message}`);
    }
  };

  const sharePdf = async () => {
    if (!pdfData) return;

    try {
      if (Platform.OS === 'web') {
        // Web share API
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const file = new File([blob], fileName, { type: 'application/pdf' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'Doctor Report',
          });
        } else {
          // Fallback to download if share not supported
          console.log('Web Share API not supported, falling back to download');
          downloadPdf();
        }
      } else {
        // React Native share
        const base64Data = uint8ArrayToBase64(pdfData);
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Share.share({
          url: fileUri,
          title: 'Doctor Report',
          type: 'application/pdf',
        });
      }
    } catch (err: any) {
      console.log('Share cancelled or failed:', err);
    }
  };

  // Quick action handlers
  const handleTodayReport = () => generateReport(getTodayDate(), getTodayDate());
  const handleYesterdayReport = () => generateReport(getYesterdayDate(), getYesterdayDate());
  const handleThisMonth = () => generateReport(getFirstDayOfMonth(), getTodayDate());
  const handleThisYear = () => generateReport(getFirstDayOfYear(), getTodayDate());
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
    // Placeholder for contact us action
    console.log('Contact us button pressed');
  };

  return (
    <>
      {/* Improved Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={MedicalTheme.colors.primary[500]} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Medical Reports</Text>
          <Text style={styles.headerSubtitle}>Generate and download patient reports</Text>
        </View>
        
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactUs}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="headset-outline" 
            size={24} 
            color={MedicalTheme.colors.primary[500]} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Generate Doctor Report</Text>
        <Text style={styles.subtitle}>Select date range to generate PDF report</Text>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reports</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, loading && styles.disabledButton]}
              onPress={handleTodayReport}
              disabled={loading}
            >
              <MaterialIcons name="today" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, loading && styles.disabledButton]}
              onPress={handleYesterdayReport}
              disabled={loading}
            >
              <MaterialIcons name="history" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>Yesterday</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, loading && styles.disabledButton]}
              onPress={handleThisMonth}
              disabled={loading}
            >
              <MaterialIcons name="calendar-today" size={20} color={MedicalTheme.colors.primary[500]} />
              <Text style={styles.quickActionText}>This Month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, loading && styles.disabledButton]}
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
            <TextInput
              style={[styles.input, error && !fromDate && styles.inputError]}
              value={fromDate}
              onChangeText={setFromDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={MedicalTheme.colors.text.tertiary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Date (Optional)</Text>
            <TextInput
              style={styles.input}
              value={toDate}
              onChangeText={setToDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={MedicalTheme.colors.text.tertiary}
              editable={!loading}
            />
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
            <Text style={styles.actionsDescription}>
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
            <Text style={styles.infoText}>Select dates in YYYY-MM-DD format</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText}>Use quick actions for common time periods</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText}>Report will be generated and ready for download</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={16} color={MedicalTheme.colors.success[500]} />
            <Text style={styles.infoText}>Use download/share buttons to save the report</Text>
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
    </>
  );
};

export default ReportScreen;