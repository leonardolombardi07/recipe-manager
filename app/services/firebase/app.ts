import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { firebaseConfig } from "./config";

function initialize() {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

function connectToEmulators({
  firebaseApp,
  auth,
  firestore,
}: FirebaseServices) {
  if (location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }
  return { firebaseApp, auth, firestore };
}

function enableOffline({ firestore, firebaseApp, auth }: FirebaseServices) {
  enableMultiTabIndexedDbPersistence(firestore);
  return { firestore, firebaseApp, auth };
}

function getFirebase() {
  const existingApp = getApps().at(0);
  if (existingApp) return initialize();
  const services = connectToEmulators(initialize());
  return enableOffline(services);
}

export { getFirebase };
