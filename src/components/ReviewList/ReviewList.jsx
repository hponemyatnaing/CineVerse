import "./ReviewList.css";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

import {
  getMovieReviews,
  updateReview,
  deleteReview,
} from "../../services/reviewService";

function ReviewList({ movieId, refresh }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const rawUser = localStorage.getItem("user");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;
  const currentUserId = currentUser?.uid || currentUser?.id;

  useEffect(() => {
    if (movieId) {
      loadReviews();
    }
  }, [movieId, refresh]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getMovieReviews(movieId);
      console.log("Movie Reviews:", data);
      setReviews(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditText(review.comment || review.reviewText || "");
  };

  const handleSave = async (id) => {
    try {
      await updateReview(id, editText);
      setEditingId(null);
      setEditText("");
      loadReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    const result = await deleteReview(id);
    if (result && result.success !== false) {
      loadReviews();
    } else {
      loadReviews();
    }
  };

  if (loading) {
    return <div className="review-empty">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="review-empty">No reviews yet.</div>;
  }

  return (
    <section className="review-list">
      <h2>User Reviews</h2>

      {reviews.map((review, index) => {
        const reviewUserId = review.uid || review.userId;
        const isOwner =
          currentUserId &&
          reviewUserId &&
          String(currentUserId) === String(reviewUserId);

        return (
          <div className="review-card" key={`${review.id}-${index}`}>
            <div className="review-header">
              <h3>{review.userName || review.email || "User"}</h3>

              <span>
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>

            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= review.rating ? "active" : ""}
                />
              ))}
            </div>

            {editingId === review.id ? (
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <p>{review.comment || review.reviewText}</p>
            )}

            {isOwner && (
              <div className="review-actions">
                {editingId === review.id ? (
                  <button onClick={() => handleSave(review.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(review)}>Edit</button>
                )}

                <button
                  className="delete-review-btn"
                  onClick={() => handleDelete(review.id)}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default ReviewList;
