import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import RouteErrorBoundary from "~/components/views/RouteErrorBoundary";

export const meta: MetaFunction = () => ({
  title: "Recipe Manager | Home",
  description: "Browse and save appetizing recipes",
});

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
