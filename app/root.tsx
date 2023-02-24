import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
} from "@remix-run/react";
import SUIStyles from "semantic-ui-css/semantic.min.css";
import { SidebarProvider } from "./context/sidebar";
import { MediaContextProvider, Media } from "~/services/media";
import Header from "./components/shared/Header";
import { DesktopSidebar, MobileSidebar } from "./components/shared/Sidebar";
import React from "react";
import { Icon, Message } from "semantic-ui-react";
import { useSpinDelay } from "./utils/hooks";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: SUIStyles }];
};

export default function AppWithProviders() {
  return (
    <MediaContextProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </MediaContextProvider>
  );
}

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Recipe Manager</title>
        <Links />
      </head>

      <body>
        <div>
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
        </div>

        <PageLoadingMessage />
        <LiveReload />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LOADER_WORDS = [
  "loading",
  "checking cdn",
  "checking cache",
  "fetching from db",
  "compiling mdx",
  "updating cache",
  "transfer",
];

const ACTION_WORDS = [
  "packaging",
  "zapping",
  "validating",
  "processing",
  "calculating",
  "computing",
  "computering",
];

let firstRender = true;

function PageLoadingMessage() {
  const transition = useTransition();
  const [words, setWords] = React.useState<Array<string>>([]);
  const [pendingPath, setPendingPath] = React.useState("");
  const showLoader = useSpinDelay(Boolean(transition.state !== "idle"), {
    delay: 400,
    minDuration: 1000,
  });

  React.useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    if (transition.state === "loading") setWords(LOADER_WORDS);
    if (transition.state === "submitting") setWords(ACTION_WORDS);

    const interval = setInterval(() => {
      setWords(([first, ...rest]) => [...rest, first] as Array<string>);
    }, 2000);

    return () => clearInterval(interval);
  }, [pendingPath, transition.state]);

  React.useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    setPendingPath(transition.location.pathname);
  }, [transition]);

  React.useEffect(() => {
    firstRender = false;
  }, []);

  if (!showLoader) return null;

  const word = words[0];
  return (
    <Message
      icon
      style={{ position: "absolute", bottom: 0, right: 25, width: 500 }}
      info
      size="big"
    >
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>{word}</Message.Header>
        We are fetching that content for you.
      </Message.Content>
    </Message>
  );
}
