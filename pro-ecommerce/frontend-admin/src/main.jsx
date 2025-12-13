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
import DashboardScreen from "./screen/DashboardScreen.jsx";
import OrdersScreen from "./screen/OrdersScreen.jsx";
import ProductsScreen from "./screen/ProductsScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/admin" element={<DashboardScreen />} />
      <Route index={true} path="/admin/orders" element={<OrdersScreen />} />
      <Route index={true} path="/admin/products" element={<ProductsScreen />} />
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
