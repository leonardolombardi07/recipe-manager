import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import { connectFirestoreEmulator } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";
import type { FirebaseStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { config } from "./config";
import { EMULATOR_BASE_URL, EMULATOR_PORT } from "../constants";
import { getEmulatorUrl } from "../utils";

interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

function getRawServices(): FirebaseClientServices {
  const app = initializeApp(config);
  const auth = getFirebaseAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage();
  return { app, auth, firestore, storage };
}

function getFirebaseAuth(app: FirebaseApp) {
  const auth = getAuth(app);

  // Let Remix handle the persistence via session cookies
  setPersistence(auth, inMemoryPersistence);
  return auth;
}

function getServices() {
  const initializedApp = getApps().at(0);
  if (!initializedApp) {
    const services = getRawServices();
    const { auth, firestore } = services;
    // if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, `http://${getEmulatorUrl(EMULATOR_PORT.AUTH)}`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(
      firestore,
      EMULATOR_BASE_URL,
      EMULATOR_PORT.FIRESTORE
    );
    // }
    return services;
  }

  return getRawServices();
}

export { getServices };
