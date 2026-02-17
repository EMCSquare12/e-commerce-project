import { CART_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => ({
                url: `${CART_URL}`
            }),
            providesTags: ["Cart"],
            keepUnusedDataFor: 5
        }),
        addToCart: builder.mutation({
            query: (cartItem) => ({
                url: `${CART_URL}`,
                method: "POST",
                body: cartItem
            }),
            invalidatesTags: ["Cart"]
        }),

    })
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
} = cartApiSlice;
