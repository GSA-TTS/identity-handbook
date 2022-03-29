import { h, Fragment } from "preact";
import { urlify } from "./anchor-link";

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

export function SidenavWithWrapper({ navigation }: { navigation: Navigation }) {
  return (
    <ul className="usa-accordion usa-sidenav" id="sidenav">
      <Sidenav navigation={navigation} />
    </ul>
  );
}
