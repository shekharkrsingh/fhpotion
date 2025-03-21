import SafeScreen from "@/componets/SafeScreen";
import { store } from "@/redux/store";
// import store from "@/redux/store";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";

export default function RootLayout() {
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
                    </Stack>
                </SafeScreen>
                <StatusBar style="dark"/>
            </SafeAreaProvider>
        </Provider>
    )
}
