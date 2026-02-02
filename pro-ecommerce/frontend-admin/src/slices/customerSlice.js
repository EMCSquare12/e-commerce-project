import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "",
    keyword: "",
    pageNumber: 1,
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomerStatus: (state, action) => {
            state.status = action.payload;
            state.pageNumber = 1;
        },
        setCustomerKeyword: (state, action) => {
            state.keyword = action.payload;
            state.pageNumber = 1;
        },
        setCustomerPage: (state, action) => {
            state.pageNumber = action.payload;
        },
    },
});

export const { setCustomerStatus, setCustomerKeyword, setCustomerPage } = customerSlice.actions;
export default customerSlice.reducer;