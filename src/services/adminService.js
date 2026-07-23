import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const getMovieCount = async () => {
  const snapshot = await getDocs(collection(db, "movies"));

  return snapshot.size;
};

export const getUserCount = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.size;
};

export const getReviewCount = async () => {
  const snapshot = await getDocs(collection(db, "reviews"));

  return snapshot.size;
};
