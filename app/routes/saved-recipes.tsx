import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import RouteErrorBoundary from "~/components/views/RouteErrorBoundary";
import * as Cookies from "~/services/cookies";

export const meta: MetaFunction = () => ({
  title: "Recipe Manager | Saved Recipes",
  description: "Browse your saved recipes",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfUnauthorized(request);
}

export default function SavedRecipesRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <RouteErrorBoundary error={error} />;
}
