import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebase } from "../app";
import { RECIPE_COLLECTION_NAME, USERS_COLLECTION_NAME } from "../constants";

const { firestore } = getFirebase();

async function saveRecipe(recipeId: string, uid: string) {
  const userDoc = doc(firestore, `${USERS_COLLECTION_NAME}/${uid}`);

  const recipeSnap = await getDoc(
    doc(firestore, `${RECIPE_COLLECTION_NAME}/${recipeId}`)
  );
  if (!recipeSnap.exists()) {
    throw new Error(`Recipe with id "${recipeId}" not found`);
  }

  setDoc(userDoc, { savedRecipes: arrayUnion(recipeId) }, { merge: true });
}

export { saveRecipe };
