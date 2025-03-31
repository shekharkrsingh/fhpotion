import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { getProfile } from "@/service/properties/profileApi";
import { useDispatch } from "react-redux";
import { AppTheme } from "@/constants/theme";
import { connectAppointmentWebSocket } from "@/service/properties/websocketAppointment";
import { fetchDoctorStatistics } from "@/service/properties/statisticsApi";
import { getAppointments } from "@/service/properties/appointmentApi";

export default function SplashScreen() {
    const dispatch = useDispatch();
    const [initialized, setInitialized] = useState(false);
    
    // Animations
    const logoScale = new Animated.Value(0.8);
    const logoOpacity = new Animated.Value(0);
    const bgColor = new Animated.Value(0);
    const loadingWidth = new Animated.Value(0);

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(bgColor, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(loadingWidth, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ]).start();

        // Fetch profile
        const initializeApp = async () => {
            try {
                const profileResponse = await getProfile(dispatch);
                const doctorStatisticResponse= await fetchDoctorStatistics();
                const appointmentResponse= await getAppointments(dispatch);
                setTimeout(() => {
                    router.replace(profileResponse && doctorStatisticResponse &&appointmentResponse ? "/(tabs)/home" : "/(auth)");
                }, 2500); // Minimum display time
            } catch (error) {
                router.replace("/(auth)");
            }
        };
        // connectAppointmentWebSocket()
            // .then(() => console.log('Connection attempt completed'))
            // .catch(console.error);

        initializeApp();
    }, []);

    const animatedBg = bgColor.interpolate({
        inputRange: [0, 1],
        outputRange: [AppTheme.colors.white, AppTheme.colors.gray100]
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor: animatedBg }]}>
            <Animated.View style={[
                styles.logoContainer,
                { 
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }] 
                }
            ]}>
                <Image
                    source={require("@/assets/images/HP-miniLogo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            
            <View style={styles.loadingBarContainer}>
                <Animated.View style={[
                    styles.loadingBar,
                    { 
                        width: loadingWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        }),
                        backgroundColor: AppTheme.colors.primary
                    }
                ]}/>
            </View>

            <View style={styles.brandContainer}>
                <Image
                    source={require("@/assets/images/HP-miniLogo.png")} // Replace with your H Potion wordmark if available
                    style={styles.brandMark}
                    resizeMode="contain"
                />
                <View style={styles.taglineContainer}>
                    <Animated.Text style={[
                        styles.tagline,
                        { opacity: logoOpacity }
                    ]}>
                        Modern Solutions, Magical Results
                    </Animated.Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: AppTheme.spacing.xxl,
    },
    logo: {
        width: 180,
        height: 180,
    },
    loadingBarContainer: {
        width: '60%',
        height: 4,
        backgroundColor: AppTheme.colors.gray200,
        borderRadius: AppTheme.borderRadius.full,
        overflow: 'hidden',
        marginBottom: AppTheme.spacing.xxl,
    },
    loadingBar: {
        height: '100%',
    },
    brandContainer: {
        position: 'absolute',
        bottom: AppTheme.spacing.xxl,
        alignItems: 'center',
    },
    brandMark: {
        height: 24,
        width: 100,
        opacity: 0.8,
        marginBottom: AppTheme.spacing.sm,
    },
    taglineContainer: {
        borderTopWidth: 1,
        borderTopColor: AppTheme.colors.gray200,
        paddingTop: AppTheme.spacing.sm,
    },
    tagline: {
        fontSize: 14,
        letterSpacing: 0.5,
        color: AppTheme.colors.gray600,
        fontFamily: 'Inter-Medium',
    },
});