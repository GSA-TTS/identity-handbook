---
title: "Offboarding"
layout: article
category: Team
---

## Full Offboarding

If a person leaves the Login.gov program they should have privileges revoked.

### For offboarding employee to complete

Review the [Leaving TTS page in the TTS Handbook](https://handbook.tts.gsa.gov/leaving-tts/#when-its-time-to-leave-tts) and follow the instructions there.

### For offboarding assistant to complete

- - Add a new JIRA Issue to the [People-Ops board](https://cm-jira.usa.gov/secure/RapidBoard.jspa?projectKey=LPO&rapidView=2861) to track completion of offboarding tasks.
  - `Create Bulk Sub Tasks` on the new issue and use the `Login.gov Offboarding Assistant Tasks` template.
- If this person is leaving GSA/TTS, review and share [leaving GSA/TTS guidance](https://handbook.tts.gsa.gov/leaving-tts/).
  - If this person is unable to [email their resignation letter](https://handbook.tts.gsa.gov/leaving-tts/#1-email-your-resignation-letter) for any reason you must do it on their behalf. **This also applies to contractors**.
- If applicable, send an email to the login.gov team announcing that this employee is leaving Login.gov
- [Create a new issue in the `identity-devops` GitHub repository using the off-boarding template](https://github.com/18F/identity-devops/issues/new?template=offboard-devops.md) and ping `@login-devops-oncall` in Slack to alert them to the new offboarding issue.  Tip: [view current AWS users](https://github.com/18F/identity-devops/blob/master/terraform/master/global/main.tf#L93)
- Check in `#admins-github` to ensure that GitHub access for this person has been removed (TTS `#people-ops` is usually on top of this). If this person is moving elsewhere in TTS ensure they have been removed from `identity-*` [GitHub teams](https://github.com/orgs/18F/teams/). Cc `@github-admins-slack` on your request.
  - Note that CircleCI, CodeClimate, and Snyk rights are removed via GitHub integration
- [Using the JIRA Portal](https://cm-jira.usa.gov/servicedesk/customer/portal/11), choose `Application Access` and request that the user be removed from the Login.gov project (and deactivated if they are no longer working for GSA).
- Use the [TTS Slack Form](https://goo.gl/forms/mKATdB9QuNo7AXVY2) to submit user modification
- Remove from [login.gov Slack groups]({{site.url}}/articles/slack.html).
- [Remove user from Login.gov Google Groups](https://groups.google.com/a/gsa.gov/forum/#!myforums)
- [Remove the user from Hubspot](https://app.hubspot.com/settings/5531666/users)
- [Remove user from Figma](https://www.figma.com/files/team/893580939040886405/Login.gov/members)
- Remove the user from the [`gsa-login-prototyping` cloud.gov org](https://dashboard.fr.cloud.gov/cloud-foundry/2oBn9LBurIXUNpfmtZCQTCHnxUM/organizations/fc240d49-f678-4325-8384-c88d92d60982/users)
- Remove the user as admins from any dashboards
  - [login.gov dashboard](https://dashboard.int.identitysandbox.gov)
  - [search.gov dashboard](https://search.gov)
- Update [team.yml](https://github.com/18F/identity-private/blob/master/team/team.yml)
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)

## Partial Offboarding

If a person leaves temporarily, for example to fill a Detail, they can have privileges temporarily suspended.

### For offboarding assistant to complete

- [Create a new issue in the `identity-devops` GitHub repository using the partial off-boarding template](https://github.com/18F/identity-devops/issues/new?template=offboard-devops-partial.md) and ping `@login-devops-oncall` in Slack to alert them to the new offboarding issue
- Remove user from [`identity-admins` GitHub team](https://github.com/orgs/18F/teams/identity-admins/members?query=)
- [Remove user from login-devops and login-security](https://groups.google.com/a/gsa.gov/forum/#!myforums)
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
