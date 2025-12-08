import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};

const toggleSlice = createSlice({
    name: "toggle",
    initialState,
    reducers: {
        openDrawer: (state) => {
            state.isOpen = true;
        },
        closeDrawer: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openDrawer, closeDrawer } = toggleSlice.actions;
export default toggleSlice.reducer;
