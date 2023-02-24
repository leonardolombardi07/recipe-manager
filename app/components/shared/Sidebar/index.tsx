import { Link, useLocation } from "@remix-run/react";
import {
  Sidebar as SUISidebar,
  Segment,
  Menu,
  Icon,
  Image,
  Header,
} from "semantic-ui-react";
import { useSidebar } from "~/context/sidebar";

interface SidebarProps {
  children: React.ReactNode;
}

function DesktopSidebar({ children }: SidebarProps) {
  const SIDEBAR_CONTENT_WIDTH = 475;
  const contentWidth = `calc(100vw - ${SIDEBAR_CONTENT_WIDTH}px)`;
  return (
    <SUISidebar.Pushable>
      <SUISidebar
        visible
        as={Menu}
        icon="labeled"
        vertical
        width="very wide"
        animation={"slide out"}
        style={{ padding: "1em 0" }}
      >
        <SidebarProfile />
        <SidebarLinks />
      </SUISidebar>

      <SUISidebar.Pusher style={{ width: contentWidth }}>
        {children}
      </SUISidebar.Pusher>
    </SUISidebar.Pushable>
  );
}

function MobileSidebar({ children }: SidebarProps) {
  const {
    state: { visible },
    actions: { close },
  } = useSidebar();
  return (
    <SUISidebar.Pushable>
      <SUISidebar
        visible={visible}
        as={Menu}
        icon="labeled"
        vertical
        width="wide"
        animation={"overlay"}
        style={{ padding: "2em 0" }}
      >
        <SidebarProfile />
        <SidebarLinks />
      </SUISidebar>

      <SUISidebar.Pusher dimmed={visible} onClick={visible ? close : undefined}>
        {children}
      </SUISidebar.Pusher>
    </SUISidebar.Pushable>
  );
}

function SidebarProfile() {
  return (
    <Segment basic>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image
          src={
            "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          }
          size="medium"
          circular
        />
      </div>
      <Header style={{ marginTop: 10 }}>Leonardo</Header>
    </Segment>
  );
}

function SidebarLinks() {
  const { pathname } = useLocation();
  return (
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
  );
}

export { DesktopSidebar, MobileSidebar };
