import "./AdminFavorites.css";

import { useEffect, useState } from "react";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function AdminFavorites() {
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState({});

  useEffect(() => {
    loadFavorites();

    loadUsers();
  }, []);

  // =========================
  // LOAD FAVORITES
  // =========================

  async function loadFavorites() {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "favorites"));

      const data = snapshot.docs.map((item) => ({
        firebaseId: item.id,

        ...item.data(),
      }));

      setFavorites(data);
    } catch (error) {
      console.log("Load favorites error:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOAD USERS
  // =========================

  async function loadUsers() {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const userData = {};

      snapshot.docs.forEach((item) => {
        userData[item.id] = item.data();
      });

      setUsers(userData);
    } catch (error) {
      console.log("Load users error:", error);
    }
  }

  // =========================
  // DELETE FAVORITE
  // =========================

  async function deleteFavorite(id) {
    const confirmDelete = window.confirm("Remove this favorite?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "favorites", id));

      loadFavorites();
    } catch (error) {
      console.log("Delete favorite error:", error);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading Favorites..." />;
  }

  return (
    <div className="admin-favorites">
      <h1>❤️ Favorites Management</h1>

      <p className="favorite-count">Total Favorites: {favorites.length}</p>

      <div className="favorite-list">
        {favorites.length === 0 ? (
          <h3>No Favorites Found</h3>
        ) : (
          favorites.map((fav) => (
            <div className="favorite-card" key={fav.firebaseId}>
              <img
                src={fav.image || "/default-placeholder.jpg"}
                alt={fav.title}
              />

              <div className="favorite-info">
                <h3>🎬 {fav.title || "Unknown Movie"}</h3>

                <p>
                  👤 User:{" "}
                  {users[fav.userId]?.name ||
                    users[fav.userId]?.email ||
                    fav.userId}
                </p>

                <p>⭐ Rating: {fav.rating || 0}</p>

                <p>
                  📅{" "}
                  {fav.createdAt
                    ? new Date(fav.createdAt).toLocaleString()
                    : "No Date"}
                </p>
              </div>

              <button onClick={() => deleteFavorite(fav.firebaseId)}>
                🗑 Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminFavorites;
