// assets/styles/splashScreen.styles.ts
import { StyleSheet } from "react-native";
import { AppTheme } from "@/constants/theme";

export const splashScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        marginBottom: AppTheme.spacing.xxl,
    },
    logo: {
        width: 180,
        height: 180,
    },
    loadingBarContainer: {
        width: "60%",
        height: 4,
        backgroundColor: AppTheme.colors.gray200,
        borderRadius: AppTheme.borderRadius.full,
        overflow: "hidden",
        marginBottom: AppTheme.spacing.xxl,
    },
    loadingBar: {
        height: "100%",
    },
    brandContainer: {
        position: "absolute",
        bottom: AppTheme.spacing.xxl,
        alignItems: "center",
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
        fontFamily: "Inter-Medium",
    },
});