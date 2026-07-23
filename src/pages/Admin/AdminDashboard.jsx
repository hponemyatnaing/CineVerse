import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FaFilm, FaUsers, FaStar, FaHeart } from "react-icons/fa";
import { getDashboardStats } from "../../services/dashboardService";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    movies: 0,
    users: 0,
    reviews: 0,
    favorites: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const result = await getDashboardStats();
        setStats(result);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading Dashboard..." />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Admin 👋</p>
        </div>

        <div className="dashboard-cards">
          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/movies")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon movies">
              <FaFilm />
            </div>
            <div>
              <h3>Total Movies</h3>
              <p>{stats.movies}</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon users">
              <FaUsers />
            </div>
            <div>
              <h3>Total Users</h3>
              <p>{stats.users}</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/reviews")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon reviews">
              <FaStar />
            </div>
            <div>
              <h3>Total Reviews</h3>
              <p>{stats.reviews}</p>
            </div>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/favorites")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon favorites">
              <FaHeart />
            </div>
            <div>
              <h3>Favorites</h3>
              <p>{stats.favorites}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Project Status</h2>
          <div className="status-box">
            <p>✅ Movie System Completed</p>
            <p>✅ Authentication Completed</p>
            <p>✅ Favorites Completed</p>
            <p>🚧 Admin Movie Management In Progress</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
