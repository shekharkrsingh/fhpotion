import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      return { ...state, ...action.payload };
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

export const { setSignupData, setLoading, setSuccess, setError, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
