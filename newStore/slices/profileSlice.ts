import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

export type AvailableDayEnum = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Address {
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
}

interface ProfileState {
  firstName: string;
  lastName: string;
  doctorId: string;
  specialization: string | null;
  phoneNumber: string | null;
  availableDays: AvailableDayEnum[] | null;
  availableTimeSlots: TimeSlot[] | null;
  clinicAddress: string | null;
  address: Address | null;
  education: string[] | null;
  achievementsAndAwards: string[] | null;
  about: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
  gender: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  createdAt: string;
  updatedAt: string;
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  firstName: "",
  lastName: "",
  doctorId: "",
  specialization: null,
  phoneNumber: null,
  availableDays: null,
  availableTimeSlots: null,
  clinicAddress: null,
  address: null,
  education: null,
  achievementsAndAwards: null,
  about: null,
  bio: null,
  yearsOfExperience: null,
  gender: null,
  profilePicture: null,
  coverPicture: null,
  createdAt: "",
  updatedAt: "",
  isLoading: false,
  success: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<Partial<ProfileState>>) => {
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
    resetProfile: () => initialState,
  },
});

export const selectProfile = (state: RootState) => state.profile;
export const selectProfileLoading = (state: RootState) => state.profile.isLoading;
export const selectProfileError = (state: RootState) => state.profile.error;

export const {
  setProfileData,
  setLoading,
  setSuccess,
  setError,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
