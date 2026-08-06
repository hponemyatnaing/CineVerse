import { collection, getCountFromServer, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";

// Dashboard Statistics

export async function getDashboardStats() {
  try {
    const movies = await getCountFromServer(collection(db, "movies"));

    const users = await getCountFromServer(collection(db, "users"));

    const reviews = await getCountFromServer(collection(db, "reviews"));

    const favorites = await getCountFromServer(collection(db, "favorites"));

    return {
      movies: movies.data().count,
      users: users.data().count,
      reviews: reviews.data().count,
      favorites: favorites.data().count,
    };
  } catch (error) {
    console.log(error);

    return {
      movies: 0,
      users: 0,
      reviews: 0,
      favorites: 0,
    };
  }
}

// 🔥 Trending Movies (Most Views)

export async function getTrendingMovies() {
  try {
    const snapshot = await getDocs(collection(db, "movies"));

    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,

      ...doc.data(),
    }));

    return movies
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5);
  } catch (error) {
    console.log("Trending Movies Error:", error);

    return [];
  }
}

// ⭐ Top Rated Movies

export async function getTopRatedMovies() {
  try {
    const snapshot = await getDocs(collection(db, "movies"));

    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,

      ...doc.data(),
    }));

    return movies
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 5);
  } catch (error) {
    console.log("Top Rated Error:", error);

    return [];
  }
}
