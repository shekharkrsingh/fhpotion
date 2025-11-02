// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface Appointment {
//     appointmentId: string;
//     doctorId: string;
//     patientName: string;
//     contact: string;
//     description: string | null;
//     appointmentDateTime: string;
//     bookingDateTime: string;
//     availableAtClinic: boolean;
//     treated: boolean;
//     treatedDateTime: string | null;
//     status: string;
//     appointmentType: string;
//     paymentStatus: boolean;
// }

// interface AppointmentState {
//     data: Appointment[];
//     loading: boolean;
//     error: string | null;
//     success: boolean;
// }

// const initialState: AppointmentState = {
//     data: [],
//     loading: false,
//     error: null,
//     success: false,
// };

// const appointmentSlice = createSlice({
//     name: "appointments",
//     initialState,
//     reducers: {
//         setAppointments: (state, action: PayloadAction<Appointment[]>) => {
//             state.data = action.payload;
//             console.log(action.payload)
//             state.success = true;
//             state.error = null;
//         },
//         setLoading: (state, action: PayloadAction<boolean>) => {
//             state.loading = action.payload;
//         },
//         setError: (state, action: PayloadAction<string | null>) => {
//             state.error = action.payload;
//             state.success = false;
//         },
//         setSuccess: (state, action: PayloadAction<boolean>) => {
//             state.success = action.payload;
//         },
//     },
// });

// export const { setAppointments, setLoading, setError, setSuccess } = appointmentSlice.actions;
// export default appointmentSlice.reducer;
