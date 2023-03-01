import {
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { Recipe } from "types";
import { getUserRatedRecipes, getUserSavedRecipes } from "../users";
import { TRENDING_RECIPES } from "../data";
import { getCollections } from "../utils";

export const { recipesCol } = getCollections();

async function createRecipe(form: Recipe) {
  const newDoc = doc(recipesCol);
  setDoc(newDoc, {
    ...form,
    rating: { average: 0, count: 0 },
  });
  return newDoc.id;
}

async function editRecipe(id: string, form: Partial<Recipe>) {
  setDoc(doc(recipesCol, id), form, {
    merge: true,
  });
}

async function getFeedRecipes(uid: string | null) {
  const feedQuery = uid
    ? query(recipesCol, where("author.id", "not-in", [uid, "admin"]))
    : query(recipesCol, where("author.id", "!=", "admin"));
  const snap = await getDocs(feedQuery);
  const recipes = snap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
  if (!uid) return recipes.map((r) => ({ ...r, saved: false }));

  const userSavedRecipes = await getUserSavedRecipes(uid);
  return recipes.map((r) => ({ ...r, saved: userSavedRecipes.includes(r.id) }));
}

async function getOwnRecipes(uid: string) {
  const snap = await getDocs(query(recipesCol, where("author.id", "==", uid)));
  return snap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

async function getSavedRecipes(uid: string) {
  const savedRecipes = await getUserSavedRecipes(uid);
  if (savedRecipes.length === 0) return [];

  const recipesSnap = await getDocs(
    query(recipesCol, where(documentId(), "in", savedRecipes))
  );
  return recipesSnap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

async function getRecipeWithUserInfo(recipeId: string, uid: string) {
  const ratedRecipes = await getUserRatedRecipes(uid);
  if (!ratedRecipes) return [];

  const recipe = await getRecipe(recipeId);
  const foundRatedRecipe = ratedRecipes.find((rated) => rated.id === recipeId);
  return {
    ...recipe,
    userRating: foundRatedRecipe?.rating || null,
  };
}

async function getRecipe(id: string) {
  const recipeSnap = await getDoc(doc(recipesCol, id));
  if (!recipeSnap.exists())
    throw new Error(`Recipe with id ${id} doesn't exist`);
  return { ...recipeSnap.data(), id };
}

async function deleteRecipe(id: string) {
  return deleteDoc(doc(recipesCol, id));
}

async function getTrendingRecipes(uid: string) {
  const userSavedRecipes = (await getUserSavedRecipes(uid)) || [];

  // Create on database if they don't exist!
  for (const RECIPE of TRENDING_RECIPES) {
    try {
      await getRecipe(RECIPE.id);
    } catch (error: any) {
      if (error.message === `Recipe with id ${RECIPE.id} doesn't exist`) {
        const newDoc = doc(recipesCol, RECIPE.id);
        setDoc(newDoc, RECIPE);
      } else {
        throw error;
      }
    }
  }

  return TRENDING_RECIPES.map((RECIPE) => ({
    ...RECIPE,
    saved: userSavedRecipes.includes(RECIPE.id),
  }));
}

export {
  getFeedRecipes,
  getRecipe,
  createRecipe,
  getOwnRecipes,
  getSavedRecipes,
  deleteRecipe,
  editRecipe,
  getTrendingRecipes,
  getRecipeWithUserInfo,
};
