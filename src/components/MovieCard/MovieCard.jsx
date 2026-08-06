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

  // Use movie id for both Firebase and API movies
  const movieId = String(movie.id);

  const favoriteItem = favorites.find(
    (item) => String(item.movieId) === movieId,
  );

  const isFavorite = Boolean(favoriteItem);

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (isFavorite) {
      await removeFromFavorites(movieId);
    } else {
      await addToFavorites({
        ...movie,

        movieId: movieId,
      });
    }
  };

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const movieImage =
    movie.image ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/default-placeholder.jpg");

  const movieRating = movie.rating || movie.vote_average || 0;

  return (
    <div ref={cardRef} className="movie-card" onClick={handleMovieClick}>
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
