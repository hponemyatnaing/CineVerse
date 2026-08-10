import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const updateMovieRating = async (movieId) => {
  try {
    const q = query(collection(db, "reviews"), where("movieId", "==", movieId));

    const snapshot = await getDocs(q);

    const reviews = snapshot.docs.map((item) => item.data());

    const count = reviews.length;

    const average =
      count > 0
        ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count
        : 0;

    const rounded = Math.round(average * 10) / 10;

    const key = String(movieId);

    await setDoc(doc(db, "movieRatings", key), {
      movieId: key,
      averageRating: rounded,
      ratingCount: count,
      updatedAt: new Date().toISOString(),
    });

    try {
      await updateDoc(doc(db, "movies", key), {
        rating: rounded,
        ratingCount: count,
      });
    } catch {
      // Movie not in the movies collection (e.g. TMDB movie) - skip
    }

    return { success: true, average: rounded, count };
  } catch (error) {
    console.log("Update Movie Rating Error:", error);

    return { success: false };
  }
};

export const addReview = async (review) => {
  try {
    const ref = collection(db, "reviews");

    await addDoc(ref, {
      movieId: review.movieId,

      movieTitle: review.movieTitle || "",

      uid: review.uid,

      userName: review.userName,

      rating: review.rating,

      comment: review.comment,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    });

    await updateMovieRating(review.movieId);

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

export const getMovieReviews = async (movieId) => {
  try {
    const q = query(collection(db, "reviews"), where("movieId", "==", movieId));

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

export const updateReview = async (id, text) => {
  try {
    await updateDoc(doc(db, "reviews", id), {
      comment: text,

      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const deleteReview = async (id, movieId) => {
  try {
    await deleteDoc(doc(db, "reviews", id));

    if (movieId) {
      await updateMovieRating(movieId);
    }

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
