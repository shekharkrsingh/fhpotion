import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MedicalTheme } from '@/newConstants/theme';
import { styles } from '@/assets/styles/terms.styles';
import ErrorBoundary from '@/newComponents/ErrorBoundary';

const TermsAndConditionsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/settings');
    }
  };

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Heal Now application ("App"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.

These terms apply to all users of the App, including doctors, healthcare providers, and any other individuals who access or use the platform.`,
    },
    {
      title: '2. Description of Service',
      content: `Heal Now is a comprehensive appointment management platform designed specifically for healthcare professionals. The App provides the following services:

• Appointment scheduling and management
• Patient information management
• Medical report generation
• Real-time notifications and updates
• Statistics and analytics dashboard
• Secure communication tools

We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.`,
    },
    {
      title: '3. User Accounts and Registration',
      content: `To use the App, you must:

• Be a licensed healthcare professional or authorized medical practitioner
• Provide accurate, current, and complete information during registration
• Maintain and update your registration information to keep it accurate
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized use of your account
• Be responsible for all activities that occur under your account

We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.`,
    },
    {
      title: '4. Medical Professional Responsibilities',
      content: `As a healthcare professional using this platform, you agree to:

• Maintain all necessary licenses, certifications, and qualifications required to practice medicine
• Comply with all applicable medical laws, regulations, and professional standards
• Provide accurate and truthful information about your qualifications and services
• Maintain patient confidentiality in accordance with HIPAA and other applicable privacy laws
• Use the platform only for legitimate medical purposes
• Not use the App for any illegal or unauthorized purpose

You are solely responsible for all medical decisions, diagnoses, and treatments provided to patients.`,
    },
    {
      title: '5. Patient Data and Privacy',
      content: `The protection of patient information is of utmost importance:

• All patient data must be handled in accordance with HIPAA, GDPR, and other applicable privacy regulations
• You are responsible for maintaining the confidentiality of patient information
• You must obtain proper consent before accessing or sharing patient data
• We implement industry-standard security measures, but you must also take appropriate precautions
• Any breach of patient confidentiality may result in immediate account termination and legal action

Please refer to our Privacy Policy for detailed information about data handling practices.`,
    },
    {
      title: '6. Appointment Management',
      content: `The App facilitates appointment scheduling and management:

• You are responsible for the accuracy of appointment information
• You must honor confirmed appointments or provide appropriate notice for cancellations
• We are not responsible for missed appointments or scheduling conflicts
• Appointment data is stored securely but you should maintain your own records
• We reserve the right to implement appointment limits or restrictions if necessary`,
    },
    {
      title: '7. Intellectual Property',
      content: `All content, features, and functionality of the App are owned by Heal Now and are protected by international copyright, trademark, and other intellectual property laws:

• You may not copy, modify, distribute, or create derivative works from the App
• You may not reverse engineer, decompile, or disassemble the software
• The Heal Now name, logo, and branding are trademarks and may not be used without permission
• User-generated content remains your property, but you grant us a license to use it for service provision

Any unauthorized use may result in legal action.`,
    },
    {
      title: '8. Prohibited Activities',
      content: `You agree NOT to:

• Use the App for any illegal purpose or in violation of any laws
• Transmit any viruses, malware, or harmful code
• Attempt to gain unauthorized access to the App or its systems
• Interfere with or disrupt the App's operation or security
• Use automated systems to access the App without permission
• Impersonate any person or entity
• Collect or harvest information about other users
• Engage in any activity that could harm the App's reputation or functionality

Violations may result in immediate account termination and legal consequences.`,
    },
    {
      title: '9. Service Availability and Modifications',
      content: `We strive to provide reliable service but cannot guarantee:

• Uninterrupted or error-free operation
• Immediate availability of all features
• Compatibility with all devices or operating systems
• Correction of all defects or errors

We reserve the right to:
• Modify, update, or discontinue features at any time
• Perform maintenance that may temporarily interrupt service
• Implement security updates and patches
• Change pricing or service terms with appropriate notice

We will provide reasonable notice of significant changes when possible.`,
    },
    {
      title: '10. Limitation of Liability',
      content: `To the maximum extent permitted by law:

• The App is provided "as is" without warranties of any kind
• We are not liable for any indirect, incidental, or consequential damages
• We are not responsible for medical decisions, treatments, or outcomes
• We are not liable for data loss, service interruptions, or security breaches beyond our reasonable control
• Our total liability is limited to the amount you paid for the service in the past 12 months

This limitation does not affect your rights as a consumer under applicable law.`,
    },
    {
      title: '11. Indemnification',
      content: `You agree to indemnify and hold harmless Heal Now, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:

• Your use of the App
• Your violation of these Terms and Conditions
• Your violation of any laws or regulations
• Your medical practice or patient care decisions
• Any content you submit or transmit through the App

This indemnification obligation will survive termination of your account.`,
    },
    {
      title: '12. Termination',
      content: `Either party may terminate this agreement:

• You may terminate your account at any time through the App settings
• We may suspend or terminate accounts that violate these terms
• We may terminate accounts that are inactive for extended periods
• Upon termination, your right to use the App immediately ceases
• We may delete your account data after a reasonable retention period
• Provisions that by their nature should survive termination will remain in effect

We will provide notice of termination when possible, except in cases of serious violations.`,
    },
    {
      title: '13. Dispute Resolution',
      content: `In the event of any dispute:

• We encourage direct communication to resolve issues amicably
• Disputes will be governed by the laws of the jurisdiction where Heal Now operates
• Any legal action must be brought within one year of the cause of action
• You agree to resolve disputes through binding arbitration if required by law
• Class action waivers may apply as permitted by law

Please contact our support team before initiating any legal proceedings.`,
    },
    {
      title: '14. Changes to Terms',
      content: `We reserve the right to modify these Terms and Conditions at any time:

• Material changes will be communicated through the App or via email
• Continued use of the App after changes constitutes acceptance
• If you do not agree to changes, you must stop using the App
• The "Last Updated" date at the bottom indicates when terms were last revised
• We recommend reviewing these terms periodically

Your continued use of the App following any changes indicates your acceptance of the new terms.`,
    },
    {
      title: '15. Contact Information',
      content: `For questions, concerns, or support regarding these Terms and Conditions:

• Email: legal@healnow.com
• Support: support@healnow.com
• Address: [Your Company Address]
• Phone: [Your Contact Number]

We aim to respond to all inquiries within 48 hours during business days.`,
    },
    {
      title: '16. Severability and Entire Agreement',
      content: `If any provision of these terms is found to be unenforceable:

• The remaining provisions will continue in full force and effect
• The unenforceable provision will be modified to the minimum extent necessary
• These Terms and Conditions constitute the entire agreement between you and Heal Now
• Any prior agreements or understandings are superseded by these terms
• No oral or written statement outside these terms modifies the agreement

This agreement may only be modified in writing by authorized Heal Now representatives.`,
    },
  ];

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={MedicalTheme.colors.primary[500]} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <Text style={styles.headerSubtitle}>Legal Agreement</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.introSection}>
            <View style={styles.introIconContainer}>
              <Ionicons name="document-text" size={48} color={MedicalTheme.colors.primary[500]} />
            </View>
            <Text style={styles.introTitle}>Terms and Conditions</Text>
            <Text style={styles.introSubtitle}>Heal Now - Doctor Appointment Management Platform</Text>
            <View style={styles.introDivider} />
            <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>

          <View style={styles.introductionSection}>
            <Text style={styles.introductionText}>
              Welcome to Heal Now. These Terms and Conditions ("Terms") govern your access to and use of the Heal Now mobile application and related services (collectively, the "Service"). Please read these Terms carefully before using our Service.
            </Text>
            <Text style={styles.introductionText}>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </Text>
          </View>

          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.acknowledgmentSection}>
            <View style={styles.acknowledgmentCard}>
              <Ionicons name="checkmark-circle" size={32} color={MedicalTheme.colors.success[500]} />
              <Text style={styles.acknowledgmentTitle}>Acknowledgment</Text>
              <Text style={styles.acknowledgmentText}>
                By using the Heal Now application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. You also acknowledge that you are a licensed healthcare professional authorized to use this platform.
              </Text>
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Questions About These Terms?</Text>
            <Text style={styles.footerText}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Text>
            <Text style={styles.footerContact}>
              legal@healnow.com
            </Text>
          </View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
};

export default TermsAndConditionsScreen;

