export function permalink({
  repo,
  ref = "main",
  file,
  line,
}: {
  repo: string;
  file: string;
  ref?: string;
  line?: number | string;
}) {
  return `https://github.com/${repo}/blob/${ref}/${file}${
    line ? `#L${line}` : ""
  }`;
}

export function searchURL({
  needle,
  repo,
  extension,
  path,
  type,
}: {
  needle?: string;
  path?: string;
  repo?: string;
  /**
   * @example "rb"
   */
  extension?: string;
  type?:
    | "repositories"
    | "code"
    | "commits"
    | "issues"
    | "discussions"
    | "registrypackages"
    | "wikis"
    | "users";
}) {
  const url = new URL("https://github.com/search");

  const q = [
    needle,
    repo && `repo:${repo}`,
    extension && `extension:${extension}`,
    path && `path:${path}`,
  ]
    .filter(Boolean)
    .join(" ");

  if (q) {
    url.searchParams.set("q", q);
  }

  if (type) {
    url.searchParams.set("type", type);
  }

  return url.toString();
}
