import { initializeApp, credential } from "firebase-admin";
import { getApp } from "firebase-admin/app";
import type { UpdateRequest } from "firebase-admin/auth";
// import { getServices } from "../../app/services/firebase/server/app.server";

// const { auth } = getServices();
const serverCredentials = require("../../firebase.credentials.json");

/// <reference types="cypress" />
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      signIn(uid: string, user: UpdateRequest): Promise<void>;
      signOut(): Promise<void>;
    }
  }
}

Cypress.Commands.add("signIn", async (uid, user) => {
  // const app = initializeApp({
  //   credential: credential.cert(serverCredentials),
  // });
  // await Firebase.Server.updateUser(jwt, user);
  // const jwt = "";
  // await auth.createCustomToken(uid, user);
  // await Cookies.signIn(jwt);
});

Cypress.Commands.add("signOut", async () => {
  // await Cookies.signOut()
});
