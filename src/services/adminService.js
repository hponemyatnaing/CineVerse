import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase";



// =====================
// GET MOVIE COUNT
// =====================

export const getMovieCount = async()=>{

    const snapshot =
    await getDocs(
        collection(db,"movies")
    );


    return snapshot.size;

};




// =====================
// GET USER COUNT
// =====================

export const getUserCount = async()=>{


    const snapshot =
    await getDocs(
        collection(db,"users")
    );


    return snapshot.size;

};




// =====================
// GET REVIEW COUNT
// =====================

export const getReviewCount = async()=>{


    const snapshot =
    await getDocs(
        collection(db,"reviews")
    );


    return snapshot.size;

};