import { NOTIFCATIONS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: `${NOTIFCATIONS_URL}`
            }),
            providesTags: ["Notifications"],
            keepUnusedDataFor: 5
        })
    })
});

export const { useGetNotificationsQuery } = notificationApiSlice;