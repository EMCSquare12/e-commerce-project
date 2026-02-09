import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageNumber: 1,
    keyword: "",
};

const productDetailsSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {
        setProductPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
        setProductKeyword: (state, action) => {
            state.keyword = action.payload;
        }
    },
});

export const { setProductPageNumber, setProductKeyword } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;