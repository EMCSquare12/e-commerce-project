import { RATINGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ratingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitRating: builder.mutation({
            query: (data) => ({
                url: `${RATINGS_URL}`,
                method: 'POST',
                body: data,
                invalidatesTags: ["Product"],
            }),
        }),
        getRatingsByProduct: builder.query({
            query: (productId) => ({
                url: `${RATINGS_URL}/product/${productId}`,
                providesTags: ["Product"],
                keepUnusedDataFor: 5,
            }),
        }),
    }),
});

export const {
    useSubmitRatingMutation,
    useGetRatingsByProductQuery,
} = ratingsApiSlice;