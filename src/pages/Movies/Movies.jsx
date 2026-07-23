import { useEffect, useMemo, useState, useRef } from "react";

import { useSearchParams } from "react-router-dom";

import "./Movies.css";

import MovieCard from "../../components/MovieCard/MovieCard";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import { getTrendingMovies, getHotMovies } from "../../services/tmdbService";

import { getMovies } from "../../services/movieService";

import { fadeUp } from "../../utils/animations";

function Movies() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("default");

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const gridRef = useRef();

  useEffect(() => {
    if (!loading && gridRef.current) {
      fadeUp(gridRef.current);
    }
  }, [loading]);

  useEffect(() => {
    loadMovies();
  }, [category]);

  async function loadMovies() {
    try {
      setLoading(true);

      setError("");

      const firebaseMovies = await getMovies();

      let results = [];

      if (category === "latest") {
        results = firebaseMovies

          .filter((movie) => movie.category === "latest")

          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (category === "trending") {
        const tmdb = await getTrendingMovies();

        const adminTrending = firebaseMovies.filter(
          (movie) => movie.category === "trending",
        );

        results = [...adminTrending, ...tmdb];
      } else if (category === "hot") {
        const tmdb = await getHotMovies();

        const adminHot = firebaseMovies.filter(
          (movie) => movie.category === "hot",
        );

        results = [...adminHot, ...tmdb];
      } else {
        results = firebaseMovies;
      }

      if (results.length === 0) {
        setMovies([]);

        setError("No movies found.");

        return;
      }

      setMovies(results);
    } catch (error) {
      console.log("Movies Error:", error);

      setMovies([]);

      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = useMemo(() => {
    let data = [...movies];

    data = data.filter((movie) =>
      movie.title

        ?.toLowerCase()

        .includes(search.toLowerCase()),
    );

    switch (sort) {
      case "rating":
        data.sort(
          (a, b) =>
            (b.rating || b.vote_average || 0) -
            (a.rating || a.vote_average || 0),
        );

        break;

      case "az":
        data.sort((a, b) => a.title.localeCompare(b.title));

        break;

      default:
        break;
    }

    return data;
  }, [movies, search, sort]);

  if (loading) {
    return <LoadingSpinner text="Loading Movies..." />;
  }

  return (
    <section className="movies-page">
      <div className="movies-header">
        <h1>{category ? category.toUpperCase() : "Browse Movies"}</h1>

        <p>Discover movies from around the world.</p>
      </div>

      <div className="movies-toolbar">
        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="movie-result">
          Showing <strong>{filteredMovies.length}</strong>
          Movies
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Default</option>

          <option value="rating">Highest Rating</option>

          <option value="az">A-Z</option>
        </select>
      </div>

      <div ref={gridRef} className="movies-grid">
        {error ? (
          <div className="movie-error">
            <h2>{error}</h2>

            <button onClick={loadMovies}>Retry</button>
          </div>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="empty-state">
            <h1>🎬</h1>

            <h2>No Movies Found</h2>

            <p>Try another search keyword.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Movies;
