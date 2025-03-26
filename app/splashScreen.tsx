import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import COLORS from "@/constants/colors";
import { getProfile } from "@/service/properties/profileApi"; // Ensure this function exists
import { useDispatch } from "react-redux";

export default function SplashScreen() {
    const [profileFetched, setProfileFetched] = useState<boolean | null>(null);
    const [fetchCompleted, setFetchCompleted] = useState(false);
    const [timeCompleted, setTimeCompleted] = useState(false);
    const dispatch=useDispatch();

    useEffect(() => {
        // Fetch profile in the background
        const fetchProfile = async () => {
            const success = await getProfile(dispatch);
            setProfileFetched(success);
            setFetchCompleted(true); // Profile fetching is completed
        };

        fetchProfile();

        // Ensure the splash screen stays for at least 1 second
        const timer = setTimeout(() => {
            setTimeCompleted(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Ensure navigation only happens when both conditions are met
        if (fetchCompleted && timeCompleted) {
            if (profileFetched) {
                router.replace("/(tabs)/home"); // Navigate to Home if profile fetch is successful
            } else {
                router.replace("/(auth)")// Navigate to Login on failure
            }
        }
    }, [fetchCompleted, timeCompleted]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.background
            }}>
            <Image
                source={require("@/assets/images/HP-miniLogo.png")}
                style={{
                    width: 150,
                    height: 150
                }}
                resizeMode="contain"/>
            <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{
                    marginTop: 20
                }}/>
        </View>
    );
}
