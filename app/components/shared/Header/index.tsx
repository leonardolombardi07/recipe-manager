import { useLocation } from "@remix-run/react";
import { Icon, Image, Menu } from "semantic-ui-react";
import { useSidebar } from "~/context/sidebar";
import Logo from "public/images/Logo.png";

const MOBILE_HEADER_HEIGHT = 56;

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

  function openAndScrollToTop() {
    open();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Menu fixed="top" borderless style={{ height: MOBILE_HEADER_HEIGHT }}>
      <Menu.Item onClick={visible ? close : openAndScrollToTop}>
        <Icon
          size="large"
          name={visible ? "close" : "list alternate outline"}
        />
      </Menu.Item>

      <Menu.Item style={{ padding: "0 10px" }}>
        <Image src={Logo} size="tiny" />
      </Menu.Item>
    </Menu>
  );
}

export { MOBILE_HEADER_HEIGHT };
export default Header;
