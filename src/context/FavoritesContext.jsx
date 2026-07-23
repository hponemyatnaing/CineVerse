import { createContext, useContext, useState, useEffect } from "react";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const { user } = useAuth();

  // ==========================
  // CURRENT USER
  // ==========================

  const rawUser = localStorage.getItem("user");

  const localUser = rawUser ? JSON.parse(rawUser) : null;

  const currentUserId = user?.uid || localUser?.uid || localUser?.id;

  // ==========================
  // LOAD FAVORITES
  // ==========================

  useEffect(() => {
    if (currentUserId) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [currentUserId]);

  const loadFavorites = async () => {
    try {
      const q = query(
        collection(db, "favorites"),

        where("userId", "==", currentUserId),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => {
        const movie = item.data();

        return {
          id: item.id,

          movieId: String(movie.movieId || movie.id),

          ...movie,
        };
      });

      setFavorites(data);
    } catch (error) {
      console.log("Load favorite error:", error);
    }
  };

  // ==========================
  // ADD FAVORITE
  // ==========================

  const addToFavorites = async (movie) => {
    if (!currentUserId) {
      alert("Please login first!");

      return;
    }

    try {
      const movieId = String(movie.movieId || movie.id);

      const exists = favorites.some((item) => String(item.movieId) === movieId);

      if (exists) {
        console.log("Already favorite");

        return;
      }

      const newFavorite = {
        userId: currentUserId,

        uid: currentUserId,

        movieId: movieId,

        title: movie.title,

        image: movie.image || movie.poster_path || "",

        rating: movie.rating || movie.vote_average || 0,

        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, "favorites"),

        newFavorite,
      );

      setFavorites((prev) => [
        ...prev,

        {
          id: docRef.id,

          ...newFavorite,
        },
      ]);
    } catch (error) {
      console.log("Add favorite error:", error);
    }
  };

  // ==========================
  // REMOVE FAVORITE
  // ==========================

  const removeFromFavorites = async (movieId) => {
    try {
      const favorite = favorites.find(
        (item) => String(item.movieId) === String(movieId),
      );

      if (!favorite) {
        console.log("Favorite not found");

        return;
      }

      await deleteDoc(
        doc(
          db,

          "favorites",

          favorite.id,
        ),
      );

      setFavorites((prev) => prev.filter((item) => item.id !== favorite.id));
    } catch (error) {
      console.log("Remove favorite error:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,

        addToFavorites,

        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
