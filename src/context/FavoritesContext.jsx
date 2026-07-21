import { createContext, useContext, useState, useEffect } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/firebase";

import { addFavorite, removeFavorite } from "../services/favoriteService";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, []);

  const loadFavorites = async () => {
    try {
      if (!user) return;

      const q = query(
        collection(db, "favorites"),

        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,

        ...doc.data(),
      }));

      setFavorites(data);
    } catch (error) {
      console.log("Load favorite error:", error);
    }
  };

  const addToFavorites = async (movie) => {
    try {
      if (!user) {
        alert("Please login first");

        return;
      }

      const exists = favorites.some(
        (item) => String(item.movieId) === String(movie.id),
      );

      if (exists) {
        return;
      }

      await addFavorite(movie, user.uid);

      await loadFavorites();
    } catch (error) {
      console.log("Add favorite error:", error);
    }
  };

  const removeFromFavorites = async (movieId) => {

    try {

      const item = favorites.find(
        (movie) =>
          String(movie.movieId) === String(movieId)
      );


      console.log("Delete item:", item);


      if (!item) {
        console.log("Favorite not found");
        return;
      }


      await removeFavorite(item.id);


      // Firebase ပြန်ဖတ်
      await loadFavorites();


    } catch (error) {

      console.log(
        "Remove favorite error:",
        error
      );

    }

  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,

        addToFavorites,

        removeFromFavorites,

        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
