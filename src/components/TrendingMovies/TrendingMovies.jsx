import "./Top10Movies.css";

import { useNavigate } from "react-router-dom";

function Top10Movies({ movies }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="top10-section">
      <h2>🔥 Top 10 Today</h2>

      <div className="top10-container">
        {movies.map((movie, index) => (
          <div
            className="top10-card"
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >

            <div className="rank-number">{index + 1}</div>

            <img
              src={
                movie.image || movie.poster_path
                  ? movie.image ||
                    `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/default-placeholder.jpg"
              }
              alt={movie.title}
            />

            <div className="top10-info">
              <h3>{movie.title}</h3>

              <p>⭐{movie.rating || movie.vote_average || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Top10Movies;
