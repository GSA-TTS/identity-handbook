import { h } from "preact";
import { urlify, AnchorLink } from "./anchor-link";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  level: HeadingLevel;

  id?: string;

  children: string;
}

export function Heading({
  level,
  children,
  id = urlify(children),
}: HeadingProps) {
  const TagName = level;

  return (
    <TagName id={id}>
      {children}
      <AnchorLink slug={id} />
    </TagName>
  );
}
