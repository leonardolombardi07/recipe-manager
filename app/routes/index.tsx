import { redirect } from "@remix-run/node";

export default function IndexRoute() {
  const isAuthenticated = true;
  if (isAuthenticated) {
    return redirect("/home");
  }

  return redirect("/signin");
}
