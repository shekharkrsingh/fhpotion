import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Shekhar</Text>
      <Link href="/(auth)/signup">Signup Page</Link>
      <Link href="/(auth)">Login Page</Link>
      <Link href="/(auth)/signupDetails">Signup Details</Link>
      <Link href="/(auth)/signupVerification">Signup OTP verification</Link>
      <Link href="/(auth)/forgot">Forget Password</Link>
      <Link href="/splashScreen">SPLASH SCREEN</Link>
      <Link href="/(tabs)/home">Home</Link>
      <Link href={"/AppointmentsScreen"}>Appointment</Link>
      <Link href={"/test"}>Test</Link>
      <Link href={"/newScreen/signup"}>new Signup</Link>
      {/* <Link href={"/newScreen/newForgetPassword"}>new forget passwrod</Link> */}
    </View>
  );
}
