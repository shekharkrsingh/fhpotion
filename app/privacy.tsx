import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MedicalTheme } from '@/newConstants/theme';
import { styles } from '@/assets/styles/privacy.styles';
import ErrorBoundary from '@/newComponents/ErrorBoundary';

const PrivacyPolicyScreen = () => {
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
      title: '1. Introduction',
      content: `Heal Now ("we," "our," or "us") is committed to protecting your privacy and the privacy of your patients. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.

This policy applies to all users of the Heal Now platform, including healthcare professionals, medical practitioners, and any individuals who access our services. We take your privacy seriously and are committed to maintaining the confidentiality and security of all personal and medical information.`,
    },
    {
      title: '2. Information We Collect',
      content: `We collect several types of information to provide and improve our services:

Personal Information:
• Name, email address, phone number
• Professional credentials and licenses
• Specialization and years of experience
• Profile information and clinic details

Medical and Patient Data:
• Patient names and contact information
• Appointment details and medical history
• Treatment records and notes
• Medical reports and documents

Technical Information:
• Device information and operating system
• IP address and location data
• App usage statistics and analytics
• Crash reports and error logs

Account Information:
• Login credentials (securely encrypted)
• Account preferences and settings
• Notification preferences
• Activity logs and audit trails`,
    },
    {
      title: '3. How We Use Your Information',
      content: `We use the collected information for the following purposes:

Service Provision:
• To provide and maintain our appointment management services
• To process and manage your appointments
• To generate medical reports and documents
• To send notifications and updates
• To provide customer support and respond to inquiries

Platform Improvement:
• To analyze usage patterns and improve our services
• To develop new features and functionality
• To ensure platform security and prevent fraud
• To conduct research and analytics (anonymized data only)

Communication:
• To send important service-related notifications
• To provide updates about new features or changes
• To respond to your requests and inquiries
• To send marketing communications (with your consent)

Legal Compliance:
• To comply with applicable laws and regulations
• To respond to legal requests and court orders
• To protect our rights and prevent illegal activities
• To enforce our Terms and Conditions`,
    },
    {
      title: '4. HIPAA and Medical Privacy Compliance',
      content: `We understand the critical importance of medical privacy:

HIPAA Compliance:
• We are committed to maintaining HIPAA compliance
• All Protected Health Information (PHI) is handled according to HIPAA standards
• We implement administrative, physical, and technical safeguards
• We enter into Business Associate Agreements (BAAs) where required
• We conduct regular security audits and assessments

Patient Data Protection:
• Patient information is encrypted both in transit and at rest
• Access to patient data is restricted to authorized personnel only
• We maintain detailed audit logs of all data access
• Patient data is never used for marketing without explicit consent
• We comply with all applicable medical privacy laws and regulations

Your Responsibilities:
• You must obtain proper patient consent before entering data
• You are responsible for maintaining patient confidentiality
• You must use secure methods to access the platform
• You must report any suspected security breaches immediately`,
    },
    {
      title: '5. Data Security Measures',
      content: `We implement industry-standard security measures to protect your information:

Encryption:
• All data transmitted between your device and our servers is encrypted using TLS/SSL
• Patient data and sensitive information are encrypted at rest using AES-256 encryption
• Passwords are hashed using bcrypt with salt
• Authentication tokens are securely generated and validated

Access Controls:
• Multi-factor authentication available for enhanced security
• Role-based access controls limit data access to authorized personnel
• Regular security audits and penetration testing
• Employee access is logged and monitored

Infrastructure Security:
• Secure cloud infrastructure with regular security updates
• Firewall protection and intrusion detection systems
• Regular backups with encrypted storage
• Disaster recovery and business continuity plans

Incident Response:
• 24/7 security monitoring and threat detection
• Rapid incident response procedures
• Regular security training for all employees
• Compliance with industry security standards`,
    },
    {
      title: '6. Data Sharing and Disclosure',
      content: `We do not sell your personal information or patient data. We may share information only in the following circumstances:

Service Providers:
• We may share data with trusted third-party service providers who assist in operating our platform
• All service providers are bound by strict confidentiality agreements
• Service providers are required to implement appropriate security measures
• We regularly audit our service providers' security practices

Legal Requirements:
• We may disclose information if required by law or court order
• We may share information to comply with legal processes
• We may disclose information to protect our rights or prevent illegal activities
• We will notify you of legal requests when legally permitted

Business Transfers:
• In the event of a merger, acquisition, or sale, your data may be transferred
• We will notify you of any such transfer and provide options for your data
• The new entity will be bound by this Privacy Policy

With Your Consent:
• We may share information with your explicit consent
• You can withdraw consent at any time
• We will clearly explain what information will be shared and with whom`,
    },
    {
      title: '7. Your Privacy Rights',
      content: `You have the following rights regarding your personal information:

Access and Portability:
• Request access to your personal information
• Request a copy of your data in a portable format
• Review the information we have about you
• Request corrections to inaccurate information

Deletion and Restriction:
• Request deletion of your personal information (subject to legal requirements)
• Request restriction of processing in certain circumstances
• Object to processing of your information for specific purposes
• Withdraw consent where processing is based on consent

Data Control:
• Update your account information at any time
• Modify your privacy preferences and settings
• Opt-out of marketing communications
• Request information about data processing activities

To exercise these rights, please contact us at privacy@healnow.com. We will respond to your request within 30 days.`,
    },
    {
      title: '8. Patient Data Rights',
      content: `Patients have specific rights regarding their medical information:

Patient Access:
• Patients can request access to their medical records
• Patients can request copies of their information
• Patients can review appointment history and records
• Patients can request corrections to their information

Patient Control:
• Patients can request deletion of their data (subject to legal retention requirements)
• Patients can restrict how their information is used
• Patients can object to certain processing activities
• Patients can file complaints about data handling

Healthcare Provider Responsibilities:
• You must inform patients about data collection and use
• You must obtain proper consent before entering patient data
• You must respond to patient requests regarding their data
• You must maintain patient confidentiality at all times

We assist healthcare providers in fulfilling their obligations to patients while maintaining compliance with all applicable laws.`,
    },
    {
      title: '9. Data Retention',
      content: `We retain information for as long as necessary to provide our services and comply with legal obligations:

Active Accounts:
• Account information is retained while your account is active
• Appointment data is retained for the duration of your account
• Medical records are retained according to legal requirements
• We retain data necessary for service provision

Inactive Accounts:
• We retain data for a reasonable period after account closure
• Medical records may be retained longer due to legal requirements
• You can request deletion of your account and associated data
• Some information may be retained for legal compliance purposes

Legal Requirements:
• Medical records may be retained for periods required by law (typically 7-10 years)
• Financial records are retained as required by tax and accounting laws
• Audit logs are retained for security and compliance purposes
• We comply with all applicable data retention regulations

Data Deletion:
• Upon account deletion, we will delete or anonymize your data
• Some data may be retained for legal or regulatory compliance
• We will inform you of any data that must be retained
• Deleted data is securely removed from our systems`,
    },
    {
      title: '10. Cookies and Tracking Technologies',
      content: `We use various technologies to improve your experience:

Essential Cookies:
• Required for the app to function properly
• Enable authentication and session management
• Ensure security and prevent fraud
• Cannot be disabled without affecting functionality

Analytics and Performance:
• Help us understand how the app is used
• Identify areas for improvement
• Monitor performance and errors
• All analytics data is anonymized

You can control cookie preferences through your device settings, though this may affect app functionality.`,
    },
    {
      title: '11. Third-Party Services',
      content: `Our app may integrate with third-party services:

Cloud Services:
• We use secure cloud providers for data storage and processing
• All cloud providers are HIPAA-compliant and certified
• Data is encrypted and access is strictly controlled
• We regularly audit third-party security practices

Analytics Services:
• We use analytics services to improve our platform
• All analytics data is anonymized and aggregated
• No personally identifiable information is shared
• You can opt-out of analytics tracking

Payment Processors:
• Payment information is processed by secure, PCI-compliant providers
• We do not store full payment card information
• All payment transactions are encrypted
• Payment processors are bound by strict security standards

We carefully vet all third-party services and ensure they meet our security and privacy standards.`,
    },
    {
      title: '12. International Data Transfers',
      content: `Your information may be transferred and processed in different countries:

Data Location:
• Data may be stored on servers located in different countries
• We ensure all data transfers comply with applicable laws
• We use standard contractual clauses and safeguards
• We comply with GDPR and other international privacy laws

Safeguards:
• We implement appropriate safeguards for international transfers
• We ensure data protection standards are maintained
• We comply with all applicable cross-border data transfer regulations
• We regularly review and update our transfer mechanisms

If you have concerns about international data transfers, please contact us for more information.`,
    },
    {
      title: '13. Children\'s Privacy',
      content: `Our services are designed for healthcare professionals and are not intended for children:

Age Requirements:
• Our services are intended for licensed healthcare professionals
• Users must be at least 18 years old and hold valid medical licenses
• We do not knowingly collect information from children
• If we discover we have collected information from a child, we will delete it immediately

Patient Data:
• When handling pediatric patient data, we maintain the same high security standards
• Healthcare providers are responsible for obtaining proper parental consent
• We comply with all applicable laws regarding children's medical information
• Special protections apply to pediatric patient data as required by law`,
    },
    {
      title: '14. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time:

Notification of Changes:
• We will notify you of material changes through the app or email
• The "Last Updated" date at the bottom indicates when the policy was last revised
• We recommend reviewing this policy periodically
• Continued use after changes constitutes acceptance

Material Changes:
• Significant changes will be clearly communicated
• You will have the opportunity to review and accept changes
• You can contact us if you have questions about changes
• You may terminate your account if you do not agree with changes

We are committed to transparency and will always inform you of significant privacy policy updates.`,
    },
    {
      title: '15. Your Responsibilities',
      content: `As a user of our platform, you have important responsibilities:

Security:
• Maintain the confidentiality of your login credentials
• Use strong, unique passwords
• Enable multi-factor authentication when available
• Log out when using shared devices
• Report any suspected security breaches immediately

Patient Privacy:
• Obtain proper consent before entering patient information
• Maintain patient confidentiality at all times
• Comply with all applicable medical privacy laws
• Use the platform only for legitimate medical purposes
• Report any privacy concerns or violations

Data Accuracy:
• Ensure all information you provide is accurate and current
• Update your profile information regularly
• Verify patient information before entering it
• Correct any errors you discover promptly

Compliance:
• Comply with all applicable laws and regulations
• Follow professional medical standards and ethics
• Respect patient rights and privacy
• Use the platform in accordance with these terms`,
    },
    {
      title: '16. Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy:

Privacy Officer:
• Email: privacy@healnow.com
• Phone: [Your Contact Number]
• Address: [Your Company Address]

Data Protection Officer:
• Email: dpo@healnow.com
• For GDPR-related inquiries and data subject requests

General Support:
• Email: support@healnow.com
• Available Monday-Friday, 9 AM - 6 PM

We are committed to addressing your privacy concerns promptly and thoroughly. We aim to respond to all inquiries within 48 hours during business days.`,
    },
  ];

  return (
    <ErrorBoundary>
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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.headerSubtitle}>Data Protection & Privacy</Text>
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
              <Ionicons name="shield-checkmark" size={48} color={MedicalTheme.colors.primary[500]} />
            </View>
            <Text style={styles.introTitle}>Privacy Policy</Text>
            <Text style={styles.introSubtitle}>Heal Now - Your Privacy Matters</Text>
            <View style={styles.introDivider} />
            <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>

          <View style={styles.introductionSection}>
            <Text style={styles.introductionText}>
              At Heal Now, we are committed to protecting your privacy and the privacy of your patients. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.
            </Text>
            <Text style={styles.introductionText}>
              We understand the sensitive nature of medical information and have implemented comprehensive security measures to protect all data. This policy complies with HIPAA, GDPR, and other applicable privacy regulations.
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
              <Ionicons name="lock-closed" size={32} color={MedicalTheme.colors.success[500]} />
              <Text style={styles.acknowledgmentTitle}>Your Privacy is Protected</Text>
              <Text style={styles.acknowledgmentText}>
                We are committed to maintaining the highest standards of data protection and privacy. Your information and your patients' information are handled with the utmost care and in compliance with all applicable laws and regulations.
              </Text>
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Questions About Privacy?</Text>
            <Text style={styles.footerText}>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </Text>
            <Text style={styles.footerContact}>
              privacy@healnow.com
            </Text>
          </View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
};

export default PrivacyPolicyScreen;

