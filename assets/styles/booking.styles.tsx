import COLORS from "@/constants/colors";
import { AppTheme } from "@/constants/theme";
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.primaryLight,
    },
    boookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: AppTheme.colors.white,
        borderBottomWidth: 1,
        borderBlockColor: AppTheme.colors.gray400,
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: AppTheme.colors.primary
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: 8
    },
    searchInput: {
        height: 40,
        borderColor: AppTheme.colors.primaryLight,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 14,
        backgroundColor: AppTheme.colors.gray100
    },
});

export default styles