import { redirect } from "@remix-run/node";

export const loader = async () => {
  const isAuthenticated = true;
  if (isAuthenticated) {
    return redirect("/home");
  }

  return redirect("/signin");
};
