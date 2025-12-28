import { createSlice } from '@reduxjs/toolkit';

const initialCreateFormData = {
    name: "",
    price: 0,
    countInStock: 0,
    category: "",
    brand: "",
    description: "",
}

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
    updateFormData: {
        name: "",
        price: 0,
        category: "",
        countInStock: 0,
        sku: "",
    },
    createFormData: initialCreateFormData
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setDeleteModal: (state, action) => {
            state.deleteModal = { ...state.deleteModal, ...action.payload }

        },
        setUpdateModal: (state, action) => {
            state.updateModal = { ...state.updateModal, ...action.payload }

        },
        setCreateNewProductModal: (state, action) => {
            state.createNewProductModal = { ...state.createNewProductModal, ...action.payload }

        },
        clearCreateFormData: (state, action) => {
            state.createFormData = initialCreateFormData;
        },
        filterChange: (state, action) => {
            const { key, value } = action.payload
            state.filter[key] = value
            if (key !== 'page') {
                state.filter.page = 1
            }

        },
        setUpdateFormData: (state, action) => {
            state.updateFormData = { ...state.updateFormData, ...action.payload }

        },
        setCreateFormData: (state, action) => {
            state.createFormData = { ...state.createFormData, ...action.payload }

        },
        setLoadingGlobal: (state, action) => {
            state.isLoadingGlobal = action.payload
        }

    },
});

export const {
    setDeleteModal,
    setUpdateModal,
    setCreateNewProductModal,
    filterChange,
    setLoadingGlobal,
    setUpdateFormData,
    setCreateFormData,
    clearCreateFormData
} = productSlice.actions;

export default productSlice.reducer;