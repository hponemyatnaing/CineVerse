import "./Profile.css";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { getUserProfile, updateUserProfile, logoutUser } from "../../services/userService";

import { useFavorites } from "../../context/FavoritesContext";

import { collection, getDocs, query, where, or } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import MovieCard from "../../components/MovieCard/MovieCard";

function Profile() {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchedCount, setWatchedCount] = useState(0);

  // Edit Profile နှင့် Photo အတွက် State များ
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
      const data = await getUserProfile(user.uid);
      setProfile(data);
      if (data && data.name) {
        setName(data.name);
      }

      const reviewQuery = query(
        collection(db, "reviews"),
        or(where("userId", "==", user.uid), where("uid", "==", user.uid))
      );
      const reviewSnapshot = await getDocs(reviewQuery);
      const reviewsData = reviewSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);

      try {
        const watchQuery = query(
          collection(db, "watchlist"),
          or(where("userId", "==", user.uid), where("uid", "==", user.uid))
        );
        const watchSnapshot = await getDocs(watchQuery);
        setWatchedCount(watchSnapshot.size);
      } catch (err) {
        setWatchedCount(0);
      }
    } catch (error) {
      console.log("Error loading profile data:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(user.uid, { name });
      setProfile((prev) => ({ ...prev, name }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Image size should be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        setUploading(true);
        await updateUserProfile(user.uid, { photoURL: base64Image });
        setProfile((prev) => ({ ...prev, photoURL: base64Image }));
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.log("Error uploading image:", error);
        alert("Failed to upload image.");
      } finally {
        setUploading(false);
      }
    };
  };

  // Logout လုပ်ရန် function
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login"; // Login စာမျက်နှာသို့ အလိုအလျောက် ပို့ပေးရန် (သို့မဟုတ် navigate သုံးနိုင်ပါသည်)
  };

  if (!profile) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div className="avatar-container">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="avatar-img" />
          ) : (
            <div className="avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <label htmlFor="file-input" className="upload-icon-btn" title="Change Profile Picture">
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
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                required
              />
              <div className="edit-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-name-section">
              <h1>{profile.name}</h1>
              <p>{profile.email}</p>

              <div className="profile-header-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>

                {/* Logout ခလုတ်အသစ် */}
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
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

      {/* My Reviews Section */}
      <section className="profile-section-block">
        <h2>My Reviews</h2>
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-header-info">
                  <span className="review-movie-title">{rev.movieTitle || "Movie Review"}</span>
                  <span className="review-rating">⭐ {rev.rating || "5"} / 5</span>
                </div>
                <p className="review-text">"{rev.comment || rev.reviewText}"</p>
              </div>
            ))
          ) : (
            <p className="empty-text">No reviews written yet.</p>
          )}
        </div>
      </section>

      {/* My Favorite Movies Section */}
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
    </section>
  );
}

export default Profile;