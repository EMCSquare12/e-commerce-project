import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dateRange: {
        from: "",
        to: ""
    },
    status: "",
    keyword: "",
    pageNumber: 1,
    page: 1

}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setDateRange: (state, action) => {
            const { name, value } = action.payload
            state.dateRange[name] = value
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setOrderKeyword: (state, action) => {
            state.keyword = action.payload;
            state.pageNumber = 1;
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload
        },

    }
})

export const {
    setDateRange,
    setStatus,
    setPageNumber,
    setPage,
    setOrderKeyword
} = orderSlice.actions;
export default orderSlice.reducer