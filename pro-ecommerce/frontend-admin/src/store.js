import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import productSliceReducer from './slices/productSlice'
import notificationsSliceReducer from './slices/notificationsSlice'
import orderSliceReducer from "./slices/orderSlice"
import toggleSliceReducer from './slices/toggleSlice'
import customerSliceReducer from './slices/customerSlice';
import customerDetailsSliceReducer from './slices/customerDetailsSlice';
import adminSlice from './slices/adminSlice';


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        product: productSliceReducer,
        order: orderSliceReducer,
        notifications: notificationsSliceReducer,
        toggle: toggleSliceReducer,
        customer: customerSliceReducer,
        customerDetails: customerDetailsSliceReducer,
        admin: adminSlice.reducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;