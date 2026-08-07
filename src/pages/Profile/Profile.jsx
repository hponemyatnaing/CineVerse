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

import AchievementCard from "../../components/AchievementCard/AchievementCard";

import ActivityTimeline from "../../components/ActivityTimeline/ActivityTimeline";

import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";

import { getUserActivities } from "../../services/activityService";

function Profile() {
  const { user } = useAuth();

  const { favorites } = useFavorites();

  const [profile, setProfile] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [watchedCount, setWatchedCount] = useState(0);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const data = await getUserProfile(user.uid);

      const activityData = await getUserActivities(user.uid);

      setActivities(activityData);

      setProfile(data);

      if (data?.name) {
        setName(data.name);
      }

      const reviewQuery = query(
        collection(db, "reviews"),

        or(
          where("userId", "==", user.uid),

          where("uid", "==", user.uid),
        ),
      );

      const snapshot = await getDocs(reviewQuery);

      const reviewData = snapshot.docs.map((doc) => ({
        id: doc.id,

        ...doc.data(),
      }));

      setReviews(reviewData);

      const history = getWatchHistory();

      setWatchedCount(history.length);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const handleUpdateProfile = async () => {
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

      setShowEdit(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

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

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logoutUser();

    window.location.href = "/login";
  };

  if (!profile) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <section className="profile-page">
      {showEdit && (
        <EditProfileModal
          close={() => setShowEdit(false)}
          name={name}
          setName={setName}
          save={handleUpdateProfile}
        />
      )}

      <div className="profile-header">
        <div className="avatar-container">
          {profile.photoURL ? (
            <img src={profile.photoURL} className="avatar-img" alt="profile" />
          ) : (
            <div className="avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <label htmlFor="upload" className="upload-icon-btn">
            {uploading ? "..." : "📷"}
          </label>

          <input
            id="upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-details">
          <h1>{profile.name}</h1>

          <p>{profile.email}</p>

          <button
            className="edit-profile-btn"
            onClick={() => setShowEdit(true)}
          >
            ✏️ Edit Name
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

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

      <section className="profile-section-block">
        <h2>🏆 Achievements</h2>

        <div className="achievement-grid">
          <AchievementCard
            icon="🎬"
            title="Movie Beginner"
            description="Watched your first movie"
          />

          <AchievementCard
            icon="❤️"
            title="Collector"
            description="Saved favorite movies"
          />

          <AchievementCard
            icon="⭐"
            title="Reviewer"
            description="Write movie reviews"
          />
        </div>
      </section>

      <section className="profile-section-block">
        <h2>🕒 Recent Activity</h2>

        <ActivityTimeline activities={activities} />
      </section>

      <section className="profile-section-block">
        <h2>💬 My Reviews</h2>

        {reviews.length ? (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <h3>🎬 {review.movieTitle || "Movie"}</h3>

              <div className="review-rating">⭐ {review.rating}/5</div>

              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="empty-text">No reviews yet</p>
        )}
      </section>

      <section className="profile-section-block">
        <h2>❤️ Favorite Movies</h2>

        <div className="favorite-grid">
          {favorites.length ? (
            favorites.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            <p className="empty-text">No favorite movies</p>
          )}
        </div>
      </section>

      <section className="profile-section-block">
        <div className="section-title">
          <h2>🎬 Recently Watched</h2>

          <span>{watchedCount} Movies</span>
        </div>

        <UserWatchHistory />
      </section>
    </section>
  );
}

export default Profile;
