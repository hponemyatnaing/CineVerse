import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const addFavorite = async (movie, userId) => {
  await addDoc(collection(db, "favorites"), {
    userId: userId,

    movieId: String(movie.id),

    title: movie.title,

    image: movie.image,

    rating: Number(movie.rating || 0),

    createdAt: new Date(),
  });
};

export const removeFavorite = async (id) => {
  await deleteDoc(doc(db, "favorites", id));
};
