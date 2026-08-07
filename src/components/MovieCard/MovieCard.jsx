import { FaStar, FaHeart } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { useFavorites } from "../../context/FavoritesContext";

import { useRatings } from "../../context/RatingsContext";

import { useEffect, useRef, useState } from "react";

import { fadeUp } from "../../utils/animations";

import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const { getRating } = useRatings();

  const [loading, setLoading] = useState(false);

  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      fadeUp(cardRef.current);
    }
  }, []);

  // Firebase + API support

  const movieId = String(movie.movieId || movie.id);

  const favoriteItem = favorites.find(
    (item) => String(item.movieId) === movieId,
  );

  const isFavorite = Boolean(favoriteItem);

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);

      if (isFavorite) {
        await removeFromFavorites(movieId);
      } else {
        await addToFavorites({
          ...movie,

          movieId: movieId,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = () => {
    navigate(`/movie/${movieId}`);
  };

  const movieImage =
    movie.image ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/default-placeholder.jpg");

  const userRating = getRating(movieId);

  const movieRating =
    userRating !== null ? userRating : movie.rating || movie.vote_average || 0;

  return (
    <div ref={cardRef} className="movie-card" onClick={handleMovieClick}>
      <div className="movie-image">
        <img src={movieImage} alt={movie.title} loading="lazy" />

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
          disabled={loading}
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
