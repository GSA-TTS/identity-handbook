import { render, h, Fragment } from "preact";
import { urlify } from "../urlify";

type NavItem = string | string[];
export type Navigation = NavItem[];

function SidebarNavItem({ name }: { name: string }) {
  return (
    <li className="usa-sidenav__item">
      <a href={`#${urlify(name)}`}>{name}</a>
    </li>
  );
}

export function Sidenav({ navigation }: { navigation: Navigation }) {
  return (
    <>
      {navigation.map((nav) =>
        Array.isArray(nav) ? (
          <ul className="usa-sidenav__sublist">
            {nav.map((name) => (
              <SidebarNavItem name={name} />
            ))}
          </ul>
        ) : (
          <SidebarNavItem name={nav} />
        )
      )}
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
