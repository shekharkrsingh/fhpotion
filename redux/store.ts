import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "@/redux/slices/signupSlice";
import forgetPasswordReducer  from "@/redux/slices/forgetPasswordSlice"
import profileReducer from "@/redux/slices/profileSlice"
import appointmentReducer from "@/redux/slices/appointmentSlice"
import statisticsReducer from "@/redux/slices/statisticsSlice"
import notificationReducer from "@/redux/slices/notificationSlice"

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    forgetPassword: forgetPasswordReducer,
    profile: profileReducer,
    appointments: appointmentReducer,
    statistics: statisticsReducer,
    notification: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
