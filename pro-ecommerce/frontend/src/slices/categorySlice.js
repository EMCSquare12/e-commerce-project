import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCategory: [],
};
const filterCategory = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory: (state, action) => {
            const category = action.payload;

            if (state.selectedCategory.includes(category)) {
                // Remove it
                state.selectedCategory = state.selectedCategory.filter(
                    (c) => c !== category
                );
            } else {
                // Add it
                state.selectedCategory.push(category);
            }

        },
        // Helper to reset
        clearCategories: (state) => {
            state.selectedCategory = [];
        }
    },
});

export const { setCategory, clearCategories } = filterCategory.actions;

export default filterCategory.reducer;