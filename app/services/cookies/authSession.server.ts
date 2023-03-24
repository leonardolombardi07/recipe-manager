import { createCookieSessionStorage, redirect } from "@remix-run/node";
import * as Firebase from "~/services/firebase";
import { unauthorized } from "~/utils/action";

const sessionSecret = process.env.SESSION_SECRET || "Random";
if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

const SESSION_KEY_NAME = {
  JWT: "jwt",
};

const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_IN,
    httpOnly: true,
  },
});

async function saveJwt(jwt: string) {
  const session = await storage.getSession();
  session.set(SESSION_KEY_NAME.JWT, jwt);
  const setCookieHeader = await storage.commitSession(session);
  return setCookieHeader;
}

async function destroyJwt(request: Request) {
  const session = await getUserSession(request);
  const setCookieHeader = await storage.destroySession(session);
  return setCookieHeader;
}

async function getJwt(request: Request) {
  const session = await getUserSession(request);
  const jwt = session.get(SESSION_KEY_NAME.JWT);
  return jwt;
}

async function getAuthenticatedUser(request: Request) {
  try {
    const jwt = await getJwt(request);
    if (!jwt) throw new Error();
    const user = await Firebase.Server.getAuthenticatedUser(jwt);
    if (!user) throw new Error();
    return {
      jwt,
      ...user,
    };
  } catch (error) {
    throw unauthorized(`User not authenticated`);
  }
}

async function redirectIfAuthorized(request: Request, to: string = "/home") {
  try {
    const user = await getAuthenticatedUser(request);
    if (user) return redirect(to);
    return null;
  } catch (error) {
    return null;
  }
}

async function redirectIfUnauthorized(
  request: Request,
  to: string = "/signin"
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return redirect(to);
    return null;
  } catch (error) {
    return redirect(to);
  }
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export {
  redirectIfUnauthorized,
  redirectIfAuthorized,
  getAuthenticatedUser,
  saveJwt,
  destroyJwt,
  EXPIRES_IN,
};
