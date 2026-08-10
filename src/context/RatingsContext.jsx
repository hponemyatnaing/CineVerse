import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";

const RatingsContext = createContext();

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});

  const [loading, setLoading] = useState(true);

  const loadRatings = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "movieRatings"));

      const map = {};

      snapshot.docs.forEach((item) => {
        const data = item.data();

        map[String(data.movieId || item.id)] = {
          averageRating: Number(data.averageRating || 0),
          ratingCount: Number(data.ratingCount || 0),
        };
      });

      setRatings(map);
    } catch (error) {
      console.log("Load ratings error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const getRating = useCallback(
    (movieId) => {
      const entry = ratings[String(movieId)];

      if (entry && entry.ratingCount > 0) {
        return entry.averageRating;
      }

      return null;
    },
    [ratings],
  );

  const getRatingCount = useCallback(
    (movieId) => {
      const entry = ratings[String(movieId)];

      return entry ? entry.ratingCount : 0;
    },
    [ratings],
  );

  return (
    <RatingsContext.Provider
      value={{
        ratings,

        loading,

        getRating,

        getRatingCount,

        refresh: loadRatings,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => useContext(RatingsContext);
