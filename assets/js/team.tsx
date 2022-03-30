import { h, render, Fragment } from "preact";
import { load as loadYAML } from "js-yaml";
import { createPortal } from "preact/compat";
import { useQuery } from "preact-fetching";
import { Alert } from "./components/alert";
import { PrivateLoginLink, useCurrentUser } from "./private";
import { fetchGitHubFile, isGithubFile } from "./github";
import { AnchorLink } from "./components/anchor-link";
import { SidenavWithWrapper } from "./components/sidenav";

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
          <li key={github}>
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
          <li key={github}>
            <strong>{name}</strong> <GithubLink username={github} />
          </li>
        ))}
    </ul>
  );
}

const EMPTY_DATA = { teamMembers: [], alumni: [] };

function Rosters({ nav }: { nav: HTMLElement }) {
  const [currentUser] = useCurrentUser();

  const { data } = useQuery("team.yml", () => {
    if (!currentUser) {
      return EMPTY_DATA;
    }

    return fetchGitHubFile({
      token: currentUser.token,
      repo: "18f/identity-private",
      path: "team/team.yml",
    }).then((file) => {
      if (!isGithubFile(file)) {
        return EMPTY_DATA;
      }
      const { team_members: teamMembers, alumni } = loadYAML(
        atob(file.content)
      ) as TeamRoster;

      return { teamMembers, alumni };
    });
  });

  return (
    <>
      <h3>
        Current Team Members <AnchorLink slug="current-team-members" />
      </h3>
      {!!data?.teamMembers?.length && (
        <TeamMemberRoster members={data.teamMembers} />
      )}
      <h3>
        Alumni <AnchorLink slug="alumni" />
      </h3>
      {!!data?.alumni?.length && <AlumRoster members={data.alumni} />}
      {createPortal(
        <SidenavWithWrapper navigation={["Current Team Members", "Alumni"]} />,
        nav
      )}
    </>
  );
}

function TeamPage({ nav }: { nav: HTMLElement }) {
  const [currentUser] = useCurrentUser();

  if (currentUser) {
    return <Rosters nav={nav} />;
  }
  return (
    <Alert heading="Error loading team roster">
      Team roster requires <PrivateLoginLink />
    </Alert>
  );
}

export function loadTeam() {
  const container = document.getElementById("team-container") as HTMLElement;
  const nav = document.getElementById("sidenav-wrapper") as HTMLElement;

  render(<TeamPage nav={nav} />, container);
}
