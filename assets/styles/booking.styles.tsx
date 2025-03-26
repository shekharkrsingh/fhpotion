import COLORS from "@/constants/colors";
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    boookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBlockColor: COLORS.semiWhite,
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: 8
    },
    searchInput: {
        height: 40,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 14,
        backgroundColor: COLORS.inputBackground
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.semiWhite,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    filterButton: {
        paddingVertical: 6, // Reduced padding for smaller buttons
        paddingHorizontal: 12,
        marginHorizontal: 6,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80, // Keeps the buttons wide enough
        marginBottom: 0, // Removed bottom margin to eliminate extra space
    },
    activeButton: {
        backgroundColor: COLORS.primary, // Green color for active filter
    },
    filterText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '500'
    },
    activeFilterText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '500'
    }
});

export default styles