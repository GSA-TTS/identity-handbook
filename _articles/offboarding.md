---
title: "Offboarding"
layout: article
category: Team
---
## For offboarding employee to complete

Review the [Leaving TTS page in the TTS Handbook](https://handbook.tts.gsa.gov/leaving-tts/#when-its-time-to-leave-tts) and follow the instructions there.

## For offboarding assistant to complete

- Review and share [leaving GSA/TTS guidance](https://handbook.tts.gsa.gov/leaving-tts/) with this person.
  - If this person is unable to [email their resignation letter](https://handbook.tts.gsa.gov/leaving-tts/#1-email-your-resignation-letter) for any reason you must do it on their behalf.
- If applicable, send an email to [all@login.gov](mailto:all@login.gov) announcing that this employee is leaving Login.gov
- [Create a new issue in the `identity-devops` GitHub repository using the off-boarding template](https://github.com/18F/identity-devops/issues/new?template=offboard-devops.md) and ping `@login-devops-oncall` in Slack to alert them to the new offboarding issue
- Check in `#admins-github` to ensure that GitHub access for this person has been removed (TTS `#people-ops` is usually on top of this). If this person is moving elsewhere in TTS ensure they have been removed from `identity-*` [GitHub teams](https://github.com/orgs/18F/teams/).
  - Note that CircleCI, CodeClimate, and Snyk rights are removed via GitHub integration
- [Create a ticket in the Jira AdminTasks project](https://cm-jira.usa.gov/secure/CreateIssue!default.jspa) requesting that the user be removed from the Login.gov project (and deactivated if they are no longer working for GSA).
- Use the [TTS Slack Form](https://goo.gl/forms/mKATdB9QuNo7AXVY2) to submit user modification
- [Remove user from Login.gov Google Groups](https://groups.google.com/a/gsa.gov/forum/#!myforums)
- [Remove the user from Hubspot](https://app.hubspot.com/settings/5531666/users)
- Remove UX members from GSA owned applications
  - [InVision](https://www.invisionapp.com/)
- Remove the user as admins from any dashboards
  - [login.gov dashboard](https://dashboard.int.identitysandbox.gov)
  - [search.gov dashboard](https://search.gov)
- Update [team.yml](https://github.com/18F/identity-private/blob/master/team/team.yml)
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
