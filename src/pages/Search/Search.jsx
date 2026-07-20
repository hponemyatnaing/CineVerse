import "./Search.css";

import { useState } from "react";
import { searchMovies } from "../../services/tmdbService";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieSkeleton from "../../components/Skeleton/MovieSkeleton";

function Search() {
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const results = await searchMovies(query);

      setMovies(results || []);

      setSearched(true);
    } catch (err) {
      console.log(err);

      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="search-page">
      <div className="search-header">
        <h1>Search Movies</h1>

        <p>Find your favorite movies.</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {searched && (
        <p className="result-text">Found {movies.length} movie(s)</p>
      )}

      <div className="search-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <MovieSkeleton key={i} />)
          : movies.length > 0
            ? movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,

                    title: movie.title,

                    image: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/default-placeholder.jpg",

                    rating: movie.vote_average,
                  }}
                />
              ))
            : searched && (
                <div className="search-empty">
                  <h2>No Movies Found</h2>

                  <p>Try another keyword.</p>
                </div>
              )}
      </div>
    </section>
  );
}

export default Search;
