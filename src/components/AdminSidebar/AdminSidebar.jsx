import "./AdminSidebar.css";

import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaFilm,
  FaUsers,
  FaStar,
  FaHeart,
  FaPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import { logoutUser } from "../../services/authService";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="admin-sidebar">
      <NavLink to="/" className="admin-logo">
        <FaFilm />
        <span>MoraView</span>
      </NavLink>

      <nav>
        <NavLink to="/admin" end>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/movies">
          <FaFilm />
          <span>Movies</span>
        </NavLink>

        <NavLink to="/admin/add-movie">
          <FaPlus />
          <span>Add Movie</span>
        </NavLink>

        <NavLink to="/admin/users">
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/reviews">
          <FaStar />
          <span>Reviews</span>
        </NavLink>

        <NavLink to="/admin/favorites">
          <FaHeart />
          <span>Favorites</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <NavLink to="/profile">
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <button onClick={handleLogout} className="admin-logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
