import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "@/redux/slices/signupSlice";
import forgetPasswordReducer  from "@/redux/slices/forgetPasswordSlice"

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    forgetPassword: forgetPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
