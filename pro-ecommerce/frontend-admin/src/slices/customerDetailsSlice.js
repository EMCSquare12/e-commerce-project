import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    pageNumber: 1,
};

const customerSlice = createSlice({
    name: "customerDetails",
    initialState,
    reducers: {
        setCustomerByIdKeyword: (state, action) => {
            state.keyword = action.payload;
            state.pageNumber = 1;
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
    },
});

export const { setCustomerByIdKeyword, setPageNumber } = customerSlice.actions;
export default customerSlice.reducer;