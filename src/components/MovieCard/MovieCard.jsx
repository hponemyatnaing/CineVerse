import { FaStar, FaHeart } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { useFavorites } from "../../context/FavoritesContext";

import { useEffect, useRef } from "react";

import { fadeUp } from "../../utils/animations";

import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      fadeUp(cardRef.current);
    }
  }, []);

  const isFavorite = favorites.some(
    (item) => String(item.movieId) === String(movie.id),
  );

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (isFavorite) {
      await removeFromFavorites(movie.id);
    } else {
      await addToFavorites(movie);
    }
  };

  // ==========================
  // IMAGE SUPPORT
  // ==========================

  const movieImage =
    movie.image ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/default-placeholder.jpg");

  // ==========================
  // RATING SUPPORT
  // ==========================

  const movieRating = movie.rating || movie.vote_average || 0;

  return (
    <div
      ref={cardRef}
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-image">
        <img src={movieImage} alt={movie.title} loading="lazy" />

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
        >
          <FaHeart />
        </button>

        <div className="rating-badge">
          <FaStar />

          <span>{Number(movieRating).toFixed(1)}</span>
        </div>
      </div>

      <div className="movie-content">
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;
