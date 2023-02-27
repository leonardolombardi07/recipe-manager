import { Link, useLocation, useNavigate } from "@remix-run/react";
import { Button } from "semantic-ui-react";
import ErrorBoundary from "./ErrorBoundary";

interface RouteErrorBoundaryProps {
  error: Error;
  tryAgain?: boolean;
  goBack?: boolean;
  goHome?: boolean;
}

export default function RouteErrorBoundary({
  error,
  tryAgain = true,
  goBack = true,
  goHome = true,
}: RouteErrorBoundaryProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <ErrorBoundary
      header={"We're sorry, something went wrong"}
      message={error.message}
      segmentStyle={{ minHeight: "100vh" }}
    >
      {tryAgain && (
        <Button
          as={Link}
          reloadDocument
          to={pathname}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Try again
        </Button>
      )}

      {goBack && (
        <Button
          onClick={() => navigate(-1)}
          secondary
          size="huge"
          style={{ marginTop: "1em", margin: "0 20px" }}
        >
          Go back
        </Button>
      )}

      {goHome && (
        <Button
          onClick={() => navigate("/home")}
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Go Home
        </Button>
      )}
    </ErrorBoundary>
  );
}
