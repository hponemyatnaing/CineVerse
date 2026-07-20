import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = favorites.some((item) => item.id === movie.id);

  const handleFavorite = (e) => {
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
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
