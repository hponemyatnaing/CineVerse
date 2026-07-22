import "./Profile.css";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../services/userService";

import { useFavorites } from "../../context/FavoritesContext";

import { collection, getDocs, query, where, or } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import MovieCard from "../../components/MovieCard/MovieCard";

import UserWatchHistory from "../../components/UserWatchHistory/UserWatchHistory";

import { getWatchHistory } from "../../services/movieService";

function Profile() {
  const { user } = useAuth();

  const { favorites } = useFavorites();

  const [profile, setProfile] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [watchedCount, setWatchedCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      // =========================
      // PROFILE
      // =========================

      const data = await getUserProfile(user.uid);

      setProfile(data);

      if (data?.name) {
        setName(data.name);
      }

      // =========================
      // REVIEWS
      // =========================

      const reviewQuery = query(
        collection(db, "reviews"),

        or(
          where("userId", "==", user.uid),

          where("uid", "==", user.uid),
        ),
      );

      const reviewSnapshot = await getDocs(reviewQuery);

      const reviewsData = reviewSnapshot.docs.map((item) => ({
        id: item.id,

        ...item.data(),
      }));

      // =========================
      // GET MOVIE TITLE
      // =========================

      const movieSnapshot = await getDocs(collection(db, "movies"));

      const moviesData = {};

      movieSnapshot.docs.forEach((movie) => {
        moviesData[movie.id] = movie.data().title;
      });

      const updatedReviews = reviewsData.map((review) => ({
        ...review,

        movieTitle:
          review.movieTitle || moviesData[review.movieId] || "Unknown Movie",
      }));

      setReviews(updatedReviews);

      // =========================
      // WATCH HISTORY
      // =========================

      const history = getWatchHistory();

      setWatchedCount(history.length);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateUserProfile(
        user.uid,

        {
          name,
        },
      );

      setProfile((prev) => ({
        ...prev,

        name,
      }));

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const image = reader.result;

      try {
        setUploading(true);

        await updateUserProfile(
          user.uid,

          {
            photoURL: image,
          },
        );

        setProfile((prev) => ({
          ...prev,

          photoURL: image,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    };
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logoutUser();

    window.location.href = "/login";
  };

  if (!profile) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <section className="profile-page">
      {/* PROFILE HEADER */}

      <div className="profile-header">
        <div className="avatar-container">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="profile" className="avatar-img" />
          ) : (
            <div className="avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <label htmlFor="file-input" className="upload-icon-btn">
            {uploading ? "..." : "📷"}
          </label>

          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-details">
          <h1>{profile.name}</h1>

          <p>{profile.email}</p>

          <button
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="profile-stats">
        <div className="stat-card">
          <h2>{favorites.length}</h2>

          <p>❤️ Favorites</p>
        </div>

        <div className="stat-card">
          <h2>{reviews.length}</h2>

          <p>💬 Reviews</p>
        </div>

        <div className="stat-card">
          <h2>{watchedCount}</h2>

          <p>🎬 Watched</p>
        </div>
      </div>

      {/* REVIEWS */}

      <section className="profile-section-block">
        <h2>My Reviews</h2>

        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div className="review-card" key={rev.id}>
              <h3>🎬 {rev.movieTitle}</h3>

              <div className="review-rating">⭐ Rating: {rev.rating}/5</div>

              <p>💬 {rev.comment}</p>

              <small>
                📅
                {rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString()
                  : "No Date"}
              </small>
            </div>
          ))
        ) : (
          <p className="empty-text">No reviews yet</p>
        )}
      </section>

      {/* FAVORITES */}

      <section className="profile-section-block">
        <h2>My Favorite Movies</h2>

        <div className="favorite-grid">
          {favorites.length > 0 ? (
            favorites.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} />
            ))
          ) : (
            <p className="empty-text">No favorite movies yet</p>
          )}
        </div>
      </section>

      {/* WATCH HISTORY */}

      <section className="profile-section-block">

        <div className="section-title">

          <h2>🎬 Recently Watched</h2>

          <span>

            {watchedCount} Movies

          </span>

        </div>

        <UserWatchHistory />

      </section>
    </section>
  );
}

export default Profile;
