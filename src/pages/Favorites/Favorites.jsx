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
        Total Favorites :<strong>{favorites.length}</strong>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>No Favorite Movies</h2>
          <p>Browse movies and click ❤️ button.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie, index) => {
            const uniqueKey = `${movie.id || movie.docId || "fav"}-${movie.movieId || index}-${index}`;

            return <MovieCard key={uniqueKey} movie={movie} />;
          })}
        </div>
      )}
    </section>
  );
}

export default Favorites;
