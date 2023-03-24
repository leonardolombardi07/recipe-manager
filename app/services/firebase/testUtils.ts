import { getServices } from "./client/app";
import { createUserWithEmailAndPassword } from "firebase/auth";

const { auth } = getServices();

async function createIdToken__TEST_ONLY(uid: string, developerClaims?: object) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    "leo@email.com",
    "pass123"
  );
  return user.getIdToken();
}

export { createIdToken__TEST_ONLY };
