import { ORDERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: ({ keyword, status, from, to, pageNumber }) => ({
                params: { keyword, status, from, to, pageNumber },
                url: `${ORDERS_URL}/admin`,
            }),
            providesTags: ["Orders"],
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetOrdersQuery } = ordersApiSlice