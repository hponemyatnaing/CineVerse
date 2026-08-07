import { Outlet } from "react-router-dom";

import "./AdminLayout.css";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

function MainLayout() {
  const rawUser = localStorage.getItem("user");

  const user = rawUser ? JSON.parse(rawUser) : null;

  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

export default MainLayout;
