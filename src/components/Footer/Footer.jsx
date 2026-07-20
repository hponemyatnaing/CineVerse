import "./Footer.css";
import {
  FaFilm,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Logo */}
        <div className="footer-section">

          <div className="footer-logo">
            <FaFilm />
            <span>CineVerse</span>
          </div>

          <p>
            CineVerse is a modern Movie Review & Rating
            website built with React.js.
          </p>

        </div>

        {/* Quick Links */}
        <div className="footer-section">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/movies">Movies</Link>

          <Link to="/favorites">Favorites</Link>

          <Link to="/about">About</Link>

        </div>

        {/* Social */}
        <div className="footer-section">

          <h3>Follow Us</h3>

          <div className="footer-social">

            <a href="#">
              <FaFacebook />
            </a>

            <a href="#">
              <FaGithub />
            </a>

            <a href="#">
              <FaLinkedin />
            </a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © {year} CineVerse • Made with{" "}
        <FaHeart className="heart" /> using React.js

      </div>

    </footer>
  );
}

export default Footer;