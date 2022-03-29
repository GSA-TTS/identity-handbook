import { h, render, Fragment, createContext } from "preact";
import { useEffect, useMemo, useState, useContext } from "preact/hooks";
import { load as loadYAML } from "js-yaml";
import { marked } from "marked";
import Markup from "preact-markup";
import { createPortal } from "preact/compat";
import { useQuery } from "preact-fetching";
import { useCurrentUser, PrivateLoginLink } from "./private";
import { Alert } from "./components/alert";
import { fetchGitHubFile } from "./github";
import { Navigation, SidenavWithWrapper } from "./components/sidenav";

const GitHubContext = createContext({
  ref: undefined,
} as { ref?: string });

export function PrivateArticlesIndex() {
  const nav = document.getElementById("sidenav-wrapper") as HTMLElement;
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
      if (!Array.isArray(dir)) {
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
              <a href={`#!/${article.path}`}>{article.name}</a>
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

interface Heading {
  text: string;
  depth: number;
}

function buildNavigation(headings: Heading[]): Navigation {
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

function PrivateArticle({ articlePath }: { articlePath: string }) {
  const [currentUser] = useCurrentUser();
  const { ref } = useContext(GitHubContext);
  const nav = document.getElementById("sidenav-wrapper") as HTMLElement;

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
      if (Array.isArray(file)) {
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

    const headings: Heading[] = [];
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
          <Markup markup={parsed} trim={false} />
          {createPortal(<SidenavWithWrapper navigation={navigation} />, nav)}
        </>
      ) : undefined}
    </>
  );
}

function useArticleHash() {
  const [articlePath, setArticlePath] = useState(null as string | null);
  useEffect(() => {
    function onHashChange() {
      if (window.location.hash[1] === "!") {
        setArticlePath(window.location.hash.slice(3));
      } else {
        setArticlePath(null);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return articlePath;
}

function PrivatePage() {
  const articlePath = useArticleHash();
  const [currentUser] = useCurrentUser();

  useEffect(() => {
    const firstH1 = document.querySelector("h1");
    if (firstH1?.innerText.includes("Private Articles")) {
      firstH1.hidden = !!articlePath && !!currentUser;
    }
  });

  if (currentUser) {
    if (articlePath) {
      return <PrivateArticle articlePath={articlePath} />;
    }
    return <PrivateArticlesIndex />;
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