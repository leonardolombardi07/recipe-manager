import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { Recipe } from "types";
import { getFirebase } from "../app";
import { RECIPE_COLLECTION_NAME, USERS_COLLECTION_NAME } from "../constants";

const { firestore } = getFirebase();

const recipesCol = collection(firestore, RECIPE_COLLECTION_NAME);

async function createRecipe(form: Recipe) {
  const newDoc = doc(recipesCol);
  setDoc(newDoc, form);
}

async function getOwnRecipes(uid: string) {
  const snap = await getDocs(query(recipesCol, where("author.id", "==", uid)));
  return snap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

async function getSavedRecipes(uid: string) {
  const userSnap = await getDoc(
    doc(firestore, `${USERS_COLLECTION_NAME}/${uid}`)
  );
  const savedRecipes = userSnap.data()?.savedRecipes as string[]; // TODO: type this better
  const recipesSnap = await getDocs(
    query(recipesCol, where("id", "in", savedRecipes))
  );
  return recipesSnap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

export { createRecipe, getOwnRecipes, getSavedRecipes };
