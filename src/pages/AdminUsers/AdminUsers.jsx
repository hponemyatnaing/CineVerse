import "./AdminUsers.css";

import { useEffect, useState } from "react";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "users"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,

        ...item.data(),
      }));

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUsers(data);
    } catch (error) {
      console.log("Load users error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", id));

      loadUsers();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading Users..." />;
  }

  return (
    <div className="admin-users">
      <h1>👥 Users Management</h1>

      <p className="user-count">Total Users : {users.length}</p>

      <div className="users-table">
        <div className="table-header">
          <span>Name</span>

          <span>Email</span>

          <span>Role</span>

          <span>Date</span>

          <span>Action</span>
        </div>

        {users.map((user) => (
          <div className="table-row" key={user.id}>
            <span>{user.name || "User"}</span>

            <span>{user.email}</span>

            <span
              className={user.role === "admin" ? "admin-role" : "user-role"}
            >
              {user.role || "user"}
            </span>

            <span>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </span>

            <button onClick={() => deleteUser(user.id)}>🗑 Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;
