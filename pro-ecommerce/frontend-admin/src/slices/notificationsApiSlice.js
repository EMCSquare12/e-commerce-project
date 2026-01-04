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
        }),
        clearNotifications: builder.mutation({
            query: () => ({
                method: "DELETE",
                url: `${NOTIFCATIONS_URL}`
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllNotifications: builder.mutation({
            query: () => ({
                method: "PUT",
                url: `${NOTIFCATIONS_URL}/read-all`
            }),
            invalidatesTags: ["Notifications"],
        }),
        markNotificationsRead: builder.mutation({
            query: ({ notificationId }) => ({
                method: "PUT",
                url: `${NOTIFCATIONS_URL}/${notificationId}/read`
            }),
            invalidatesTags: ["Notifications"]
        }),
        getNotificationDetails: builder.query({
            query: ({ notificationId }) => ({
                url: `${NOTIFCATIONS_URL}/${notificationId}`
            }),
            invalidatesTags: ["Notifications"]
        }),
        deleteSelectedNotification: builder.mutation({
            query: ({ notificationId }) => ({
                url: `${NOTIFCATIONS_URL}/${notificationId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Notifications"]
        })
    })
});

export const {
    useGetNotificationsQuery,
    useClearNotificationsMutation,
    useMarkAllNotificationsMutation,
    useMarkNotificationsReadMutation,
    useGetNotificationDetailsQuery,
    useDeleteSelectedNotificationMutation
} = notificationApiSlice;