import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userInfo?.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
});

export const apiSlice = createApi({
    baseQuery,
    // Defines tag types for caching and invalidation
    tagTypes: ['Product', 'Order', 'User'],
    // Endpoints are defined in injected slices (e.g. productsApiSlice)
    endpoints: (builder) => ({}),
});