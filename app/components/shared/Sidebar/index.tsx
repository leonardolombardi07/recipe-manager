import { Link, useLocation, useSubmit } from "@remix-run/react";
import React from "react";
import {
  Sidebar as SUISidebar,
  Segment,
  Menu,
  Icon,
  Image,
  Header,
} from "semantic-ui-react";
import Confirm from "~/components/addons/Confirm";
import { useSidebar } from "~/context/sidebar";
import { useUser } from "~/context/user";
import * as Firebase from "~/services/firebase";

function useHideSidebar() {
  const TO_HIDE = ["/signin"];
  const { pathname } = useLocation();
  return TO_HIDE.includes(pathname);
}

interface SidebarProps {
  children: React.ReactNode;
}

function DesktopSidebar({ children }: SidebarProps) {
  const SIDEBAR_CONTENT_WIDTH = 475;
  const hideSidebar = useHideSidebar();
  const contentWidth = hideSidebar
    ? "100vw"
    : `calc(100vw - ${SIDEBAR_CONTENT_WIDTH}px)`;
  return (
    <SUISidebar.Pushable>
      <SUISidebar
        visible={hideSidebar ? false : true}
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
  const hideSidebar = useHideSidebar();
  return (
    <SUISidebar.Pushable>
      <SUISidebar
        visible={hideSidebar ? false : visible}
        as={Menu}
        icon="labeled"
        vertical
        width="wide"
        animation={"overlay"}
        style={{ padding: "2em 0", height: "100vh" }}
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

const PLACEHOLDER_PROFILE_URL =
  "https://react.semantic-ui.com/images/wireframe/image.png";

function SidebarProfile() {
  const {
    state: { user },
  } = useUser();

  const imageSrc =
    user && user.photoURL ? user.photoURL : PLACEHOLDER_PROFILE_URL;
  const name = user && user.displayName ? user.displayName : "";

  return (
    <Segment basic>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image avatar src={imageSrc} size="small" />
      </div>
      <Header style={{ marginTop: "1em" }}>{name}</Header>
    </Segment>
  );
}

function SidebarLinks() {
  const { pathname } = useLocation();
  return (
    <Segment>
      <Menu.Item as={Link} to="/home" active={pathname.includes("/home")}>
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

      <SignOutMenuItem />
    </Segment>
  );
}

function SignOutMenuItem() {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const submit = useSubmit();

  async function onConfirm() {
    // IMPORTANT: right now we need to sign out from firebase on the client
    // - it doesn't work on the server
    // TODO: sign out from firebase from the server, on ./signout route - and
    // make sure the user is sign out on the client as well
    await Firebase.signOut();
    submit(null, { method: "post", action: "/signout" });
    setIsConfirming(false);
  }

  return (
    <React.Fragment>
      <Menu.Item onClick={() => setIsConfirming(true)} active={isConfirming}>
        <Icon name="sign out alternate" />
        Sign Out
      </Menu.Item>

      <Confirm
        size="large"
        open={isConfirming}
        header={"Signing out"}
        message="Are you sure you want to sign out?"
        cancelButton="No"
        confirmButton="Yes"
        onCancel={() => setIsConfirming(false)}
        onConfirm={onConfirm}
        closeOnEscape
        closeOnDimmerClick
      />
    </React.Fragment>
  );
}

export { DesktopSidebar, MobileSidebar };
