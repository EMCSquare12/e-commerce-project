import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App.jsx";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import StripeWrapper from "./components/StripeWrapper";
import NotificationsScreen from "./screens/NotificationsScreen.jsx";
import "./index.css";
import BlogScreen from "./screens/BlogScreen.jsx";
import ContactScreen from "./screens/ContactScreen.jsx";
import NotificationDetailsScreen from "./screens/NotificationDetailsScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route
        path="/notifications/:id"
        element={<NotificationDetailsScreen />}
      />
      <Route path="/blog" element={<BlogScreen />} />{" "}
      <Route path="/contact" element={<ContactScreen />} />
      <Route element={<StripeWrapper />}>
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
