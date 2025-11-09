// import { Link } from "expo-router";
// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Shekhar</Text>
//       <Link href="/(auth)/signup">Signup Page</Link>
//       <Link href="/(auth)">Login Page</Link>
//       <Link href="/(auth)/signupDetails">Signup Details</Link>
//       {/* <Link href="/(auth)/signupVerification">Signup OTP verification</Link> */}
//       <Link href="/(auth)/forgot">Forget Password</Link>
//       <Link href="/splashScreen">SPLASH SCREEN</Link>
//       <Link href="/(tabs)/home">Home</Link>
//       <Link href={"/AppointmentsScreen"}>Appointment</Link>
//       <Link href={"/test"}>Test</Link>
//       {/* <Link href={"/newScreen/signup"}>new Signup</Link> */}
//       {/* <Link href={"/newScreen/newForgetPassword"}>new forget passwrod</Link> */}
//     </View>
//   );
// }

// splashScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Image, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { getProfile } from "@/newService/config/api/profileApi";
import { AppTheme } from "@/constants/theme";
import { fetchDoctorStatistics } from "@/newService/config/api/statisticsApi";
import { getAppointments } from "@/newService/config/api/appointmentApi";
import { fetchAllNotifications } from "@/newService/config/api/notificationApi";
import { AppDispatch } from "@/newStore";
import { splashScreenStyles } from "@/assets/styles/splashScreen.styles";
import { waitForWebSocketConnection } from "@/utils/websocketUtils";

export default function index() {
    const [initialized, setInitialized] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

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
            }),
        ]).start();

        // Initialize app
        const initializeApp = async () => {
            try {
                // Step 1️⃣: Fetch statistics (blocking)
                const statisticsSuccess = await dispatch(fetchDoctorStatistics());

                if (statisticsSuccess) {
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
    }, [dispatch]);

    const animatedBg = bgColor.interpolate({
        inputRange: [0, 1],
        outputRange: [AppTheme.colors.white, AppTheme.colors.gray100],
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
                            width: loadingWidth.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"],
                            }),
                            backgroundColor: AppTheme.colors.primary,
                        },
                    ]}
                />
            </View>

            <View style={splashScreenStyles.brandContainer}>
                <Image
                    source={require("@/assets/images/HP-largeLogo.png")}
                    style={splashScreenStyles.brandMark}
                    resizeMode="contain"
                />
                <View style={splashScreenStyles.taglineContainer}>
                    <Animated.Text
                        style={[
                            splashScreenStyles.tagline,
                            { opacity: logoOpacity },
                        ]}
                    >
                        Modern Solutions, Magical Results
                    </Animated.Text>
                </View>
            </View>
        </Animated.View>
    );
}