import { render, Fragment, createContext, ComponentChildren } from "preact";
import { useEffect, useMemo, useContext } from "preact/hooks";
import { load as loadYAML } from "js-yaml";
import { marked } from "marked";
import Markup from "preact-markup";
import { createPortal } from "preact/compat";
import { useQuery } from "preact-fetching";
import { useCurrentUser, PrivateLoginLink } from "./private";
import { Alert } from "./components/alert";
import { fetchGitHubFile, isGithubDirectory, isGithubFile } from "./github-api";
import { Navigation, SidenavWithWrapper } from "./components/sidenav";
import { Heading } from "./components/heading";
import type { HeadingLevel } from "./components/heading";

const GitHubContext = createContext({
  ref: undefined,
} as { ref?: string });

export function PrivateArticlesIndex({ nav }: { nav: HTMLElement }) {
  const [currentUser] = useCurrentUser();
  const { ref } = useContext(GitHubContext);

  const { data: articles } = useQuery(`articlesIndex`, () => {
    if (!currentUser) {
      return [];
    }
    return fetchGitHubFile({
      token: currentUser.token,
      repo: "18f/identity-handbook-private",
      path: "_articles",
      ref,
    }).then((dir) => {
      if (!isGithubDirectory(dir)) {
        return [];
      }

      return dir;
    });
  });

  return (
    <>
      <ul>
        {articles &&
          articles.map((article) => (
            <li key={article.path}>
              <a
                href={`?article=${encodeURIComponent(article.path)}`}
                className="usa-link"
              >
                {article.name}
              </a>
            </li>
          ))}
      </ul>
      {createPortal(<SidenavWithWrapper navigation={[]} />, nav)}
    </>
  );
}

interface Frontmatter {
  title: string;
  description?: string;
  category: string;
}

interface HeadingEntry {
  text: string;
  depth: number;
}

function buildNavigation(headings: HeadingEntry[]): Navigation {
  const navigation: Navigation = [];
  let lastDepth = 0;
  const stack: Navigation[] = [];
  headings.forEach(({ text, depth }) => {
    if (!lastDepth) {
      navigation.push(text);
      stack.push(navigation);
    } else if (depth > lastDepth) {
      const last = stack[stack.length - 1];
      const nested = [text];
      last.push(nested);
      stack.push(nested);
    } else if (depth === lastDepth) {
      const last = stack[stack.length - 1];
      last.push(text);
    } else {
      while (depth < lastDepth) {
        stack.pop();
        lastDepth -= 1;
      }
      const last = stack[stack.length - 1];
      last.push(text);
    }

    lastDepth = depth;
  });
  return navigation;
}
function buildHeader(level: HeadingLevel) {
  return ({ id, children }: { id: string; children: string }) => (
    <Heading level={level} id={id}>
      {children}
    </Heading>
  );
}

const MarkupOverrides = {
  A: function Link({
    href,
    children,
  }: {
    href: string;
    children: ComponentChildren;
  }) {
    return (
      <a href={href} className="usa-link">
        {children}
      </a>
    );
  },
  H1: buildHeader("h1"),
  H2: buildHeader("h2"),
  H3: buildHeader("h3"),
  H4: buildHeader("h4"),
  H5: buildHeader("h5"),
  H6: buildHeader("h6"),
};

function PrivateArticle({
  articlePath,
  nav,
}: {
  articlePath: string;
  nav: HTMLElement;
}) {
  const [currentUser] = useCurrentUser();
  const { ref } = useContext(GitHubContext);

  const { data: article } = useQuery(`article:${articlePath}`, () => {
    if (!currentUser) {
      return undefined;
    }
    return fetchGitHubFile({
      token: currentUser.token,
      repo: "18f/identity-handbook-private",
      path: articlePath,
      ref,
    }).then((file) => {
      if (!isGithubFile(file)) {
        return undefined;
      }

      return file;
    });
  });

  const [title, parsed, navigation] = useMemo(() => {
    if (!article) {
      return [];
    }

    const [, frontMatterString, content] = atob(article.content).split("---");
    const frontMatter = loadYAML(frontMatterString) as Frontmatter;

    const headings: HeadingEntry[] = [];
    const headingCollector = (token: marked.Token) => {
      if (token.type === "heading") {
        headings.push({
          text: token.text,
          depth: token.depth,
        });
      }
    };

    marked.setOptions({
      gfm: true,
      smartypants: true,
    });
    marked.use({ walkTokens: headingCollector });

    const parsedContent = marked.parse(content);

    return [frontMatter.title, parsedContent, buildNavigation(headings)];
  }, [article?.path]);

  return (
    <>
      {title && parsed && navigation ? (
        <>
          <h1>{title}</h1>
          <Markup markup={parsed} trim={false} components={MarkupOverrides} />
          {createPortal(<SidenavWithWrapper navigation={navigation} />, nav)}
        </>
      ) : undefined}
    </>
  );
}

function PrivatePage() {
  const articlePath = new URL(document.location.toString()).searchParams.get(
    "article"
  );
  const [currentUser] = useCurrentUser();
  const nav = document.getElementById("sidenav-wrapper") as HTMLElement;

  useEffect(() => {
    const firstH1 = document.querySelector("h1");
    if (firstH1?.innerText.includes("Private Articles")) {
      firstH1.hidden = !!articlePath && !!currentUser;
    }
  });

  if (currentUser) {
    if (articlePath) {
      return <PrivateArticle articlePath={articlePath} nav={nav} />;
    }
    return <PrivateArticlesIndex nav={nav} />;
  }
  return (
    <Alert heading="Error loading private articles">
      Private articles require <PrivateLoginLink />
    </Alert>
  );
}

export function setUpPrivatePage() {
  const container = document.getElementById("private-container") as HTMLElement;
  const ref = container.dataset.privateHandbookBranch;
  render(
    <GitHubContext.Provider value={{ ref }}>
      <PrivatePage />
    </GitHubContext.Provider>,
    container
  );
}
