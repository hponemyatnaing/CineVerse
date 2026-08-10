import "./Footer.css";

import {
  FaFilm,
  FaHeart,
  FaYoutube,
  FaTelegramPlane,
  FaHome,
  FaVideo,
  FaHeart as FaFavorite,
  FaInfoCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}

        <div className="footer-section">
          <div className="footer-logo">
            <FaFilm />

            <span>MoraView</span>
          </div>

          <p>
            MoraView is a modern Movie Review & Rating website built with
            React.js.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">
            <FaHome />

            <span>Home</span>
          </Link>

          <Link to="/movies">
            <FaVideo />

            <span>Movies</span>
          </Link>

          <Link to="/favorites">
            <FaFavorite />

            <span>Favorites</span>
          </Link>

          <Link to="/about">
            <FaInfoCircle />

            <span>About</span>
          </Link>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className="footer-social">
            <a
              href="http://localhost:5173/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>

            <a
              href="http://localhost:5173/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {year} MoraView • Made with
        <FaHeart className="heart" />
        using React.js
      </div>
    </footer>
  );
}

export default Footer;
