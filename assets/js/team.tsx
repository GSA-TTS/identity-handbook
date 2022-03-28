import { h, render, Fragment } from "preact";
import { load as loadYAML } from "js-yaml";
import { Alert } from "./components/alert";
import { loggedInUser, PrivateLoginLink } from "./private";

interface GithubFile {
  content: string;
  encoding: "base64" | string;
}

interface TeamMember {
  name: string;
  github: string;
  subteam?: string;
  responsibilities?: string;
  email?: string | string[];
  home_orgs?: string;
  fed?: boolean;
  aws?: string;
}

interface Alum {
  name: string;
  github: string;
}

interface TeamRoster {
  team_members: TeamMember[];
  alumni: TeamMember[];
}

function GithubLink({ username }: { username: string }) {
  return <a href={`https://github.com/${username}`}>@{username}</a>;
}

function TeamMemberRoster({ members }: { members: TeamMember[] }) {
  return (
    <ul>
      {members
        .sort(({ name: aName }, { name: bName }) => aName.localeCompare(bName))
        .map(({ name, github, email, subteam, responsibilities, fed, aws }) => (
          <li>
            <strong>{name}</strong> <GithubLink username={github} />
            <br />
            Email: {email}
            <br />
            Subteam: {subteam}
            <br />
            Responsibilities: {responsibilities}
            <br />
            Fed: {String(fed)}
            <br />
            {aws ? <>AWS: {aws}</> : undefined}
          </li>
        ))}
    </ul>
  );
}

function AlumRoster({ members }: { members: Alum[] }) {
  return (
    <ul>
      {members
        .sort(({ name: aName }, { name: bName }) => aName.localeCompare(bName))
        .map(({ name, github }) => (
          <li>
            <strong>{name}</strong> <GithubLink username={github} />
          </li>
        ))}
    </ul>
  );
}

export function loadTeam() {
  const jekyllBaseUrl = document.body.dataset.baseUrl as string;
  const currentUser = loggedInUser();

  if (currentUser) {
    const teamContainer = document.getElementById(
      "team-container"
    ) as HTMLElement;
    const alumniContainer = document.getElementById(
      "alumni-container"
    ) as HTMLElement;

    window
      .fetch(
        "https://api.github.com/repos/18f/identity-private/contents/team/team.yml",
        { headers: { Authorization: `token ${currentUser.token}` } }
      )
      .then((response) => response.json())
      .then((json: GithubFile) => {
        const { team_members: teamMembers, alumni } = loadYAML(
          atob(json.content)
        ) as TeamRoster;

        render(<TeamMemberRoster members={teamMembers} />, teamContainer);
        render(<AlumRoster members={alumni} />, alumniContainer);
      });
  } else {
    const errorContainer = document.getElementById(
      "error-container"
    ) as HTMLElement;

    render(
      <Alert heading="Error loading team roster">
        Team roster requires <PrivateLoginLink baseUrl={jekyllBaseUrl} />
      </Alert>,
      errorContainer
    );
  }
}
