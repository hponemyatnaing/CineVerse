import "./Favorites.css";

import { useFavorites } from "../../context/FavoritesContext";
import MovieCard from "../../components/MovieCard/MovieCard";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ My Favorite Movies</h1>

        <p>Your personal movie collection.</p>
      </div>

      <div className="favorite-count">
        Total Favorites :<strong> {favorites.length}</strong>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>No Favorite Movies</h2>

          <p>Browse movies and click the ❤️ button to add your favorites.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;