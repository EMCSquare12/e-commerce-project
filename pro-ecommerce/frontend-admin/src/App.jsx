import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pt-16 pl-64">
          <Header />
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
export default App;
