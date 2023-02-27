import { useLocation } from "@remix-run/react";
import { Icon, Menu, Segment } from "semantic-ui-react";
import { useSidebar } from "~/context/sidebar";

function useHideHeader() {
  const TO_HIDE = ["/signin"];
  const { pathname } = useLocation();
  return TO_HIDE.includes(pathname);
}

function Header() {
  const {
    state: { visible },
    actions: { open, close },
  } = useSidebar();
  const hideHeader = useHideHeader();

  if (hideHeader) return null;

  return (
    <Segment style={{ margin: 10 }}>
      <Menu fixed="top" size="huge" borderless>
        <Menu.Item active={false} onClick={visible ? close : open}>
          <Icon name={visible ? "close" : "list alternate outline"} />
        </Menu.Item>
      </Menu>
    </Segment>
  );
}

export default Header;
