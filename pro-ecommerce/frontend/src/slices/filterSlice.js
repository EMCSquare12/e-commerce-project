import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    pageNumber: 0,
    category: [],
};
const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        searchItem: (state, action) => {
            state.keyword = action.payload

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

export const { searchItem, setCategory, clearCategories } = filterSlice.actions;

export default filterSlice.reducer;