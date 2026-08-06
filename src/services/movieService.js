import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { addActivity } from "./activityService";

const movieCollection = collection(db, "movies");

export const getMovies = async () => {
  try {
    const snapshot = await getDocs(movieCollection);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error("Get movies error:", error);

    return [];
  }
};

export const getMovieById = async (id) => {
  try {
    const movieRef = doc(db, "movies", id);

    const snapshot = await getDoc(movieRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Get movie error:", error);

    return null;
  }
};

export const addMovie = async (movie) => {
  try {
    const docRef = await addDoc(movieCollection, {
      title: movie.title,
      image: movie.image,
      genre: movie.genre,
      year: Number(movie.year),
      rating: Number(movie.rating),
      description: movie.description,
      trailerUrl: movie.trailerUrl || "",
      category: movie.category || "latest",
      views: 0,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Add movie error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateMovie = async (id, movie) => {
  try {
    const movieRef = doc(db, "movies", id);

    await updateDoc(movieRef, {
      title: movie.title,
      image: movie.image,
      genre: movie.genre,
      year: Number(movie.year),
      rating: Number(movie.rating),
      description: movie.description,
      trailerUrl: movie.trailerUrl || "",
      category: movie.category || "latest",
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update movie error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteMovie = async (id) => {
  try {
    await deleteDoc(doc(db, "movies", id));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const increaseMovieView = async (id) => {
  try {
    const movieRef = doc(db, "movies", id);

    await updateDoc(movieRef, {
      views: increment(1),
    });
  } catch (error) {
    console.log("View Error:", error);
  }
};

export const saveWatchHistory = async (movie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const key = `history_${user.uid}`;

  const oldHistory = JSON.parse(localStorage.getItem(key)) || [];

  const filtered = oldHistory.filter((item) => item.id !== movie.id);

  filtered.unshift({
    id: movie.id,
    title: movie.title,
    image:
      movie.image ||
      (movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/default-placeholder.jpg"),
    rating: Number(movie.rating || movie.vote_average || 0),
    watchedAt: new Date().toISOString(),
  });

  localStorage.setItem(key, JSON.stringify(filtered.slice(0, 15)));

  try {
    await addActivity(user.uid, {
      title: `🎬 Watched ${movie.title}`,
      type: "watch",
    });
  } catch (err) {
    console.log("Activity Error:", err);
  }
};

export const getWatchHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return [];

  return JSON.parse(localStorage.getItem(`history_${user.uid}`)) || [];
};

export const getTop10Movies = async () => {
  try {
    const movies = await getMovies();

    const ranked = movies.map((movie) => {
      const views = Number(movie.views || 0);

      const rating = Number(movie.rating || 0);

      const score = views * 0.7 + rating * 10 * 0.3;

      return {
        ...movie,
        score,
      };
    });

    return ranked.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (error) {
    console.error("Top10 Error:", error);

    return [];
  }
};

export const getSimilarFirebaseMovies = async (currentMovie) => {
  try {
    const movies = await getMovies();

    const similar = movies
      .filter(
        (movie) =>
          movie.id !== currentMovie.id &&
          movie.genre &&
          currentMovie.genre &&
          movie.genre.toLowerCase() === currentMovie.genre.toLowerCase()
      )
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 8);

    return similar;
  } catch (error) {
    console.error("Similar Movies Error:", error);
    return [];
  }
};