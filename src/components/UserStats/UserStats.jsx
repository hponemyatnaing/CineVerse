import "./UserStats.css";

import { useEffect, useState } from "react";

import { getUserReviews } from "../../services/userService";

function UserStats({ user }) {
  const [stats, setStats] = useState({
    reviewsCount: 0,

    favoritesCount: 0,

    watchedCount: 0,
  });

  useEffect(() => {
    if (user?.uid) {
      loadStats();
    }
  }, [user]);

  async function loadStats() {
    // Reviews Count

    const reviews = await getUserReviews(user.uid);

    // Favorites Count from localStorage

    const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);

    const savedHistory = localStorage.getItem(`history_${user.uid}`);

    const watched = savedHistory ? JSON.parse(savedHistory) : [];

    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    setStats({
      reviewsCount: reviews.length,

      favoritesCount: favorites.length,

      watchedCount: watched.length,
    });
  }
  async function loadStats() {
    const reviews = await getUserReviews(user.uid);

    const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);

    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    const savedHistory = localStorage.getItem(`history_${user.uid}`);

    const watched = savedHistory ? JSON.parse(savedHistory) : [];

    setStats({
      reviewsCount: reviews.length,

      favoritesCount: favorites.length,

      watchedCount: watched.length,
    });
  }

  return (
    <div className="user-stats">
      <div className="stat-card">
        <h3>⭐</h3>

        <p>Reviews</p>

        <span>{stats.reviewsCount}</span>
      </div>

      <div className="stat-card">
        <h3>❤️</h3>

        <p>Favorites</p>

        <span>{stats.favoritesCount}</span>
      </div>

      <div className="stat-card">
        <h3>🎬</h3>

        <p>Watched</p>

        <span>{stats.watchedCount}</span>
      </div>
    </div>
  );
}

export default UserStats;
