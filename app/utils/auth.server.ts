import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";

async function signIn(idToken: string) {
  const jwt = await Firebase.Server.signIn(idToken, Cookies.EXPIRES_IN);
  const setCookieHeader = await Cookies.saveJwt(jwt);
  return setCookieHeader;
}

async function signOut(request: Request) {
  const setCookieHeader = await Cookies.destroyJwt(request);
  return setCookieHeader;
}

export { signIn, signOut };
