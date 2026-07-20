import { useEffect, useState, useCallback } from "react"; // useCallback ကို ထည့်သွင်းပေးပါ
import { getTrendingMovies } from "../../services/tmdbService";
import MovieCard from "../MovieCard/MovieCard";
import MovieSkeleton from "../Skeleton/MovieSkeleton";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./MovieGrid.css";

function MovieGrid() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // fetchMovies ကို useCallback သုံးပြီး ဆောက်ပေးလိုက်ပါ
  // ဒါမှ ErrorMessage component ထဲက onRetry မှာ ဒီ function ကို ပြန်သုံးလို့ရမှာပါ
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTrendingMovies();
      const results = Array.isArray(data) ? data : data?.results || [];
      setMovies(results);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Unable to load movies. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []); // dependencies အလွတ်ထားပါ

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); // fetchMovies ပြောင်းလဲတိုင်း useEffect ပြန်အလုပ်လုပ်ပါမယ်

  // Search Filter
  const filteredMovies = movies.filter((movie) =>
    (movie.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="movie-grid container">
      <h2 className="section-title">Trending Movies 🔥</h2>

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="grid">
        {loading ? (
          Array(6).fill().map((_, i) => <MovieSkeleton key={i} />)
        ) : error ? (
          <ErrorMessage
            title="Movie Loading Failed"
            message={error}
            onRetry={fetchMovies} // အခု အဆင်ပြေသွားပါပြီ
          />
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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
        ) : (
          <ErrorMessage
            title="No Movies Found"
            message="Try another search keyword."
          />
        )}
      </div>
    </section>
  );
}

export default MovieGrid;