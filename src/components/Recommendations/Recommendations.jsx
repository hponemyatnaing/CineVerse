import { useEffect, useState } from "react";
import { getSimilarMovies } from "../../services/tmdbService";
import MovieCard from "../MovieCard/MovieCard";

function Recommendations({ movieId }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSimilarMovies(movieId);
      setMovies(data.slice(0, 6));
    };

    fetchData();
  }, [movieId]);

  return (
    <div className="recommendation-section">
      <h2>Recommended For You 🎯</h2>

      <div className="grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              rating: movie.vote_average,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
