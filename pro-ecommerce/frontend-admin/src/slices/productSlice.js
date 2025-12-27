import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoadingGlobal: false,
    filter: { category: "", status: "", page: 1 },
    deleteModal: {
        open: false,
        id: null,
        name: "",
    },
    updateModal: {
        open: false,
        product: null,
    },
    createNewProductModal: {
        open: false,
        product: null,
    },
    formData: {
        name: "",
        price: 0,
        category: "",
        countInStock: 0,
        sku: "",
    }
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // display Delete Modal
        setDeleteModal: (state, action) => {
            state.deleteModal = { ...state.deleteModal, ...action.payload }

        },
        setUpdateModal: (state, action) => {
            state.updateModal = { ...state.updateModal, ...action.payload }

        },
        filterChange: (state, action) => {
            const { key, value } = action.payload
            state.filter[key] = value
            if (key !== 'page') {
                state.filter.page = 1
            }

        },
        setLoadingGlobal: (state, action) => {
            state.isLoadingGlobal = action.payload
        }

    },
});

export const { setDeleteModal, setUpdateModal, filterChange, setLoadingGlobal } = productSlice.actions;

export default productSlice.reducer;