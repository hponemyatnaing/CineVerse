import { collection, addDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const saveFavorite = async (movie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return false;

  try {
    await addDoc(collection(db, "favorites"), {
      id: movie.id,

      title: movie.title,

      image: movie.image,

      rating: movie.rating,

      userId: user.uid,

      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.log("Favorite save error:", error);

    return false;
  }
};
