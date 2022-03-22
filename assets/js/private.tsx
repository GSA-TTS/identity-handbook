import { h, render } from "preact";
import { useState } from "preact/hooks";

interface NetlifyUser {
  avatar_url: string;
  backendName: "github" | string;
  id: string;
  login: string; // username
  name: string; // display name
  token: string;
}

const NETLIFY_USER_KEY = "netlify-cms-user";

export function loggedInUser(): NetlifyUser | undefined {
  const jsonString = localStorage.getItem(NETLIFY_USER_KEY);
  if (jsonString) {
    try {
      const netlifyUser = JSON.parse(jsonString) as NetlifyUser;
      if (netlifyUser.token) {
        return netlifyUser;
      }
    } catch {}
  }
}

function logOut() {
  localStorage.removeItem(NETLIFY_USER_KEY);
}

function PrivateLoginButton({ initialUser }: { initialUser?: NetlifyUser }) {
  const [currentUser, setCurrentUser] = useState(initialUser);

  if (currentUser) {
    return (
      <div>
        <img
          src={currentUser.avatar_url}
          alt="Current User Avatar"
          height="30"
        />
        @{currentUser.login}
        <button
          type="button"
          className="usa-button usa-button--gray"
          onClick={() => {
            logOut();
            setCurrentUser(undefined);
          }}
        >
          Log Out
        </button>
      </div>
    );
  }
  return (
    <a className="usa-button" href="/admin">
      Private Login
    </a>
  );
}

export function setUpPrivate({
  buttonContainer,
}: {
  buttonContainer: HTMLElement;
}) {
  render(<PrivateLoginButton initialUser={loggedInUser()} />, buttonContainer);
}
