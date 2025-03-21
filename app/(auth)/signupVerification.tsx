import OTPVerification from '@/componets/OTPVerificationProps';
import { sendOtp, signup } from '@/service/properties/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export default function SignupVerification() {
    const { firstName, lastName, email, password } = useSelector((state: RootState) => state.signup);

    if (!email || !firstName || !lastName || !password) {
        Alert.alert("Error", "Required data is missing!");
        return null;
    }

    const handleSubmit = async (otp: string) => {
        const response = await signup(firstName, lastName, email, password, otp);
        if (response) {
            console.log("Signup Successful", response);
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
