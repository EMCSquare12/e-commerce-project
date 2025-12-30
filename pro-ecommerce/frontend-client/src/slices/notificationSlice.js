import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [
        {
            id: 1,
            title: "Order Shipped",
            message: "Your order #1234 has been shipped.",
            date: "2023-10-25T10:30:00",
            read: false,
            type: "order",
        },
        {
            id: 2,
            title: "New Product Alert",
            message: "Check out the new iPhone 15 Pro Max.",
            date: "2023-10-24T14:20:00",
            read: false,
            type: "promo",
        },
        {
            id: 3,
            title: "Welcome!",
            message: "Thanks for joining ProShop.",
            date: "2023-10-20T09:00:00",
            read: true, // This one is already read
            type: "system",
        },
        {
            id: 4,
            title: "Payment Received",
            message: "We received your payment for order #1234.",
            date: "2023-10-25T10:00:00",
            read: false,
            type: "order",
        },
    ],
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        markAsRead: (state, action) => {
            const item = state.notifications.find((n) => n.id === action.payload);
            if (item) {
                item.read = true;
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => {
                n.read = true;
            });
        },
        clearAll: (state) => {
            state.notifications = [];
        },
        // You can call this when a backend event happens
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
    },
});

export const { markAsRead, markAllAsRead, clearAll, addNotification } =
    notificationSlice.actions;

export default notificationSlice.reducer;