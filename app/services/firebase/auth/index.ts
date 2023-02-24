import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebase } from "../app";

const { auth } = getFirebase();

function signInWithGoogle() {
  signInWithRedirect(auth, new GoogleAuthProvider());
}

function signOut() {
  firebaseSignOut(auth);
}

export { signInWithGoogle, signOut };
