import "./UserReviews.css";

import { useEffect, useState } from "react";

import { getUserReviews } from "../../services/userService";

function UserReviews({ userId }) {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User ID for Reviews:", userId);

    if (userId) {
      loadReviews();
    }
  }, [userId]);

  async function loadReviews() {
    try {
      const data = await getUserReviews(userId);

      console.log("Reviews From Firebase:", data);

      setReviews(data);
    } catch (error) {
      console.log("Review Loading Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="user-reviews">Loading Reviews...</div>;
  }

  return (
    <div className="user-reviews">
      <h2>⭐ My Reviews</h2>

      {reviews.length === 0 ? (
        <div className="empty-review">No Reviews Yet</div>
      ) : (
        reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <h3>
              Movie ID:
              {review.movieId}
            </h3>

            <div className="rating">{"⭐".repeat(review.rating)}</div>

            <p>{review.comment}</p>

            <small>{review.createdAt}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default UserReviews;
