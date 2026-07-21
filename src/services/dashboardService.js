import { collection, getCountFromServer } from "firebase/firestore";

import { db } from "../firebase/firebase";

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
