import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPlay, FaInfoCircle, FaStar } from "react-icons/fa";

import "./Hero.css";

function Hero({ movies = [] }) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!movies.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies]);

  if (!movies.length) {
    return null;
  }

  const movie = movies[index];

  return (
    <section className="hero">
      <div className="hero-wrapper">
        {/* LEFT CONTENT */}

        <div className="hero-info">
          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span>
              <FaStar />
              {Number(movie.rating || 0).toFixed(1)}
            </span>

            <span>HD</span>

            <span>Movie</span>
          </div>

          <p>
            {movie.overview ||
              "Enjoy the latest trending movies and discover amazing stories."}
          </p>

          <div className="hero-buttons">
            <button
              className="watch-btn"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <FaPlay />
              Watch Now
            </button>

            <button
              className="info-btn"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <FaInfoCircle />
              More Info
            </button>
          </div>
        </div>

        {/* POSTER */}

        <div className="poster-card">
          <img src={movie.image} alt={movie.title} />

          <div className="poster-glow"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
