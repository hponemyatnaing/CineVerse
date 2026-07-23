import "./ReviewForm.css";

import { useState } from "react";

import { FaStar } from "react-icons/fa";

import { addReview } from "../../services/reviewService";

import { addActivity } from "../../services/activityService";

function ReviewForm({
  movieId,
  movieTitle,
  onReviewAdded,
}) {
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");

      return;
    }

    if (rating === 0) {
      alert("Please select rating");

      return;
    }

    if (!comment.trim()) {
      alert("Write your comment");

      return;
    }

    try {
      setLoading(true);

      const result = await addReview({
        movieId,
        movieTitle,
        uid: user.uid,
        userName: user.displayName || user.name || user.email || "User",
        rating,
        comment,
      });

      if (result.success) {
        // Activity မှတ်တမ်းထည့်ခြင်း
        await addActivity(user.uid, {
          title: `💬 Posted review on ${movieTitle}`,
          type: "review",
        });

        setRating(0);

        setComment("");

        if (onReviewAdded) {
          onReviewAdded();
        }
      } else {
        alert(result.message || "Failed to post review");
      }
    } catch (error) {
      console.log("Review Error:", error);
      alert("An error occurred while posting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>

      <div className="rating-box">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? "star active" : "star"}
          />
        ))}
      </div>

      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}

export default ReviewForm;