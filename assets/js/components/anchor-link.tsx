import { h } from "preact";
import Anchor from "anchor-js";

const anchor = new Anchor();

export const urlify = anchor.urlify.bind(anchor);

export function AnchorLink({
  slug,
  icon = String.fromCharCode(59851),
}: {
  slug: string;
  icon?: string;
}) {
  const setRef = (node: HTMLElement | null) => {
    if (node && document.location.hash.slice(1) === slug) {
      setTimeout(() => node.scrollIntoView(), 0);
    }
  };

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/423
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      ref={setRef}
      className="anchorjs-link"
      aria-label="Anchor"
      data-anchorjs-icon={icon}
      id={slug}
      href={`#${slug}`}
      style={{ font: "1em / 1 anchorjs-icons", paddingLeft: "0.375em" }}
    />
  );
}
