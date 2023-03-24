import type { CollectionName } from "./types";

export const COLLECTION: { [key: string]: CollectionName } = {
  USERS: "users",
  RECIPES: "recipes",
};

export const EMULATOR_PORT = {
  FIRESTORE: 8080,
  AUTH: 9099,
};

// Do not use "localhost" to properly connect to Cypress
// See: https://stackoverflow.com/questions/72749391/firebase-admin-gives-error-econnrefused-on-connecting-to-auth-emulator
export const EMULATOR_BASE_URL = "127.0.0.1";
