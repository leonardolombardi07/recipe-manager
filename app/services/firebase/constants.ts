import type { CollectionName } from "./types";

export const COLLECTION: { [key: string]: CollectionName } = {
  USERS: "users",
  RECIPES: "recipes",
};

export const EMULATOR_PORT = {
  FIRESTORE: 8080,
  AUTH: 9099,
};
