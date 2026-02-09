import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageNumber: 1,
};

const productDetailsSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {
        setProductPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
    },
});

export const { setProductPageNumber } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;