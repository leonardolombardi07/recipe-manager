import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
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
import { UserProvider, useUser } from "./context/user";
import PageLoadingMessage from "./components/shared/PageLoadingMessage";
import * as Firebase from "~/services/firebase";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: SUIStyles, as: "style" }];
};

export const meta: MetaFunction = () => {
  return { charset: "utf-8", description: `Recipe Manager` };
};

function useAuthentication() {
  const {
    actions: { setUser },
  } = useUser();

  React.useEffect(() => {
    const unsubscribe = Firebase.onAuthStateChanged(async (user) => {
      setUser(user);
    });

    return function onUnmount() {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [setUser]);
}

function App() {
  useAuthentication();
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
      <UserProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </UserProvider>
    </MediaContextProvider>
  );
}
