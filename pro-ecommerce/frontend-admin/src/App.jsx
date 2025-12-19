import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      {/* This Outlet renders either LoginScreen OR AdminLayout */}
      <Outlet />
    </>
  );
};

export default App;
