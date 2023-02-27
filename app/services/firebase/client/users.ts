import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getServices } from "./app";
import { COLLECTION } from "../constants";

interface FirestoreUser {
  savedRecipes: string[];
}

const { firestore } = getServices();

async function saveRecipe(recipeId: string, uid: string) {
  const userDoc = doc(firestore, `${COLLECTION.USERS}/${uid}`);
  setDoc(userDoc, { savedRecipes: arrayUnion(recipeId) }, { merge: true });
}

async function unSaveRecipe(recipeId: string, uid: string) {
  const userDoc = doc(firestore, `${COLLECTION.USERS}/${uid}`);
  setDoc(userDoc, { savedRecipes: arrayRemove(recipeId) }, { merge: true });
}

async function getUserSavedRecipes(uid: string) {
  const userDoc = doc(firestore, `${COLLECTION.USERS}/${uid}`);
  const userSnap = await getDoc(userDoc);
  const userData = (userSnap.data() || {}) as FirestoreUser;
  return userData.savedRecipes || [];
}

export { unSaveRecipe, saveRecipe, getUserSavedRecipes };
export type { FirestoreUser };
