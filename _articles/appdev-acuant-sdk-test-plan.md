---
title: "Acuant SDK Test Plan"
layout: article
description: "Pre-deploy manual test plan for the Acuant SDK"
category: AppDev
subcategory: "Deploying"
toc_h_max: 4
---

## General Information

Automated testing of the Acuant SDK, used for capturing pictures of a user's ID or face, is not
currently available. Prior to each bi-weekly deploy, Team Timnit wants to manually verify that the 
SDK is functioning as expected.

### Cadence

**When to test:** ✅

Manual testing should be done prior to the regular full deploy of IDP to `prod`. Typically we do a
full deploy twice weekly, on Tuesdays and Thursdays - see {% link _articles/appdev-deploy.md %} for
details and up-to-date cadence.

### Test Procedure

- Visit the [Environments status](https://dashboard.int.identitysandbox.gov/env) page of the
  Dashboard.
  - Under Staging, click on either the `oidc-sinatra` or the `saml-sinatra` links
    to go to a sample app.
  - Note the git sha of the idp in `staging`.
- From the sample app, under `Options > Level of Service`, select `Biometric Comparison`,
  then click `Sign in`.
- From the Login.gov sign in page, choose `Create an account`, enter your email with a modifier
  to make it unique, e.g., `first.last+yymmdd@gsa.gov`, and create your new account.
- Go through identity verification up through document/selfie capture and note any issues with the
  SDK. Things to look for may include:
  - Does the SDK start?
  - Does the SDK use the full screen?
  - Does capture happen automatically?
  - Does voice over work as expected?
  - Is your ID successfully verified?
  - Is the new feature we're are deploying working properly?


### Communications

Slack: `@login-oncall-timnit` receives a reminder, in `#login-team-timnit` on Tuesday and Thursday
mornings, to test the release prior to the day's deploy. When conducting the test, react to the
reminder with 👀 and reply in thread with:
- The mobile platform used (OS, browser, version)
- The path to document capture
  - hybrid (start on desktop, switch to phone for capture)
  - standard (start on phone)
- The git sha of the idp tested (available from the Environment status page)
- Any issues encountered!

If an issue is found, we need to work quickly to triage and determine if the problem is being
introduced in the current deploy or if it is an existing bug. If new, work with `@login-deployer`
to try and revert the breaking changes prior to deployment. If old, file a bug in Jira.
