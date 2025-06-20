import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menus: null,
    isOpened: false,
    menuDrawerWidth: 0,
    subMenuDrawerWidth: 0,
    activeMenu: null,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setMenus: (state, action) => {
            state.menus = action.payload;
        },
        openMenus: (state) => {
            state.isOpened = true;
            state.menuDrawerWidth = 250;
        },
        toggleMenus: (state) => {
            state.isOpened = !state.isOpened;
            state.menuDrawerWidth = state.isOpened ? 250 : 0;
        }
    },
});

export const { setMenus, openMenus, toggleMenus } = sidebarSlice.actions;
export const selectSidebar = (state: any) => state.sidebar;
export default sidebarSlice.reducer;