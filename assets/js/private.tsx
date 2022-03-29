import { h, render, VNode } from "preact";
import { useState } from "preact/hooks";
import { useJekyllBaseUrl } from "./hooks/jekyll";

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

function removeLoggedInUser() {
  localStorage.removeItem(NETLIFY_USER_KEY);
}

export function useCurrentUser(): [NetlifyUser | undefined, () => void] {
  const [currentUser, setCurrentUser] = useState(loggedInUser());

  const logOut = () => {
    removeLoggedInUser();
    setCurrentUser(undefined);
  };

  return [currentUser, logOut];
}

export function PrivateLoginLink(): VNode {
  const baseUrl = useJekyllBaseUrl();
  return <a href={`${baseUrl}/admin`}>Private Login</a>;
}

function PrivateLoginLinkOrAvatar() {
  const [currentUser, logOut] = useCurrentUser();

  if (currentUser) {
    return (
      <div className="display-flex flex-align-center">
        <img
          src={currentUser.avatar_url}
          alt="Current User Avatar"
          height="30"
          className="margin-right-1"
        />
        @{currentUser.login}
        <button
          type="button"
          className="usa-button usa-button--gray margin-left-1"
          onClick={logOut}
        >
          Log Out
        </button>
      </div>
    );
  }
  return <PrivateLoginLink />;
}

export function setUpPrivateLogin() {
  const buttonContainer = document.getElementById(
    "private-login-button-container"
  ) as HTMLElement;

  render(<PrivateLoginLinkOrAvatar />, buttonContainer);
}
