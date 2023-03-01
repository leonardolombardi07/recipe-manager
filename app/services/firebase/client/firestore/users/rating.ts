import type { Transaction } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { arrayUnion, doc, runTransaction } from "firebase/firestore";
import { getServices } from "../../app";
import { getCollections } from "../utils";
import type { FirestoreUser, RatingValue } from "./types";

const { firestore } = getServices();

const { usersCol, recipesCol } = getCollections();

async function rateRecipe(recipeId: string, uid: string, rating: RatingValue) {
  const userDoc = doc(usersCol, uid);
  const recipeDoc = doc(recipesCol, recipeId);
  const isClearing = rating === 0;

  runTransaction(firestore, async (transaction) => {
    const { count: oldCount, average: oldAverage } = await getRecipeRating(
      transaction,
      recipeId
    );
    const ratedRecipes = await getUserRatedRecipes(uid);

    const recipeRatedInThePast = ratedRecipes.find(
      (recipe) => recipe.id === recipeId
    );
    if (!recipeRatedInThePast) {
      // This is probably not possible, but
      // if the user is clearing it should have rated
      // in the past. But just to make sure we don't
      // create a new 0 rating
      if (isClearing) return;

      transaction.set(
        userDoc,
        { ratedRecipes: arrayUnion({ id: recipeId, rating }) },
        { merge: true }
      );

      transaction.set(
        recipeDoc,
        {
          rating: {
            count: oldCount + 1,
            average: (oldAverage * oldCount + rating) / (oldCount + 1),
          },
        },
        { merge: true }
      );

      return;
    }

    if (isClearing) {
      transaction.update(userDoc, {
        ratedRecipes: ratedRecipes.filter((recipe) => recipe.id !== recipeId),
      });
    } else {
      const newRatedRecipes = ratedRecipes.map((recipe) => {
        if (recipe.id !== recipeId) return recipe;
        return { ...recipe, rating };
      });
      transaction.update(userDoc, {
        ratedRecipes: newRatedRecipes,
      });
    }

    const { rating: oldRating } = recipeRatedInThePast;
    const count = isClearing
      ? oldCount - 1 // One less
      : oldCount; // We add one rating, but delete the previous. So it's the same count

    transaction.update(recipeDoc, {
      "rating.count": count,
      "rating.average": (oldAverage * count - oldRating + rating) / count,
    });
  });
}

async function getRecipeRating(transaction: Transaction, id: string) {
  const recipeSnap = await transaction.get(doc(recipesCol, id));
  const { count, average } = recipeSnap.data()?.rating || {};
  if (typeof count !== "number" || typeof average !== "number") {
    throw new Error(
      `The rating of recipe with id "${id}" is not valid. 
      It should be initialized as { count: 0, average: 0 }.
      If possible, please contact the admin."`
    );
  }
  return { count, average };
}

async function getUserRatedRecipes(uid: string) {
  const userSnap = await getDoc(doc(usersCol, uid));
  const userData = (userSnap.data() || {}) as FirestoreUser;
  return userData.ratedRecipes || [];
}

export { rateRecipe, getUserRatedRecipes };
