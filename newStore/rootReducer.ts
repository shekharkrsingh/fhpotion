import { combineReducers } from "@reduxjs/toolkit";
import signupReducer from "@/newStore/slices/signupSlice";
import forgetPasswordReducer from "@/newStore/slices/forgetPasswordSlice";
import profileReducer from "@/newStore/slices/profileSlice";
import appointmentReducer from "@/newStore/slices/appointmentSlice";
import statisticsReducer from "@/newStore/slices/statisticsSlice";
import notificationReducer from "@/newStore/slices/notificationSlice";

export const rootReducer = combineReducers({
  signup: signupReducer,
  forgetPassword: forgetPasswordReducer,
  profile: profileReducer,
  appointments: appointmentReducer,
  statistics: statisticsReducer,
  notification: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
