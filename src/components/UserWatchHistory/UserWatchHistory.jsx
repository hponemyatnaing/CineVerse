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
    if (history.length > 0) {
      fadeUp(sectionRef.current);
    }
  }, [history]);

  return (
    <section ref={sectionRef} className="watch-history">
      <h2>🎬 Recently Watched</h2>

      {history.length === 0 ? (
        <p>No watched movies yet</p>
      ) : (
        <div className="watch-grid">
          {history.map((movie) => (
            <div className="watch-card" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserWatchHistory;
