import { signIn } from "~/utils/auth.server";
import { getServices } from "~/services/firebase/client/app";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const { auth } = getServices();

export interface SignInCredentials {
  email: string;
  password: string;
}

async function createIdToken({ email, password }: SignInCredentials) {
  let user: User;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  } catch (error) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
  }

  return user.getIdToken();
}

function authTasks(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): void {
  on("task", {
    async signIn(credentials: SignInCredentials) {
      const idToken = await createIdToken(credentials);
      return signIn(idToken);
    },
  });
}

export { authTasks };
