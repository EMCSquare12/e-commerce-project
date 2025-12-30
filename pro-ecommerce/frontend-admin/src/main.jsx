import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate, // <--- 2. Import Navigate
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

// Screens imports...
import DashboardScreen from "./screen/DashboardScreen.jsx";
import OrdersScreen from "./screen/OrdersScreen.jsx";
import ProductsScreen from "./screen/ProductsScreen.jsx";
import CustomersScreen from "./screen/CustomersScreen.jsx";
import AnalyticsScreen from "./screen/AnalyticsScreen.jsx";
import MarketingScreen from "./screen/MarketingScreen.jsx";
import SettingsScreen from "./screen/SettingsScreen.jsx";
import LoginScreen from "./screen/LoginScreen.jsx";
import NotificationsScreen from "./screen/NotificationsScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="admin/notifications" element={<NotificationsScreen />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardScreen />} />
          <Route path="/admin/orders" element={<OrdersScreen />} />
          <Route path="/admin/products" element={<ProductsScreen />} />
          <Route path="/admin/customers" element={<CustomersScreen />} />
          <Route path="/admin/analytics" element={<AnalyticsScreen />} />
          <Route path="/admin/marketing" element={<MarketingScreen />} />
          <Route path="/admin/settings" element={<SettingsScreen />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
