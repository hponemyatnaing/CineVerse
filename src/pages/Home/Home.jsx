import { useEffect, useState } from "react";

import Hero from "../../components/Hero/Hero";

import MovieSection from "../../components/MovieSection/MovieSection";

import Top10Movies from "../../components/Top10Movies/Top10Movies";

import { getTrendingMovies, getHotMovies } from "../../services/tmdbService";

import { getMovies, getWatchHistory } from "../../services/movieService";

import { getTop10Ranking } from "../../services/rankingService";

import "./Home.css";

function Home() {
  const [trending, setTrending] = useState([]);

  const [hot, setHot] = useState([]);

  const [latest, setLatest] = useState([]);

  const [history, setHistory] = useState([]);

  const [top10, setTop10] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoading(true);

      const [topData, trendingData, hotData, firebaseMovies] =
        await Promise.all([
          getTop10Ranking(),

          getTrendingMovies(),

          getHotMovies(),

          getMovies(),
        ]);

      setTop10(topData || []);

      setTrending(trendingData || []);

      setHot(hotData || []);

      const latestMovies = (firebaseMovies || [])

        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        .slice(0, 10);

      setLatest(latestMovies);

      const watched = getWatchHistory();

      setHistory(watched || []);
    } catch (error) {
      console.log("Home Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading Movies...</div>;
  }

  return (
    <main>

      <Hero movies={trending} />

      <Top10Movies movies={top10} />

      {history.length > 0 && (
        <MovieSection title="▶ Continue Watching" movies={history} />
      )}

      <MovieSection
        title="🔥 Trending Movies"
        movies={trending}
        category="trending"
      />

      <MovieSection title="⚡ Hot Today" movies={hot} category="hot" />

      <MovieSection
        title="🆕 Latest Movies"
        movies={latest}
        category="latest"
      />
    </main>
  );
}

export default Home;
