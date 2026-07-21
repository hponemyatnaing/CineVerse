import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaFilm, FaHeart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import {
  useAuth
} from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";
import { ThemeContext } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    user: authUser
  } = useAuth();

  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { favorites } = useFavorites();

  const user = JSON.parse(localStorage.getItem("user")) || authUser;

  const closeMenu = () => setOpen(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?query=${search}`);
      setSearch("");
      closeMenu();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("user");

      closeMenu();

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}

        <NavLink to="/" className="logo" onClick={closeMenu}>
          <FaFilm />
          <span>CineVerse</span>
        </NavLink>

        <div className="nav-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className={open ? "nav-links active" : "nav-links"}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/movies" onClick={closeMenu}>
            Movies
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/favorites" onClick={closeMenu}>
            <FaHeart />
            Favorites ({favorites.length})
          </NavLink>

          {user && (
            <NavLink to="/profile" onClick={closeMenu}>
              Profile
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink to="/register" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user && (
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          )}

          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          <button className="menu-btn" onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;