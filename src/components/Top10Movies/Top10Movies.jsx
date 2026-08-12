import "./Top10Movies.css";

import MovieCard from "../MovieCard/MovieCard";

function Top10Movies({ movies }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="top10-section">
      <h2>🔥 Top 10 Movies</h2>

      <div className="top10-container">
        {movies.map((movie, index) => (
          <div className="top10-card" key={movie.id}>
            <div className="rank-number">{index + 1}</div>

            <MovieCard
              movie={{
                id: movie.id,

                title: movie.title,

                image:
                  movie.image || movie.poster_path
                    ? movie.image ||
                      `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/default-placeholder.jpg",

                rating: Number(movie.rating) || Number(movie.vote_average) || 0,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Top10Movies;
