import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BackgroundPhoto from "../assets/background.jpg";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="bg-default-background flex flex-col h-screen"
      style={{
        backgroundImage: `url(${BackgroundPhoto})`,
        backgroundSize: "cover",

      }}
    >
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className=" ml-64 flex  flex-1 z-1">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1  overflow-auto">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
