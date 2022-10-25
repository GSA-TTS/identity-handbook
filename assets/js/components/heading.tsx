import { h } from "preact";
import { urlify, AnchorLink } from "./anchor-link";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  level: HeadingLevel;

  id?: string;
  className?: string;

  children: string;
}

export function Heading({
  level,
  children,
  id = urlify(children),
  className,
}: HeadingProps) {
  const TagName = level;

  return (
    <TagName id={id} className={className}>
      {children}
      <AnchorLink slug={id} />
    </TagName>
  );
}
