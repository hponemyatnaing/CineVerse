import { useEffect, useState } from "react";

import Hero from "../../components/Hero/Hero";

import MovieSection from "../../components/MovieSection/MovieSection";

import Top10Movies from "../../components/Top10Movies/Top10Movies";

import { getTrendingMovies, getHotMovies } from "../../services/tmdbService";

import { getTop10Ranking } from "../../services/rankingService";

import { getMovies, getWatchHistory } from "../../services/movieService";

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

  const loadMovies = async () => {
    try {
      setLoading(true);

      const top = await getTop10Ranking();

      const trendingData = await getTrendingMovies();

      const hotData = await getHotMovies();

      const adminMovies = await getMovies();

      const watchData = getWatchHistory();

      setTop10(top || []);

      setTrending(trendingData || []);

      setHot(hotData || []);

      setHistory(watchData || []);

      const latestData = (adminMovies || [])

        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        .slice(0, 10);

      setLatest(latestData);
    } catch (error) {
      console.log("Home Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-loading">Loading Movies...</div>;
  }

  return (
    <main className="home-page">
      {/* Hero */}

      <Hero />

      {/* Netflix Top 10 */}

      <Top10Movies movies={top10} />

      {/* Continue Watching */}

      {history.length > 0 && (
        <MovieSection title="▶ Continue Watching" movies={history} />
      )}

      {/* Trending */}

      <MovieSection title="🔥 Trending Movies" movies={trending} />

      {/* Hot Today */}

      <MovieSection title="⚡ Hot Today" movies={hot} />

      {/* Latest */}

      <MovieSection title="🆕 Latest Movies" movies={latest} />
    </main>
  );
}

export default Home;
