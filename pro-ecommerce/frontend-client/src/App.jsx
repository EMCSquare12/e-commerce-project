import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Drawer from "./components/Drawer";
import BottomNavigation from "./components/BottomNavigation";
import { useAddToCartMutation } from "./slices/cartApiSlice";

const App = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [syncCart] = useAddToCartMutation();

  useEffect(() => {
    if (userInfo) {
      const syncTimeout = setTimeout(() => {
        syncCart({ cartItems })
          .unwrap()
          .catch((err) => console.error("Sync failed", err));
      }, 500);

      return () => clearTimeout(syncTimeout);
    }
  }, [cartItems, userInfo, syncCart]);

  return (
    <div className="flex flex-row w-full min-h-screen">
      {isOpen && <Drawer />}

      <div
        className={`flex flex-col w-full font-sans text-slate-900 bg-gray-50 transition-all duration-300 ${
          isOpen ? "md:ml-80" : ""
        }`}
      >
        <Header />
        <main className="container flex-grow px-4 py-8 mx-auto mb-16 md:mb-0">
          <Outlet />
        </main>

        <Footer />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default App;
