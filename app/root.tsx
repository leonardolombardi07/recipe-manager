import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Outlet,
  Scripts,
  useLocation,
} from "@remix-run/react";
import SUIStyles from "semantic-ui-css/semantic.min.css";
import { Sidebar, Segment, Menu, Icon, Image, Header } from "semantic-ui-react";
import { SidebarProvider, useSidebar } from "./context/sidebar";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: SUIStyles }];
};

export default function AppWithProviders() {
  return (
    <SidebarProvider>
      <App />
    </SidebarProvider>
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
        <AppSidebar />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

const SIDEBAR_CONTENT_WIDTH = 475;

function AppSidebar() {
  const {
    state: { visible },
  } = useSidebar();
  const contentWidth = visible
    ? `calc(100vw - ${SIDEBAR_CONTENT_WIDTH}px)`
    : `100vw`;

  return (
    <div>
      <AppHeader />

      <Sidebar.Pushable>
        <SidebarContent />

        <Sidebar.Pusher style={{ width: contentWidth }}>
          <Outlet />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}

function SidebarContent() {
  const {
    state: { visible },
  } = useSidebar();
  const { pathname } = useLocation();

  return (
    <Sidebar
      visible={visible}
      as={Menu}
      icon="labeled"
      vertical
      width="very wide"
      style={{ width: SIDEBAR_CONTENT_WIDTH, padding: "2em 0" }}
      animation={"slide out"}
    >
      <ProfileSection />

      <Segment>
        <Menu.Item as={Link} to="/home" active={pathname === "/home"}>
          <Icon name="home" />
          Home
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/own-recipes"
          active={pathname.includes("/own-recipes")}
        >
          <Icon name="user" />
          Own Recipes
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/saved-recipes"
          active={pathname.includes("/saved-recipes")}
        >
          <Icon name="save" />
          Saved Recipes
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/settings"
          active={pathname.includes("/settings")}
        >
          <Icon name="setting" />
          Settings
        </Menu.Item>
      </Segment>
    </Sidebar>
  );
}

const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

function ProfileSection() {
  return (
    <Segment basic>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image src={PLACEHOLDER_AVATAR} size="medium" circular />
      </div>
      <Header style={{ marginTop: 10 }}>Leonardo</Header>
    </Segment>
  );
}

function AppHeader() {
  const {
    state: { visible },
    actions: { close, open },
  } = useSidebar();
  return (
    <Segment style={{ padding: "1em 0em" }}>
      <Menu fixed={"top"} size="huge" borderless>
        <Menu.Item active={false} onClick={visible ? close : open}>
          <Icon name={visible ? "close" : "list alternate outline"} />
        </Menu.Item>
      </Menu>
    </Segment>
  );
}
