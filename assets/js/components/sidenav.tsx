import { render, h, Fragment } from "preact";
import { urlify } from "../urlify";

type NavItem = string | string[];
export type Navigation = NavItem[];

function SidebarNavItem({ item }: { item: NavItem }) {
  return Array.isArray(item) ? (
    <ul className="usa-sidenav__sublist">
      {item.map((nestedItem) => (
        <SidebarNavItem item={nestedItem} />
      ))}
    </ul>
  ) : (
    <li className="usa-sidenav__item">
      <a href={`#${urlify(item)}`}>{item}</a>
    </li>
  );
}

export function Sidenav({ navigation }: { navigation: Navigation }) {
  return (
    <>
      {navigation.map((item) => (
        <SidebarNavItem item={item} />
      ))}
    </>
  );
}

export function renderSidenav({
  navigation,
  appendToExisting = false,
}: {
  navigation: Navigation;
  appendToExisting?: boolean;
}) {
  if (appendToExisting) {
    const sidenav = document.querySelector(
      "#sidenav .usa-sidenav__sublist:last-child"
    ) as HTMLElement;

    render(<Sidenav navigation={navigation} />, sidenav);
  } else {
    const nav = document.getElementById("sidenav-wrapper") as HTMLElement;
    render(
      <ul className="usa-accordion usa-sidenav" id="sidenav">
        <Sidenav navigation={navigation} />
      </ul>,
      nav
    );
  }
}
