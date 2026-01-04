import { getDashboard } from "../../../backend/controllers/adminController";
import { ADMIN_STATS_URL, ORDERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const adminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: ({ pageNumber }) => ({
                params: { pageNumber },
                url: ADMIN_STATS_URL
            }),
            providesTags: ["Orders"],
            keepUnusedDataFor: 5,
        }),
    })
})

export const { useGetDashboardQuery } = adminSlice