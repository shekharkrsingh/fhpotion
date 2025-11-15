// newComponents/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MedicalTheme } from '@/newConstants/theme';
import { router } from 'expo-router';
import { Platform } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to error tracking service here
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      // For React Native, navigate to splash screen to reinitialize
      this.handleReset();
      router.replace('/splashScreen');
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{ flex: 1, backgroundColor: MedicalTheme.colors.background.primary }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: MedicalTheme.colors.error[50],
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
              }}
            >
              <MaterialIcons
                name="error-outline"
                size={64}
                color={MedicalTheme.colors.error[500]}
              />
              
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: MedicalTheme.colors.error[700],
                  marginTop: 16,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                Something Went Wrong
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: MedicalTheme.colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                We encountered an unexpected error. Don't worry, your data is safe. Please try restarting the app or contact support if the problem persists.
              </Text>

              {__DEV__ && this.state.error && (
                <View
                  style={{
                    backgroundColor: MedicalTheme.colors.background.secondary,
                    borderRadius: 8,
                    padding: 12,
                    width: '100%',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: MedicalTheme.colors.error[700],
                      marginBottom: 4,
                    }}
                  >
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: MedicalTheme.colors.text.tertiary,
                      }}
                    >
                      {this.state.errorInfo.componentStack.split('\n')[1]}
                    </Text>
                  )}
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: MedicalTheme.colors.primary[500],
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={this.handleReset}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: MedicalTheme.colors.text.inverse,
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Try Again
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: MedicalTheme.colors.background.secondary,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: MedicalTheme.colors.primary[500],
                  }}
                  onPress={this.handleReload}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: MedicalTheme.colors.primary[500],
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Restart App
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

