import { createSlice } from '@reduxjs/toolkit';
import { CONSTANTS } from "../../utils/staticData";

interface AuthState {
	user: any;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
};

const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers: {
		signin: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			localStorage.removeItem(CONSTANTS.tokenLocalStorage);
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { signin, logout, setUser } = AuthSlice.actions;
export const selectUser = (state: any) => state.auth;
export default AuthSlice.reducer;