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


// ==============================
// COLLECTION
// ==============================

const movieCollection = collection(
  db,
  "movies"
);



// ==============================
// GET ALL MOVIES
// ==============================

export const getMovies = async () => {

  try {

    const snapshot = await getDocs(
      movieCollection
    );


    return snapshot.docs.map((item) => ({

      id: item.id,

      ...item.data()

    }));


  } catch (error) {

    console.error(
      "Get movies error:",
      error
    );

    return [];

  }

};





// ==============================
// GET SINGLE MOVIE
// ==============================

export const getMovieById = async (id) => {

  try {


    const movieRef =
      doc(
        db,
        "movies",
        id
      );


    const snapshot =
      await getDoc(movieRef);



    if (!snapshot.exists()) {

      return null;

    }



    return {

      id: snapshot.id,

      ...snapshot.data()

    };


  } catch (error) {


    console.error(
      "Get movie error:",
      error
    );


    return null;

  }

};







// ==============================
// ADD MOVIE
// ==============================

export const addMovie = async (movie) => {


  try {


    const docRef =
      await addDoc(
        movieCollection,
        {

          ...movie,

          views: 0,

          createdAt:
            new Date().toISOString()

        }
      );



    return {

      success: true,

      id: docRef.id

    };


  } catch (error) {


    console.error(
      "Add movie error:",
      error
    );


    return {

      success: false,

      message: error.message

    };


  }


};







// ==============================
// UPDATE MOVIE
// ==============================

export const updateMovie = async (
  id,
  movie
) => {


  try {


    const movieRef =
      doc(
        db,
        "movies",
        id
      );



    await updateDoc(
      movieRef,
      movie
    );



    return {

      success: true

    };



  } catch (error) {


    console.error(
      "Update movie error:",
      error
    );



    return {

      success: false,

      message: error.message

    };


  }


};








// ==============================
// DELETE MOVIE
// ==============================

export const deleteMovie = async (id) => {


  try {


    await deleteDoc(

      doc(
        db,
        "movies",
        id
      )

    );



    return {

      success: true

    };



  } catch (error) {


    console.error(
      "Delete movie error:",
      error
    );



    return {

      success: false,

      message: error.message

    };


  }


};









// ==============================
// INCREASE VIEW COUNT
// ==============================

export const increaseMovieView = async (id) => {


  try {


    const movieRef =
      doc(
        db,
        "movies",
        id
      );



    await updateDoc(
      movieRef,
      {

        views:
          increment(1)

      }

    );



  } catch (error) {


    console.error(
      "Increase view error:",
      error
    );


  }


};










// ==============================
// SAVE WATCH HISTORY
// ==============================

export const saveWatchHistory = (movie) => {


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  if (!user) return;



  const key =
    `history_${user.uid}`;



  const oldHistory =
    JSON.parse(
      localStorage.getItem(key)
    ) || [];



  const newHistory =
    oldHistory.filter(
      (item) =>
        item.id !== movie.id
    );



  newHistory.unshift({

    id: movie.id,

    title: movie.title,


    image:
      movie.image ||
      movie.poster_path ||
      "/default-placeholder.jpg",


    rating:
      movie.rating ||
      movie.vote_average ||
      0,


    watchedAt:
      new Date().toISOString()

  });



  localStorage.setItem(

    key,

    JSON.stringify(
      newHistory.slice(0, 15)
    )

  );


};









// ==============================
// GET WATCH HISTORY
// ==============================

export const getWatchHistory = () => {


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  if (!user)
    return [];



  return (

    JSON.parse(

      localStorage.getItem(
        `history_${user.uid}`
      )

    )

    || []

  );


};










// ==============================
// NETFLIX STYLE TOP 10
// ==============================

export const getTop10Movies = async () => {


  try {


    const movies =
      await getMovies();



    const rankedMovies =
      movies.map(movie => {


        const views =
          Number(
            movie.views || 0
          );



        const rating =
          Number(
            movie.rating || 0
          );



        // Ranking Algorithm
        const score =

          (
            views * 0.7
          )

          +

          (
            rating * 10 * 0.3
          );



        return {


          ...movie,

          score


        };


      });




    return rankedMovies

      .sort(
        (a, b) =>
          b.score - a.score
      )

      .slice(
        0,
        10
      );



  } catch (error) {


    console.error(
      "Top10 loading error:",
      error
    );



    return [];


  }


};