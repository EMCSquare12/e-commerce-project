import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import productSliceReducer from './slices/productSlice'
import productDetailsSliceReducer from './slices/productDetailsSlice'
import notificationsSliceReducer from './slices/notificationsSlice'
import orderSliceReducer from "./slices/orderSlice"
import toggleSliceReducer from './slices/toggleSlice'
import customerSliceReducer from './slices/customerSlice';
import customerDetailsSliceReducer from './slices/customerDetailsSlice';
import adminSliceReducer from './slices/adminSlice';


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        product: productSliceReducer,
        productDetails: productDetailsSliceReducer,
        order: orderSliceReducer,
        notifications: notificationsSliceReducer,
        toggle: toggleSliceReducer,
        customer: customerSliceReducer,
        customerDetails: customerDetailsSliceReducer,
        admin: adminSliceReducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;