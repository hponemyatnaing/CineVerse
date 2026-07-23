import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const createUserProfile = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: new Date().toISOString(),
  });
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

export const updateUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.log("Update profile error:", error);
    return false;
  }
};

export const getUserReviews = async (uid) => {
  const reviewRef = collection(db, "reviews");
  const q = query(reviewRef, where("uid", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getUserFavorites = async (uid) => {
  const favRef = collection(db, "favorites");
  const q = query(favRef, where("userId", "==", uid));
  const snapshot = await getDocs(q);

  const favorites = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return favorites;
};

export const getUserStats = async (uid) => {
  const reviews = await getUserReviews(uid);
  const favorites = await getUserFavorites(uid);

  return {
    reviewsCount: reviews.length,
    favoritesCount: favorites.length,
  };
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
