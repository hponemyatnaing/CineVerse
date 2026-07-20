import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// ==============================
// ADD REVIEW
// ==============================

export const addReview = async (review) => {
  try {
    const ref = collection(db, "reviews");

    await addDoc(ref, {
      movieId: review.movieId,

      // ✅ NEW
      movieTitle: review.movieTitle || "",

      uid: review.uid,

      userName: review.userName,

      rating: review.rating,

      comment: review.comment,

      createdAt: new Date().toISOString(),

      // ✅ NEW
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log("Add Review Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ==============================
// GET MOVIE REVIEWS
// ==============================

export const getMovieReviews = async (movieId) => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("movieId", "==", movieId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.log(error);

    return [];
  }
};

// ==============================
// UPDATE REVIEW
// ==============================

export const updateReview = async (id, text) => {
  try {
    await updateDoc(
      doc(db, "reviews", id),
      {
        comment: text,

        // ✅ NEW
        updatedAt: new Date().toISOString(),
      }
    );

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

// ==============================
// DELETE REVIEW
// ==============================

export const deleteReview = async (id) => {
  try {
    await deleteDoc(doc(db, "reviews", id));

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
};