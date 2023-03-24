import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { signOut } from "~/utils/auth.server";

export const action = async ({ request }: ActionArgs) => {
  return redirect("/home", {
    headers: {
      "Set-Cookie": await signOut(request),
    },
  });
};

export const loader = async () => {
  return redirect("/");
};
