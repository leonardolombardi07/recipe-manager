import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { EMULATOR_BASE_URL } from "./constants";
import type { CollectionName } from "./types";

function createTypedCollection<T = DocumentData>(
  firestore: Firestore,
  name: CollectionName
) {
  return collection(firestore, name) as CollectionReference<T>;
}

function getEmulatorUrl(port: number) {
  return `${EMULATOR_BASE_URL}:${port}`;
}

export { createTypedCollection, getEmulatorUrl };
