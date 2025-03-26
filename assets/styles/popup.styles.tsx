import COLORS from "@/constants/colors";
import { StyleSheet } from "react-native";


const styles=StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      popupContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
      },
      message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      button: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      cancelButton: {
        backgroundColor: '#f44336',
      },
      okButton: {
        backgroundColor: COLORS.primary,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
})

export default styles;