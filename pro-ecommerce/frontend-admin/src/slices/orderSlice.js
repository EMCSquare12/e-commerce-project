import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dateRange: {
        from: "",
        to: ""
    },
    status: "",
    pageNumber: 1,
    page: 1

}

const orderSlice = createSlice({
    name: "name",
    initialState,
    reducers: {
        setDateRange: (state, action) => {
            const { name, value } = action.payload
            state.dateRange[name] = value
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload
        },

    }
})

export const { setDateRange, setStatus, setPageNumber, setPage } = orderSlice.actions;
export default orderSlice.reducer