import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as Cookies from "~/services/cookies";

export const action = async ({ request }: ActionArgs) => {
  // IMPORTANT: right now we need to sign out from firebase on the client
  // - it doesn't work on the server
  // TODO: sign out from firebase from the server, here - and
  // make sure the user is sign out on the client as well
  return Cookies.signOut(request);
};

export const loader = async () => {
  return redirect("/");
};
