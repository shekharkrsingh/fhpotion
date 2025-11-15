import SafeScreen from "@/newComponents/SafeScreen";
import { store } from "@/newStore/index";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        // Hide the default Expo splash screen immediately
        // This allows only your custom splash screen to be visible
        SplashScreen.hideAsync().catch(() => {
            // Ignore errors if splash screen is already hidden
        });
    }, []);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <SafeScreen>
                    <Stack
                        screenOptions={{
                            headerShown: false
                        }}>
                        <Stack.Screen name="index"/>
                        <Stack.Screen name="(auth)"/>
                        <Stack.Screen name="(tabs)"/>
                    </Stack>
                </SafeScreen>
                <StatusBar style="dark"/>
            </SafeAreaProvider>
        </Provider>
    )
}
