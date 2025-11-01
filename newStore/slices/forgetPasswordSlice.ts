import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

interface ForgetPasswordState {
  email: string;
  newPassword: string;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ForgetPasswordState = {
  email: "",
  newPassword: "",
  loading: false,
  success: false,
  error: null,
};

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState,
  reducers: {
    setForgetPasswordData: (
      state,
      action: PayloadAction<Partial<ForgetPasswordState>>
    ) => {
      Object.assign(state, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearForgetPassword: () => initialState,
  },
});

export const selectForgetPassword = (state: RootState) => state.forgetPassword;
export const selectForgetPasswordLoading = (state: RootState) =>
  state.forgetPassword.loading;
export const selectForgetPasswordError = (state: RootState) =>
  state.forgetPassword.error;

export const {
  setForgetPasswordData,
  setLoading,
  setSuccess,
  setError,
  clearForgetPassword,
} = forgetPasswordSlice.actions;

export default forgetPasswordSlice.reducer;
