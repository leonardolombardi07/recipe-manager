import type { NextOrObserver, User } from "firebase/auth";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { getServices } from "./app";

const { auth } = getServices();

async function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

async function signOut() {
  return firebaseSignOut(auth);
}

function onAuthStateChanged(nextOrObserver: NextOrObserver<User>) {
  return firebaseOnAuthStateChanged(auth, nextOrObserver);
}

async function updateProfile(info: {
  displayName?: string | null;
  photoURL?: string | null;
}) {
  if (!auth.currentUser) throw new Error("No authenticated user");
  await firebaseUpdateProfile(auth.currentUser, info);
  await auth.currentUser.reload();
  return auth.currentUser;
}

export { updateProfile, signInWithGoogle, signOut, onAuthStateChanged };
