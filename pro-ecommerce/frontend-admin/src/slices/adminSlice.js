import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    pageNumber: 1,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminKeyWord: (state, action) => {
            state.keyword = action.payload;
            state.pageNumber = 1;
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
    },
});

export const { setAdminKeyWord, setPageNumber } = adminSlice.actions;
export default adminSlice.reducer;