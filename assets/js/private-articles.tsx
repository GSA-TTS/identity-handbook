import { h, render, Fragment } from "preact";
import { load as loadYAML } from "js-yaml";
import { marked } from "marked";
import { useEffect, useMemo } from "preact/hooks";
import { loggedInUser, PrivateLoginLink } from "./private";
import { Alert } from "./components/alert";
import {
  fetchGitHubFile,
  GitHubDirectory,
  GitHubFileWithContent,
} from "./github";
import { renderSidenav, Navigation } from "./components/sidenav";

export function PrivateArticlesIndex({
  articles,
}: {
  articles: GitHubDirectory;
}) {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.path}>
          <a href={`#!/${article.path}`}>{article.name}</a>
        </li>
      ))}
    </ul>
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
      const nested = [text];
      navigation.push(nested);
      stack.push(nested);
    } else if (depth < lastDepth) {
      stack.pop();
      const last = stack[stack.length - 1];
      last.push(text);
    } else if (depth === lastDepth) {
      const last = stack[stack.length - 1];
      last.push(text);
    }

    lastDepth = depth;
  });
  return navigation;
}

function PrivateArticle({ article }: { article: GitHubFileWithContent }) {
  const [, frontMatterString, content] = atob(article.content).split("---");
  const frontMatter = loadYAML(frontMatterString) as Frontmatter;

  const [parsed, navigation] = useMemo(() => {
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

    return [parsedContent, buildNavigation(headings)];
  }, [content]);

  useEffect(() => {
    renderSidenav({ navigation });
  }, [content]);

  return (
    <>
      <h1>{frontMatter.title}</h1>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: parsed }} />
    </>
  );
}

function renderPage() {
  const jekyllBaseUrl = document.body.dataset.baseUrl as string;
  const currentUser = loggedInUser();
  const container = document.getElementById("private-container") as HTMLElement;
  const ref = container.dataset.privateHandbookBranch;

  if (currentUser) {
    const firstH1 = document.querySelector('h1');
    if (firstH1?.innerText.includes('Private Articles')) {
      firstH1.hidden = true;
    }

    if (document.location.hash.length > 3) {
      const articlePath = document.location.hash.slice(3);

      fetchGitHubFile({
        token: currentUser.token,
        repo: "18f/identity-handbook-private",
        path: articlePath,
        ref,
      }).then((file) => {
        if (Array.isArray(file)) {
          return;
        }

        render(<PrivateArticle article={file} />, container);
      });
    } else {
      fetchGitHubFile({
        token: currentUser.token,
        repo: "18f/identity-handbook-private",
        path: "_articles",
        ref,
      }).then((dir) => {
        if (!Array.isArray(dir)) {
          return;
        }

        render(<PrivateArticlesIndex articles={dir} />, container);
        renderSidenav({ navigation: [] });
      });
    }
  } else {
    render(
      <Alert heading="Error loading private articles">
        Private articles require <PrivateLoginLink baseUrl={jekyllBaseUrl} />
      </Alert>,
      container
    );
  }
}

export function setUpPrivatePage() {
  renderPage();
  window.addEventListener("hashchange", () => renderPage(), false);
}
