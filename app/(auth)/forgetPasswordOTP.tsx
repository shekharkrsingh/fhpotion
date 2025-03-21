import OTPVerification from '@/componets/OTPVerificationProps';
import { sendOtp, forgotPassword } from '@/service/properties/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

export default function forgetPasswordOTP() {
    const {email, newPassword} = useSelector((state: RootState) => state.forgetPassword);
    const dispatch=useDispatch

    if (!email) {
        Alert.alert("Error", "Required data is missing!");
        return null;
    }

    const handleSubmit = async (otp: string) => {
        const response = await forgotPassword( email, newPassword, otp);
        if (response) {
            console.log("Password Reset Successfully", response);
            router.replace("/(auth)");
        }
    };

    return (
        <OTPVerification 
            email={email} 
            onSubmit={handleSubmit} 
            onResend={() => sendOtp(email)}
        />
    );
}
