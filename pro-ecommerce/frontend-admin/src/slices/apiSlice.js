import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
    baseQuery,
    // Defines tag types for caching and invalidation
    tagTypes: ['Product', 'Order', 'User'],
    // Endpoints are defined in injected slices (e.g. productsApiSlice)
    endpoints: (builder) => ({}),
});