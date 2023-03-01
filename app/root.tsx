import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import SUIStyles from "semantic-ui-css/semantic.min.css";
import { SidebarProvider } from "./context/sidebar";
import { MediaContextProvider, Media } from "~/services/media";
import Header from "./components/shared/Header";
import { DesktopSidebar, MobileSidebar } from "./components/shared/Sidebar";
import React from "react";
import { Button } from "semantic-ui-react";
import ErrorBoundaryView from "./components/views/ErrorBoundary";
import PageLoadingMessage from "./components/shared/PageLoadingMessage";
import * as Cookies from "~/services/cookies";
import type { User } from "./types";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: SUIStyles, as: "style" }];
};

export const meta: MetaFunction = () => {
  return { charset: "utf-8", description: `Recipe Manager` };
};

export const handle = {
  id: "root",
};

export async function loader({ request }: LoaderArgs) {
  const data: { user: User | null } = { user: null };
  try {
    data.user = await Cookies.getAuthenticatedUser(request);
  } finally {
    return json(data);
  }
}

export function useRootData() {
  const matches = useMatches();
  const match = matches.find(({ handle }) => handle?.id === "root");
  if (!match) {
    throw new Error(`No active route for handle ID "root"`);
  }
  return match.data as SerializeFrom<typeof loader>;
}

function App() {
  return (
    <Document>
      <Media lessThan="computer">
        <Header />
      </Media>

      <Media greaterThanOrEqual="computer">
        <DesktopSidebar>
          <Outlet />
        </DesktopSidebar>
      </Media>

      <Media lessThan="computer">
        <MobileSidebar>
          <Outlet />
        </MobileSidebar>
      </Media>
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Recipe Manager</title>
        <Links />
      </head>

      <body>
        {children}

        <PageLoadingMessage />
        <LiveReload />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log("Caught Boundary:", caught);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const unauthorized = caught.status === 401;
  const notFound = caught.status === 404;

  function onClick() {
    const to = notFound ? "/home" : unauthorized ? "/signin" : pathname;
    navigate(to);
  }

  const buttonText = notFound
    ? "Go home"
    : unauthorized
    ? "Go to sign in"
    : "Try again";

  return (
    <Document>
      <ErrorBoundaryView header={String(caught.status)} message={caught.data}>
        <Button
          onClick={onClick}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          {buttonText}
        </Button>
      </ErrorBoundaryView>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { pathname } = useLocation();
  console.log("RootErrorBoundary", error);
  return (
    <Document>
      <ErrorBoundaryView
        header={"We're sorry, something went wrong"}
        message={error.message}
      >
        <Button
          as={Link}
          to={pathname}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Try again
        </Button>
      </ErrorBoundaryView>
    </Document>
  );
}

export default function AppWithProviders() {
  return (
    <MediaContextProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </MediaContextProvider>
  );
}
