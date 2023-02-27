import type { NextOrObserver, User } from "firebase/auth";
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

export { signInWithGoogle, signOut, onAuthStateChanged };
