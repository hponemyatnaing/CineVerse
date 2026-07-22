import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  or,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // LocalStorage က user ကိုပါ ထပ်စစ်ပေးရန်
  const rawUser = localStorage.getItem("user");
  const localUser = rawUser ? JSON.parse(rawUser) : null;
  const currentUserId = user?.uid || localUser?.uid || localUser?.id;

  useEffect(() => {
    if (currentUserId) {
      loadFavorites(currentUserId);
    } else {
      setFavorites([]);
    }
  }, [currentUserId]);

  const loadFavorites = async (userId) => {
    try {
      const q = query(
        collection(db, "favorites"),
        or(where("userId", "==", userId), where("uid", "==", userId))
      );
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map((docItem) => ({
        id: docItem.id, // Firestore Document ID
        ...docItem.data(),
      }));
      setFavorites(favs);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const addToFavorites = async (movie) => {
    if (!currentUserId) {
      alert("Please login first!");
      return;
    }

    try {
      const movieId = String(movie.id || movie.movieId);

      // Duplicate ဖြစ်နေတာကို စစ်ဆေးခြင်း
      const exists = favorites.some(
        (item) => String(item.movieId || item.id) === movieId
      );

      if (exists) {
        console.log("Movie already in favorites");
        return;
      }

      const newFavorite = {
        userId: currentUserId,
        uid: currentUserId,
        movieId: movieId,
        title: movie.title,
        image: movie.image || movie.poster_path,
        rating: movie.rating || movie.vote_average,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "favorites"), newFavorite);
      setFavorites((prev) => [...prev, { id: docRef.id, ...newFavorite }]);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = async (identifier) => {
    try {
      console.log("Deleting favorite with identifier:", identifier);

      if (!identifier) {
        console.error("Invalid identifier provided for deletion");
        return;
      }

      // ID သည် Number ဖြစ်နေပါက String သို့ ပြောင်းပေးရန်
      const strIdentifier = String(identifier);

      // favorites state ထဲမှ Firestore document id (သို့မဟုတ်) movieId နှင့် ကိုက်ညီသည်ကို ရှာခြင်း
      const matchedItem = favorites.find(
        (item) => item.id === strIdentifier || String(item.movieId) === strIdentifier
      );

      // အကယ်၍ match တွေ့ပါက ၎င်း၏ Firestore Document ID ကို ယူမည်၊ မတွေ့ပါက ဝင်လာသည့် identifier ကို သုံးမည်
      const targetDocId = matchedItem ? matchedItem.id : strIdentifier;

      // Firestore database မှ မှန်ကန်သော Document ID ဖြင့် ဖျက်ခြင်း
      await deleteDoc(doc(db, "favorites", targetDocId));

      // State ထဲမှလည်း ချက်ချင်း ဖယ်ထုတ်ပေးခြင်း
      setFavorites((prev) =>
        prev.filter(
          (item) => item.id !== targetDocId && String(item.movieId) !== strIdentifier
        )
      );

      console.log("Successfully removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);