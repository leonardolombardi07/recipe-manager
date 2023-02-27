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
import { getServices } from "./app";
import { COLLECTION } from "../constants";
import { getUserSavedRecipes } from "./users";
import { createTypedCollection } from "../utils";

const { firestore } = getServices();

const recipesCol = createTypedCollection<Recipe>(firestore, "recipes");

async function createRecipe(form: Recipe) {
  const { prepTime, cookTime, extraTime } = form.timings;

  const validRecipe: Recipe = {
    title: form.title || "",
    description: form.description || "",
    image: { url: form.image.url || "" },
    timings: {
      prepTime: { hours: prepTime.hours || 0, minutes: prepTime.minutes || 0 },
      cookTime: { hours: cookTime.hours || 0, minutes: cookTime.minutes || 0 },
      extraTime: extraTime || "",
    },
    difficulty: form.difficulty || "easy",
    ingredients: form.ingredients || [],
    steps: form.steps || [],
    servings: {
      type: form.servings.type || "serves",
      value: form.servings.value || "",
    },
    rating: {
      count: 0,
      average: 0,
    },
    author: {
      id: form.author.id || "anonymous", // generate random id?
      name: form.author.name || "Anonymous",
    },
  };

  const newDoc = doc(recipesCol);
  setDoc(newDoc, validRecipe);
  return newDoc.id;
}

async function editRecipe(id: string, form: Partial<Recipe>) {
  setDoc(doc(firestore, `${COLLECTION.RECIPES}/${id}`), form, {
    merge: true,
  });
}

async function getFeedRecipes(uid: string | null) {
  const feedQuery = uid
    ? query(recipesCol, where("author.id", "!=", uid))
    : query(recipesCol);
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
  if (!savedRecipes || savedRecipes.length === 0) return [];
  const recipesSnap = await getDocs(
    query(recipesCol, where(documentId(), "in", savedRecipes))
  );
  return recipesSnap.docs.map(function getData(doc) {
    return { ...doc.data(), id: doc.id };
  });
}

async function getRecipe(id: string) {
  const recipeSnap = await getDoc(
    doc(firestore, `${COLLECTION.RECIPES}/${id}`)
  );
  if (!recipeSnap.exists())
    throw new Error(`Recipe with id ${id} doesn't exist`);
  return { ...recipeSnap.data(), id };
}

async function deleteRecipe(id: string) {
  return deleteDoc(doc(firestore, `${COLLECTION.RECIPES}/${id}`));
}

export {
  getFeedRecipes,
  getRecipe,
  createRecipe,
  getOwnRecipes,
  getSavedRecipes,
  deleteRecipe,
  editRecipe,
};
