import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import DashboardScreen from "./screen/DashboardScreen.jsx";
import OrdersScreen from "./screen/OrdersScreen.jsx";
import ProductsScreen from "./screen/ProductsScreen.jsx";
import CustomersScreen from "./screen/CustomersScreen.jsx";
import AnalyticsScreen from "./screen/AnalyticsScreen.jsx";
import MarketingScreen from "./screen/MarketingScreen.jsx";
import SettingsScreen from "./screen/SettingsScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/admin" element={<DashboardScreen />} />
      <Route index={true} path="/admin/orders" element={<OrdersScreen />} />
      <Route index={true} path="/admin/products" element={<ProductsScreen />} />
      <Route
        index={true}
        path="/admin/customers"
        element={<CustomersScreen />}
      />
      <Route
        index={true}
        path="/admin/analytics"
        element={<AnalyticsScreen />}
      />
      <Route
        index={true}
        path="/admin/marketing"
        element={<MarketingScreen />}
      />
      <Route index={true} path="/admin/settings" element={<SettingsScreen />} />
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
