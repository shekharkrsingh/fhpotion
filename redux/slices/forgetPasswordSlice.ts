import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForgetPasswordState {
    email: string;
    newPassword: string;
}

const initialState: ForgetPasswordState = {
    email: "",
    newPassword: ""
};

const forgetPasswordSlice = createSlice({
    name: "forgetPassword",
    initialState,
    reducers: {
        setForgetPasswordData: (state, action: PayloadAction<ForgetPasswordState>) => {
            return {...state, ...action.payload}
        },
        clearForgetPassword: (state) => {
            state.email = "";
            state.newPassword = "";
        },
    },
});

export const { setForgetPasswordData, clearForgetPassword } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
