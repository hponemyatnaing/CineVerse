import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useEffect, useRef } from "react";
import { fadeUp } from "../../utils/animations";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite =
    favorites.some(
      (item) =>
        String(item.movieId) === String(movie.id)
    );

  const cardRef = useRef();


  useEffect(() => {

    fadeUp(cardRef.current);

  }, []);

  const handleFavorite = async (e) => {

    e.stopPropagation();


    console.log(
      "Favorite status:",
      isFavorite
    );


    if (isFavorite) {

      await removeFromFavorites(movie.id);

    } else {

      await addToFavorites(movie);

    }

  };

  return (
    <div
      ref={cardRef}
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} loading="lazy" />

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
        >
          <FaHeart />
        </button>

        <div className="rating-badge">
          <FaStar />
          <span>{Number(movie.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      <div className="movie-content">
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;
