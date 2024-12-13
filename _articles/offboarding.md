---
title: "Offboarding"
layout: article
category: Team
subcategory: People Ops
---

## Full Offboarding

If a person leaves the Login.gov program they should have privileges revoked.

### For offboarding employee to complete

Review the [Leaving TTS page in the TTS Handbook](https://handbook.tts.gsa.gov/leaving-tts/#when-its-time-to-leave-tts) and follow the instructions there.

### For offboarding assistant to complete

- Create an issue in the [Interrupts project in GitLab](https://gitlab.login.gov/lg-people/platform/interrupts/-/issues) using the `offboard-devops` template and ping `@login-devops-oncall` in Slack to alert them to the new offboarding issue.  Tip: [view current AWS users](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L93)
- Check in `#admins-github` to ensure that GitHub access for this person has been removed (TTS `#people-ops` is usually on top of this). If this person is moving elsewhere in TTS ensure they have been removed from `identity-*` [18F teams](https://github.com/orgs/18F/teams/), [GSA-TTS teams](https://github.com/orgs/GSA-TTS/teams/). Cc `@github-admins-slack` on your request.
  - Note that CircleCI, CodeClimate, and Snyk rights are removed via GitHub integration
- [Using the JIRA Portal](https://cm-jira.usa.gov/servicedesk/customer/portal/11), choose `Application Access` and request that the user be removed from the Login.gov project (and deactivated if they are no longer working for GSA).
- Remove from [Login.gov Slack groups]({% link _articles/slack.md %}).
- Remove from [all accounts]({% link _articles/accounts.md %})
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)

## Partial Offboarding

If a person leaves temporarily, for example to fill a Detail, they can have privileges temporarily suspended.

### For offboarding assistant to complete

- Work with the devops team to remove AWS access (this is moving from GitHub to GitLab) and ping `@login-devops-oncall` in Slack to alert them to the new offboarding issue
- Remove user from [`identity-admins` GitHub team](https://github.com/orgs/18F/teams/identity-admins/members?query=)
- [Remove user from login-devops and login-security](https://groups.google.com/a/gsa.gov/forum/#!myforums)
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
