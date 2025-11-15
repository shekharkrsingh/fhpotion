import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { doctorEndpoints } from "@/newService/config/apiEndpoints";

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

export interface ProfileData {
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
}

interface ProfileState extends ProfileData {
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

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

export const getProfile = createAsyncThunk<
  ProfileData,
  void,
  { rejectValue: string }
>(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<ProfileData>>({
        method: "GET",
        url: doctorEndpoints.getDoctorProfile,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch profile"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching profile.");
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk<
  ProfileData,
  Record<string, any>,
  { rejectValue: string }
>(
  "profile/updateProfile",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<ProfileData>>({
        method: "PUT",
        url: doctorEndpoints.updateDoctor,
        bodyData: updateData,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to update profile"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while updating profile.");
      return rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<Partial<ProfileState>>) => {
      Object.assign(state, action.payload);
    },
    resetProfile: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch profile";
        state.success = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update profile";
        state.success = false;
      });
  },
});

export const selectProfile = (state: RootState) => state.profile;
export const selectProfileLoading = (state: RootState) => state.profile.isLoading;
export const selectProfileError = (state: RootState) => state.profile.error;

export const {
  setProfileData,
  resetProfile,
  clearError,
} = profileSlice.actions;

export default profileSlice.reducer;
