import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { createUserProfile } from "./userService";

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (name, email, password) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserProfile({
    uid: credential.user.uid,
    name,
    email,
    role: "user",
  });

  return credential;
};

export const logoutUser = async () => {
  await signOut(auth);
};