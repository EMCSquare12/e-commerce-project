import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    pageNumber: 1,
    category: [],
    brand: []
};
const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        searchItem: (state, action) => {
            state.keyword = action.payload

        },
        setItemPages: (state, action) => {
            state.pageNumber = action.payload
        },
        setCategory: (state, action) => {
            const category = action.payload;

            if (state.category.includes(category)) {
                // Remove it
                state.category = state.category.filter(
                    (c) => c !== category
                );
            } else {
                // Add it
                state.category.push(category);
            }

        },
        setBrand: (state, action) => {
            const brand = action.payload;

            if (state.brand.includes(brand)) {
                // Remove it
                state.brand = state.brand.filter(
                    (c) => c !== brand
                );
            } else {
                // Add it
                state.brand.push(brand);
            }

        },
        // Helper to reset
        clearFilter: (state) => {
            state.keyword = ""
            state.category = [];
            state.brand = [];
            state.pageNumber = 1
        }
    },
});

export const { searchItem, setItemPages, setCategory, clearFilter, setBrand } = filterSlice.actions;

export default filterSlice.reducer;