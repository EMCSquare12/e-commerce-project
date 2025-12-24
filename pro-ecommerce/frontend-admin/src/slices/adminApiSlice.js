import { ADMIN_STATS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const adminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTotalRevenue: builder.query({
            query: () => ({
                url: ADMIN_STATS_URL
            }),
            providesTags: ["Orders"],
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetTotalRevenueQuery } = adminSlice