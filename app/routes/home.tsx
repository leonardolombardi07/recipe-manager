import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import RouteErrorBoundary from "~/components/views/RouteErrorBoundary";
import * as Cookies from "~/services/cookies";

export const meta: MetaFunction = () => ({
  title: "Recipe Manager | Home",
  description: "Browse and save appetizing recipes",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfUnauthorized(request);
}

export default function HomeRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <RouteErrorBoundary error={error} goHome={false} />;
}
