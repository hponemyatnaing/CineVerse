import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import { FaFilm, FaUsers, FaStar, FaHeart } from "react-icons/fa";

import MovieCard from "../../components/MovieCard/MovieCard";

import {
  getDashboardStats,
  getTrendingMovies,
  getTopRatedMovies,
} from "../../services/dashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    movies: 0,
    users: 0,
    reviews: 0,
    favorites: 0,
  });

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const result = await getDashboardStats();

        setStats(result);

        const trending = await getTrendingMovies();

        setTrendingMovies(trending);

        const rated = await getTopRatedMovies();

        setTopRatedMovies(rated);
      } catch (error) {
        console.log("Dashboard Error:", error);
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
    <>
      <div className="dashboard-header">
          <h1>Admin Dashboard</h1>

          <p>Welcome back, Admin 👋</p>
        </div>

        {/* Statistics Cards */}

        <div className="dashboard-cards">
          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/movies")}
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

        {/* Trending Movies */}

        <div className="dashboard-section">
          <h2>🔥 Trending Movies</h2>

          <div className="movie-row">
            {trendingMovies.length > 0 ? (
              trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p>No Trending Movies</p>
            )}
          </div>
        </div>

        {/* Top Rated Movies */}

        <div className="dashboard-section">
          <h2>⭐ Top Rated Movies</h2>

          <div className="movie-row">
            {topRatedMovies.length > 0 ? (
              topRatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p>No Rated Movies</p>
            )}
          </div>
        </div>

        {/* Project Status */}

        <div className="dashboard-section">
          <h2>Project Status</h2>

          <div className="status-box">
            <p>✅ Movie System Completed</p>

            <p>✅ Authentication Completed</p>

            <p>✅ Favorites Completed</p>

            <p>✅ Admin Movie Management Completed</p>
          </div>
        </div>
    </>
  );
}

export default AdminDashboard;