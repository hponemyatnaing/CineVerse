import "./ReviewForm.css";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import * as Yup from "yup";

import { addReview } from "../../services/reviewService";
import { addActivity } from "../../services/activityService";
import { useRatings } from "../../context/RatingsContext";

function ReviewForm({ movieId, movieTitle, onReviewAdded }) {
  const { refresh: refreshRatings } = useRatings();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const reviewSchema = Yup.object({
    rating: Yup.number()
      .min(1, "Please select rating")
      .required("Please select rating"),
    comment: Yup.string().trim().required("Write your comment"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await reviewSchema.validate({ rating, comment }, { abortEarly: true });

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
        await addActivity(user.uid, {
          title: `💬 Posted review on ${movieTitle}`,
          type: "review",
        });

        setRating(0);
        setComment("");

        await refreshRatings();

        if (onReviewAdded) {
          onReviewAdded();
        }
      } else {
        alert(result.message || "Failed to post review");
      }
    } catch (error) {
      console.log("Review Error:", error);

      if (error.name === "ValidationError") {
        alert(error.message);
        return;
      }

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
