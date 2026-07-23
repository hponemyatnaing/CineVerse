import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// ADD ACTIVITY

export const addActivity = async (userId, data) => {
  await addDoc(
    collection(db, "activities"),

    {
      userId,

      ...data,

      createdAt: new Date(),
    },
  );
};

// GET ACTIVITY

export const getUserActivities = async (userId) => {
  const q = query(
    collection(db, "activities"),

    where("userId", "==", userId),

    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,

    ...doc.data(),
  }));
};
