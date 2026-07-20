import "./NotFound.css";
import { Link } from "react-router-dom";
import { FaFilm } from "react-icons/fa";

function NotFound() {
  return (
    <section className="notfound-page">
      <div className="notfound-card">
        <FaFilm className="notfound-icon" />

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>Sorry, the page you're looking for doesn't exist.</p>

        <Link to="/" className="home-btn">
          Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
