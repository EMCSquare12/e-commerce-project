import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Drawer from "./components/Drawer";
import { useSelector } from "react-redux";

const App = () => {
  const isOpen = useSelector((state) => state.toggle.isOpen);
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-gray-50">
      {isOpen && <Drawer />}
      <Header />
      <main className="container flex-grow px-4 py-8 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
