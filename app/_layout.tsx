import SafeScreen from "@/newComponents/SafeScreen";
import { store } from "@/newStore/index";
import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { websocketAppointment } from "@/newService/config/websocket/websocketService";
import ErrorBoundary from "@/newComponents/ErrorBoundary";

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        // Hide the default Expo splash screen immediately
        // This allows only your custom splash screen to be visible
        SplashScreen.hideAsync().catch(() => {
            // Ignore errors if splash screen is already hidden
        });

        // Initialize WebSocket service with dispatch and state getter
        // This decouples the service from direct store access
        websocketAppointment.initialize(
            store.dispatch,
            () => store.getState().profile
        );

        // Initialize WebSocket AppState listener for background/foreground handling
        websocketAppointment.initializeAppStateListener();

        // Cleanup: Remove AppState listener and disconnect WebSocket on app unmount
        return () => {
            websocketAppointment.removeAppStateListener();
            websocketAppointment.disconnect();
        };
    }, []);

    return (
        <ErrorBoundary>
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
                    {/* Reverted: remove explicit StatusBar override */}
                </SafeAreaProvider>
            </Provider>
        </ErrorBoundary>
    )
}
