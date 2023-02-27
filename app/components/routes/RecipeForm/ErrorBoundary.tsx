import RouteErrorBoundary from "~/components/views/RouteErrorBoundary";

export function ErrorBoundary({ error }: { error: Error }) {
  return <RouteErrorBoundary error={error} />;
}
