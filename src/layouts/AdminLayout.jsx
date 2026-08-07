import { Outlet } from "react-router-dom";

import "./AdminLayout.css";

import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
