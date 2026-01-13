import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Drawer from "./components/Drawer";
import { useSelector } from "react-redux";

const App = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  return (
    <div className="flex flex-row w-full min-h-screen ">
      {isOpen && <Drawer />}
      <div
        className={`flex flex-col w-full font-sans text-slate-900 bg-gray-50 transition-all duration-300 ${
          isOpen ? "md:ml-80" : ""
        }`}
      >
        <Header />
        <main className="container flex-grow px-4 py-8 mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;