import React, { useEffect, useState } from "react";
import { View, Image, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { getProfile } from "@/newService/config/api/profileApi";
import { MedicalTheme } from "@/newConstants/theme";
import { fetchDoctorStatistics } from "@/newService/config/api/statisticsApi";
import { getAppointments } from "@/newService/config/api/appointmentApi";
import { fetchAllNotifications } from "@/newService/config/api/notificationApi";
import { AppDispatch } from "@/newStore";
import { splashScreenStyles } from "@/assets/styles/splashScreen.styles";
import { waitForWebSocketConnection } from "@/utils/websocketUtils";

export default function SplashScreen() {
    const [initialized, setInitialized] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    // Animations - using useRef to prevent recreation on every render
    const logoScale = React.useRef(new Animated.Value(0.8)).current;
    const logoOpacity = React.useRef(new Animated.Value(0)).current;
    const bgColor = React.useRef(new Animated.Value(0)).current;
    const loadingWidth = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animations
        const animations = Animated.parallel([
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
            }),
        ]);
        
        animations.start();

        // Initialize app
        const initializeApp = async () => {
            try {
                // Step 1️⃣: Fetch statistics (blocking)
                const statisticsResult = await dispatch(fetchDoctorStatistics());

                if (statisticsResult.type.endsWith('/fulfilled')) {
                    // Step 2️⃣: Lazy load other data
                    await Promise.allSettled([
                        dispatch(getProfile()),
                        dispatch(getAppointments()),
                        dispatch(fetchAllNotifications()),
                    ]);

                    // Step 3️⃣: Ensure WebSocket is connected before navigation
                    const socketConnected = await waitForWebSocketConnection();

                    if (socketConnected) {
                        console.log("✅ WebSocket connected before navigation");
                    } else {
                        console.log("⚠️ WebSocket connection timeout — proceeding anyway");
                    }

                    // Step 4️⃣: Navigate to dashboard
                    router.replace("/(tabs)/home");
                } else {
                    // Statistics failed, go to auth
                    router.replace("/(auth)");
                }
            } catch (error) {
                router.replace("/(auth)");
            }
        };

        initializeApp();

        // Cleanup function to stop animations on unmount
        return () => {
            animations.stop();
        };
    }, [dispatch]);

    const animatedBg = bgColor.interpolate({
        inputRange: [0, 1],
        outputRange: [
            MedicalTheme.colors.background.primary, 
            MedicalTheme.colors.background.secondary
        ],
    });

    const animatedLoadingBar = loadingWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <Animated.View style={[splashScreenStyles.container, { backgroundColor: animatedBg }]}>
            <Animated.View
                style={[
                    splashScreenStyles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <Image
                    source={require("@/assets/images/HP-miniLogo.png")}
                    style={splashScreenStyles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            <View style={splashScreenStyles.loadingBarContainer}>
                <Animated.View
                    style={[
                        splashScreenStyles.loadingBar,
                        {
                            width: animatedLoadingBar,
                            backgroundColor: MedicalTheme.colors.primary[500],
                        },
                    ]}
                />
            </View>

            <View style={splashScreenStyles.brandContainer}>
                <Image
                    source={require("@/assets/images/HP-miniLogo.png")}
                    style={splashScreenStyles.brandMark}
                    resizeMode="contain"
                />
                <View style={splashScreenStyles.taglineContainer}>
                    <Animated.Text
                        style={[
                            splashScreenStyles.tagline,
                            { 
                                opacity: logoOpacity,
                                color: MedicalTheme.colors.text.secondary,
                            },
                        ]}
                    >
                        Modern Solutions, Magical Results
                    </Animated.Text>
                </View>
            </View>
        </Animated.View>
    );
}