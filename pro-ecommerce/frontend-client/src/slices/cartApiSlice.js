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
        addCartItem: builder.mutation({
            query: (cartItem) => ({
                url: `${CART_URL}`,
                method: "POST",
                body: cartItem
            }),
            invalidatesTags: ["Cart"]
        }),
        updateCartItemQuantity: builder.mutation({
            query: ({ cartItemId, quantity }) => ({
                url: `${CART_URL}/${cartItemId}`,
                method: "PUT",
                body: { quantity }
            }),
            invalidatesTags: ["Cart"]
        }),
        removeCartItem: builder.mutation({
            query: (cartItemId) => ({
                url: `${CART_URL}/${cartItemId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        })
    })
});

export const {
    useGetCartQuery,
    useAddCartItemMutation,
    useUpdateCartItemQuantityMutation,
    useRemoveCartItemMutation
} = cartApiSlice;
