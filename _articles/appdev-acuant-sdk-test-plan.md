---
title: "Acuant SDK Test Plan"
layout: article
description: "Pre-deploy manual test plan for the Acuant SDK"
category: AppDev
subcategory: "Deploying"
toc_h_max: 4
---

## General Information

Automated testing of the Acuant SDK, used for capturing pictures of a user's ID and face, is not
currently available. Prior to each bi-weekly deploy, Team Timnit wants to manually verify that the
SDK is functioning as expected.

### Cadence

**When to test:** ✅

Manual testing should be done prior to the regular full deploy of IdP to `prod`. Typically we do a
full deploy twice weekly, on Tuesdays and Thursdays - see
[Deploying new IdP and PKI code]({% link _articles/appdev-deploy.md %}) for
details and up-to-date cadence.

**Mock IDs:**
If you want test using a mock ID, you can access them using the link [here](https://docs.google.com/spreadsheets/d/15Npyy5Qc9gHs8d-RWvdgWciNYwGGVmur_3GLcRDpwAA/edit?gid=0#gid=0).

### Test Procedure

- Visit the [Environments status](https://portal.int.identitysandbox.gov/env) page of the
  Dashboard.
  - Under Staging, click on either the `oidc-sinatra` or the `saml-sinatra` links
    to go to a sample app.
  - Note the git sha of the IdP in `staging`.
- From the sample app, under `Options > Level of Service`, select `Biometric Comparison`,
  then click `Sign in`.
- From the Login.gov sign in page, choose `Create an account`, enter your email with a modifier
  to make it unique, e.g., `first.last+yymmdd@gsa.gov`, and create your new account.
- Using a mobile device or the hybrid handoff flow, go through identity verification up through document/selfie capture and note any issues with the
  SDK. Things to look for may include:
  - Does the SDK start?
  - Does the SDK use the full screen?
  - Does capture happen automatically?
  - Does voice over work as expected?
  - Is your ID successfully verified?
  - Is the new feature we're deploying working properly?
- Attempt to upload mismatched ID types:
  - Proceed through the identity verification flow and select `Driver's License`, but upload a `Passport`
  - Proceed through the identity verification and select `Passport` but upload a `Driver's License`
  - The expected result should be that the IDP rejects the upload and displays an error message.
- Perform a valid passport test.
  - Select `Passport` on the `Choose your ID page` and verify your identity using a `Passport`
- Test the Socure flow:
  - Lexis Nexis and Socure are typically split 50/50 in staging. If your run lands on the Lexis Nexis flow, create additional new accounts until you enter the Socure flow.
  - Once in the `Socure` flow, complete it, ensuring Socure validation passes successfully
- Complete the full Identity Verification flow (including steps after Doc Auth).
  - Previously, testing stopped after Doc Auth, but now the full Identity Verification journey must be completed.


### Communications

Slack: `@login-oncall-charity` receives a reminder, in `#login-team-charity` on Tuesday and Thursday
mornings, to test the release prior to the day's deploy (others are welcome to test as well!). When
conducting the test, react to the reminder with 👀 and reply in thread with:
- The mobile platform used (OS, browser, version)
- The path to document capture
  - hybrid (start on desktop, switch to phone for capture)
  - standard (start on phone)
- The git sha of the IdP tested (available from the Environment status page)
- Any issues encountered!

If an issue is found, we need to work quickly to triage and determine if the problem is being
introduced in the current deploy or if it is an existing bug. If new, work with `@login-deployer`
to try and revert the breaking changes prior to deployment. If old, file a bug in Jira and share
on the team's channel for visibility.
