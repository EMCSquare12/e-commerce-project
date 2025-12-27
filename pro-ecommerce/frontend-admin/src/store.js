import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import productSliceReducer from './slices/productSlice'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        product: productSliceReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;