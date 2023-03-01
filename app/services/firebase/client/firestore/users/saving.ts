import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getCollections } from "../utils";
import type { FirestoreUser } from "./types";

export const { usersCol } = getCollections();

async function saveRecipe(recipeId: string, uid: string) {
  setDoc(
    doc(usersCol, uid),
    { savedRecipes: arrayUnion(recipeId) },
    { merge: true }
  );
}

async function unsaveRecipe(recipeId: string, uid: string) {
  setDoc(
    doc(usersCol, uid),
    { savedRecipes: arrayRemove(recipeId) },
    { merge: true }
  );
}

async function getUserSavedRecipes(uid: string) {
  const userSnap = await getDoc(doc(usersCol, uid));
  const userData = (userSnap.data() || {}) as FirestoreUser;
  return userData.savedRecipes || [];
}

export { unsaveRecipe, saveRecipe, getUserSavedRecipes };
export type { FirestoreUser };
