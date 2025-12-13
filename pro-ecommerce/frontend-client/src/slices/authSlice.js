import { createSlice } from '@reduxjs/toolkit';

// Try to get user info from local storage to maintain session on refresh
const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action to set credentials on login/register
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        // Action to clear credentials on logout
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;