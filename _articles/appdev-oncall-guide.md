---
title: "AppDev Oncall"
description: "Responsibilities and runbook for AppDev oncall"
layout: article
category: AppDev
---

## Prerequisiets

Any engineer should be able to be oncall and we encourage all engineers to join the rotation to help
distribute the load. Before being added to the oncall rotation, an engineer must have these prerequisites:

1. Access to OpsGenie
2. Deploy access to production
3. SSM access to production
4. Join #identity-situation channel and #login-partnerships


## OpsGenie Team & Rotations

For OpsGenie access, ask Mo and the devops team.

Team: [End User](https://login-gov.app.opsgenie.com/teams/dashboard/22edb9cb-3110-4494-9f02-db0243780189/members)

Rotations:

1. [Primary Oncall ("End-User Primary")](https://login-gov.app.opsgenie.com/settings/schedule/detail/142b8527-8ef6-4d9d-b81e-24b45d0499ba)
2. [Secondary Oncall ("End-User Secondary")](https://login-gov.app.opsgenie.com/settings/schedule/detail/1271f41d-aa0c-4a3e-86aa-23162ab5fc9d)

## Handoff

The AppDev Rotation hands off every **Monday at 12pm Eastern (9am Pacific)**.

When handing off:

1. Update the `@login-appdev-oncall` Slack handle to be the new person

The outgoing oncall person should let the incoming person know about any outstanding issues or bugs

## Responsibilities

1. Each day, check NewRelic for server and browser errors over the last 24h in `prod` and `staging` (there is a Slack reminder in `#login-appdev` for this)
    - [NewRelic Server Errors](https://one.newrelic.com/launcher/nr1-core.explorer?platform[accountId]=1376370&platform[timeRange][duration]=43200000&pane=eyJiYXJjaGFydCI6ImJhcmNoYXJ0IiwidG9wRmFjZXQiOiJ0cmFuc2FjdGlvblVpTmFtZSIsInBhZ2UiOiJ0YWJsZSIsIm5lcmRsZXRJZCI6ImVycm9ycy11aS5vdmVydmlldyIsImVudGl0eUlkIjoiTVRNM05qTTNNSHhCVUUxOFFWQlFURWxEUVZSSlQwNThOVEl4TXpZNE5UZyJ9&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwiZW50aXR5SWQiOiJNVE0zTmpNM01IeEJVRTE4UVZCUVRFbERRVlJKVDA1OE5USXhNelk0TlRnIiwic2VsZWN0ZWROZXJkbGV0Ijp7Im5lcmRsZXRJZCI6ImVycm9ycy11aS5vdmVydmlldyJ9fQ)
    - [NewRelic Browser Errors](https://one.newrelic.com/launcher/nr1-core.explorer?pane=eyJuZXJkbGV0SWQiOiJicm93c2VyLW5yMS5icm93c2VyLWpzLWVycm9ycyIsImVudGl0eUlkIjoiTVRNM05qTTNNSHhDVWs5WFUwVlNmRUZRVUV4SlEwRlVTVTlPZkRVeU1qRTBNelk0In0=&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwiZW50aXR5SWQiOiJNVE0zTmpNM01IeENVazlYVTBWU2ZFRlFVRXhKUTBGVVNVOU9mRFV5TWpFME16WTQiLCJzZWxlY3RlZE5lcmRsZXQiOnsibmVyZGxldElkIjoiYnJvd3Nlci1ucjEuYnJvd3Nlci1qcy1lcnJvcnMifX0=&platform[accountId]=1376370&platform[timeRange][duration]=43200000&platform[$isFallbackTimeRange]=false)

2. Throughout the week, check for automated vulnerability pull requests and try to get them merged. These links to go GitHub pull request filters, search within these for ones to `identity-` repos:

    * [synk-bot][snyk]
    * [dependabot][dependabot]

[snyk]: https://github.com/search?q=user%3A18F+user%3AGSA+is%3Aopen+archived%3Afalse+author%3Asnyk-bot&type=Issues
[dependabot]: https://github.com/search?o=asc&q=user%3A18F+user%3AGSA+author%3Aapp%2Fdependabot+is%3Aopen+archived%3Afalse&s=created&type=Issues

3. Inspector General (IG) Requests
   * Guide for responding to IG requests can be found [here](https://github.com/18F/identity-security-private/wiki/%5BWIP%5D-Responding-to-IG-Data-Requests)
   * Requests will be forwarded via email.
   * It is expected that the AppDev who receives the request will be the one to complete it, even if it extends beyond the on-call week.

## Response Times

SecOps Incident Response Guide located [here](https://handbook.login.gov/articles/secops-incident-response-guide.html)

Things to consider when assessing severity:
  * If PII is involved
  * The environment it is in and status of partner(s) impacted
  * Number of users impacted
  * Whether the issue is in a primary or secondary flow

1. High severity - involves an active (launched) partner in Production environment
    a. High-sev incidents successfully compromise the confidentiality/integrity of Personally Identifiable Information (PII), impact the availability of services for a large number of customers, or have significant financial impact.

    -OR-

    An active (launched) login.gov partner is reporting that no user can authenticate or proof.

    b. Required to be addressed immediately and ongoing until resolved.
2. Medium severity
    a. Med-sev incidents represent attempts (possibly un- or not-yet-successful) at breaching PII, or those with limited availability/financial impact.
    -OR-
    An active (Launched) login.gov partner is reporting that some users are not able to authenticate or proof in production.
    -OR-
    A partner is reporting that the sandbox/INT environment is down and no user can authenticate or proof.

    b. Will be addressed immediately during business hours

    c. Responders should attempt to consult stakeholders before causing downtime, but may proceed without them if they can’t be contacted in a reasonable time-frame.

3. Low Severity  
    a. Low-sev incidents don’t affect PII, and have no availability or financial impact.
    A new partner recently deployed to production is launching their application after hours and reporting that users cannot authenticate or proof.
    A partner is reporting that some users are not able to authenticate or proof in sandbox/INT

    b. Responders should avoid service degradation unless stakeholders agree.
    c. Will be addressed in the normal course of business and prioritized against other Jira issues pending (or potentially added to the backlog for future).

4. Inspector General (IG) Requests
    a. Generally expected to be answered in five business days.
    b. More complicated requests may take longer; expected turnaround should be communicated.
    c. On occasion, requests are deemed urgent and should be made a priority.
