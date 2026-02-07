import { ORDERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: ({ keyword, status, from, to, pageNumber, userId }) => ({
                params: { keyword, status, from, to, pageNumber, userId },
                url: `${ORDERS_URL}/admin`,
            }),
            providesTags: ["Orders"],
            keepUnusedDataFor: 5,
        }),
        upateDeliveryStatus: builder.mutation({
            query: ({ orderId }) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Orders"]
        })
    })
})

export const {
    useGetOrdersQuery,
    useUpateDeliveryStatusMutation
} = ordersApiSlice