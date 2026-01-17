import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    openSidebar: false,
};

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        toggleSidebar: (state, action) => {
            state.openSidebar = action.payload;
        },

    },
});

export const {
    toggleSidebar
} = toggleSlice.actions;

export default toggleSlice.reducer;