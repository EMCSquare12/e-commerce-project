import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-gray-50">
      <Header />
      <main className="container flex-grow px-4 py-8 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
