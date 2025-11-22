import SafeScreen from "@/newComponents/SafeScreen";
import { store } from "@/newStore/index";
import {Stack} from "expo-router";
import {StatusBar, Platform} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { websocketAppointment } from "@/newService/config/websocket/websocketService";
import ErrorBoundary from "@/newComponents/ErrorBoundary";
import { MedicalTheme } from "@/newConstants/theme";

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync().catch(() => {});

        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(MedicalTheme.colors.secondary[500], true);
            StatusBar.setTranslucent(false);
        }
        StatusBar.setBarStyle('light-content', true);

        websocketAppointment.initialize(
            store.dispatch,
            () => store.getState().profile
        );

        websocketAppointment.initializeAppStateListener();

        return () => {
            websocketAppointment.removeAppStateListener();
            websocketAppointment.disconnect();
        };
    }, []);

    return (
        <ErrorBoundary>
            <Provider store={store}>
                <SafeAreaProvider>
                    <StatusBar 
                        barStyle="light-content"
                        backgroundColor={MedicalTheme.colors.secondary[500]}
                        translucent={false}
                    />
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
                </SafeAreaProvider>
            </Provider>
        </ErrorBoundary>
    )
}
