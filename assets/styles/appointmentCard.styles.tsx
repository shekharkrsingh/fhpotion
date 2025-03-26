// styles/login.styles.js
import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors";



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 6,
    paddingRight:20,
    justifyContent: "center",
    marginTop:2,
    marginBottom:2,
    marginHorizontal:12,
    borderColor: COLORS.border,
    borderWidth:1,
    borderRadius:6
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    color: COLORS.textDark
  },
  paidTag: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unpaidTag: {
    backgroundColor: 'rgb(207, 205, 205)',
  },
  paidText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  unpaidText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },checkIcon: {
    fontSize: 20,
    color: COLORS.primary,
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'column', // Changed to column for better readability
    padding: 12,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailTitle: {
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontSize: 14,
  },
  paymentStatus: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentStatusLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
  },
  toggleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  
});

export default styles;