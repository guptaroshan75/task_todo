import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	dateFormat: "DD-MM-YYYY",
	timeFormat: "HH:mm",
	serverDateFormat: "YYYY-MM-DD",
	maxFileSize: 10000000,
	settings: {
		rows_per_page: 100,
	},
};

const settingSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		updateSettings: (state, action) => {
			state.dateFormat = action.payload.date_format;
			state.maxFileSize = action.payload.maxFileSize;
			state.settings = action.payload;
		},
	},
});

export const { updateSettings } = settingSlice.actions;
export const selectSettings = (state: any) => state.settings;
export default settingSlice.reducer;