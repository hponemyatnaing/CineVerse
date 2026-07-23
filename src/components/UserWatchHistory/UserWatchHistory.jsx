import "./UserWatchHistory.css";

import { useEffect, useRef, useState } from "react";

import { getWatchHistory } from "../../services/movieService";

import MovieCard from "../MovieCard/MovieCard";

import { fadeUp } from "../../utils/animations";

function UserWatchHistory() {
  const [history, setHistory] = useState([]);

  const sectionRef = useRef();

  useEffect(() => {
    const data = getWatchHistory();

    setHistory(data);
  }, []);

  useEffect(() => {
    if (history.length) {
      fadeUp(sectionRef.current);
    }
  }, [history]);

  return (
    <section ref={sectionRef} className="watch-history">
      {history.length === 0 ? (
        <div className="empty-watch">
          <h3>🎬</h3>

          <p>No watched movies yet</p>
        </div>
      ) : (
        <div className="watch-grid">
          {history.map((movie) => (
            <MovieCard
              key={movie.id || movie.movieId}
              movie={{
                ...movie,
                id: movie.id || movie.movieId,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UserWatchHistory;
