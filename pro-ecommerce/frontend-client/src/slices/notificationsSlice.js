import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Mock data to simulate client actions
    notifications: [
        {
            id: 1,
            type: "order",
            message: "New Order #1010 placed by Sample 2",
            date: new Date().toISOString(),
            read: false,
            link: "/admin/order/1010",
        },
        {
            id: 2,
            type: "user",
            message: "New User Registered: John Doe",
            date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            read: false,
            link: "/admin/users/123",
        },
        {
            id: 3,
            type: "alert",
            message: "Low Stock: Wireless Mouse (Qty: 2)",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: true,
            link: "/admin/product/456",
        },
    ],
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        markAsRead: (state, action) => {
            const item = state.notifications.find((n) => n.id === action.payload);
            if (item) item.read = true;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => (n.read = true));
        },
        clearAll: (state) => {
            state.notifications = [];
        },
        // Call this action via socket.io or API polling when client acts
        addNotification: (state, action) => {
            state.notifications.unshift({
                id: Date.now(),
                read: false,
                date: new Date().toISOString(),
                ...action.payload,
            });
        },
    },
});

export const { markAsRead, markAllAsRead, clearAll, addNotification } =
    notificationsSlice.actions;

export default notificationsSlice.reducer;