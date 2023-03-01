import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import type { Recipe } from "types";
import type { CollectionName } from "../../types";
import { getServices } from "../app";
import type { FirestoreUser } from "./users/types";

const { firestore } = getServices();

function getTypedCollection<T = DocumentData>(
  firestore: Firestore,
  name: CollectionName
) {
  return collection(firestore, name) as CollectionReference<T>;
}

function getCollections() {
  const usersCol = getTypedCollection<FirestoreUser>(firestore, "users");
  const recipesCol = getTypedCollection<Recipe>(firestore, "recipes");
  return { usersCol, recipesCol };
}

export { getCollections };
