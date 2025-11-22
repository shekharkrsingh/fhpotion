import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string;
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: SignupState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  otp: "",
  isLoading: false,
  success: false,
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setSignupData: (state, action: PayloadAction<Partial<SignupState>>) => {
      Object.assign(state, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSignup: () => initialState,
  },
});

export const selectSignup = (state: RootState) => state.signup;
export const selectSignupLoading = (state: RootState) => state.signup.isLoading;
export const selectSignupError = (state: RootState) => state.signup.error;

export const {
  setSignupData,
  setLoading,
  setSuccess,
  setError,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;
