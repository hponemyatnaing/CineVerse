import "./AdminReviews.css";

import { useEffect, useState } from "react";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "reviews"));

      const data = snapshot.docs.map((item) => ({
        id: item.id,

        ...item.data(),
      }));

      setReviews(data);
    } catch (error) {
      console.log("Load reviews error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(id) {
    const confirmDelete = window.confirm("Delete this review?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reviews", id));

      loadReviews();
    } catch (error) {
      console.log("Delete review error:", error);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading Reviews..." />;
  }

  return (
    <div className="admin-reviews">
      <div className="reviews-header">
        <h1>⭐ Reviews Management</h1>

        <p>Total Reviews : {reviews.length}</p>
      </div>

      <div className="reviews-container">
        {reviews.length === 0 ? (
          <h3>No Reviews Found</h3>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-info">
                <h3>👤 {review.userName || "User"}</h3>

                <p>
                  🎬 Movie:{" "}
                  {review.movieTitle || review.movieId || "Unknown Movie"}
                </p>

                <p>
                  ⭐ Rating: {"⭐".repeat(Number(review.rating))} (
                  {review.rating}/5)
                </p>

                <p>💬 {review.comment}</p>
              </div>

              <div className="review-action">
                <small>
                  📅{" "}
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleString("en-US", {
                        year: "numeric",

                        month: "short",

                        day: "numeric",

                        hour: "2-digit",

                        minute: "2-digit",
                      })
                    : "Unknown date"}
                </small>

                <button onClick={() => deleteReview(review.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
