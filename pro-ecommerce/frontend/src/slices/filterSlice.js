import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    pageNumber: 1,
    category: [],
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
        // Helper to reset
        clearCategories: (state) => {
            state.category = [];
        }
    },
});

export const { searchItem, setItemPages, setCategory, clearCategories } = filterSlice.actions;

export default filterSlice.reducer;