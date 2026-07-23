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
