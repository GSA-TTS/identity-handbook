---
title: "AppDev Oncall"
description: "Responsibilities and runbook for AppDev oncall"
layout: article
category: AppDev
subcategory: Oncall
---

## Prerequisites

Any engineer should be able to be oncall and we encourage all engineers to join the rotation to help
distribute the load. Before being added to the oncall rotation, an engineer must have these prerequisites:

1. Access to AWS Incident Manager
2. Access to NewRelic
3. Access to Salesforce
4. Deploy access to production
5. SSM access to production
6. Join the #login-situation channel

## AWS Incident Manager

See [AWS Incident Manager]({% link _articles/platform-aws-incident-manager.md %}) for more on our paging system.

## Rotations

1. appdev-primary
2. appdev-secondary

### Logistics

* Expected frequency is about once/every two months but depends on the number of engineers in the rotation.
* If an employee is unable to cover a specific time frame during their rotation schedule they will need to coordinate with another employee to ensure coverage for the time frame.
* If primary on-call has not responded within 15 min, secondary on-call will be paged.
* Every effort will be made to ensure that the same person does not work on the same holidays.

## Emergency Contacts

Your first emergency contact should always be `@login-devops-oncall` - Make sure they are aware anytime things are going poorly.

For Login.gov and vendor emergency contact information see [Emergency Contacts](https://gitlab.login.gov/lg/identity-devops/-/wikis/On-Call-Guide-Quick-Reference#emergency-contacts)

## Handoff

The AppDev Rotation hands off every **Monday at 1pm Eastern (10am Pacific)**.

Handoffs on holidays will be managed on a case-by-case basis.

During hand off:

* Update the `@login-appdev-oncall` Slack handle with the new team
* Update the `@login-support-escalation` Slack handle with the new team
* Transfer knowledge of any outstanding issues or bugs from the outgoing team to the incoming team


## Responsibilities

### Check NewRelic

Each day, check NewRelic for server and browser errors over the last 24h in `prod` and `staging` (there is a Slack reminder in `#login-appdev` for this)
- [NewRelic Server Errors](https://one.newrelic.com/launcher/nr1-core.explorer?platform[accountId]=1376370&platform[timeRange][duration]=43200000&pane=eyJiYXJjaGFydCI6ImJhcmNoYXJ0IiwidG9wRmFjZXQiOiJ0cmFuc2FjdGlvblVpTmFtZSIsInBhZ2UiOiJ0YWJsZSIsIm5lcmRsZXRJZCI6ImVycm9ycy11aS5vdmVydmlldyIsImVudGl0eUlkIjoiTVRNM05qTTNNSHhCVUUxOFFWQlFURWxEUVZSSlQwNThOVEl4TXpZNE5UZyJ9&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwiZW50aXR5SWQiOiJNVE0zTmpNM01IeEJVRTE4UVZCUVRFbERRVlJKVDA1OE5USXhNelk0TlRnIiwic2VsZWN0ZWROZXJkbGV0Ijp7Im5lcmRsZXRJZCI6ImVycm9ycy11aS5vdmVydmlldyJ9fQ)
- [NewRelic Browser Errors](https://one.newrelic.com/launcher/nr1-core.explorer?pane=eyJuZXJkbGV0SWQiOiJicm93c2VyLW5yMS5icm93c2VyLWpzLWVycm9ycyIsImVudGl0eUlkIjoiTVRNM05qTTNNSHhDVWs5WFUwVlNmRUZRVUV4SlEwRlVTVTlPZkRVeU1qRTBNelk0In0=&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwiZW50aXR5SWQiOiJNVE0zTmpNM01IeENVazlYVTBWU2ZFRlFVRXhKUTBGVVNVOU9mRFV5TWpFME16WTQiLCJzZWxlY3RlZE5lcmRsZXQiOnsibmVyZGxldElkIjoiYnJvd3Nlci1ucjEuYnJvd3Nlci1qcy1lcnJvcnMifX0=&platform[accountId]=1376370&platform[timeRange][duration]=43200000&platform[$isFallbackTimeRange]=false)

We want to get as many errors fixed as possible, so make sure JIRA tickets are filed all errors in NewRelic. Search JIRA to check that tickets have or haven't been filed already.

### Fix Vulnerabilities

Throughout the week, check for automated vulnerability pull requests and try to get them merged. These links to go GitHub pull request filters, search within these for ones to `identity-` repos:

* [snyk-bot][snyk]
* [dependabot][dependabot]

[snyk]: https://github.com/search?q=user%3A18F+user%3AGSA+is%3Aopen+archived%3Afalse+author%3Asnyk-bot&type=pullrequests
[dependabot]: https://github.com/search?o=asc&q=user%3A18F+user%3AGSA+author%3Aapp%2Fdependabot+is%3Aopen+archived%3Afalse&s=created&type=pullrequests

###  Inspector General (IG) Requests

* Check the [Guide for responding to IG requests][ig-requests]
* Requests will be forwarded via email.
* It is expected that the AppDev who receives the request will be the one to complete it, even if it extends beyond the on-call week.

[ig-requests]: https://gitlab.login.gov/lg-people/security/login-security-handbook/-/wikis/resources/Runbooks/Inspector-General-Data-Requests

### Resetting User Passwords

On rare occasions partners will ask us to reset passwords for accounts. In a Rails console (with write access), run:

```ruby
emails = %w[email1@example.com email2@example.com]

emails.each do |email|
  user = User.find_with_email(email)
  if user
    ResetUserPassword.new(user: user).call
  else
    puts "no user for #{email}"
  end
end
```

### Expiring PKI Certs

![Screenshot of expiring PKI Slack alert]({{ site.baseurl }}/images/slack-pki-cert-alert.jpg)

If you see a Slack alert like this, it means that a certificate used to verify PIV/CAC cards will expire within 30 days.

Refer to [Troubleshooting expiring PIV/CAC certs]({% link _articles/troubleshooting-expiring-pivcac.md %}) for guidance on replacing an expiring certificate.

## Response Times

SecOps Incident Response Guide located [here]({% link _articles/incident-response-guide.md %})

Things to consider when assessing severity:
* If PII is involved
* The environment it is in and status of partner(s) impacted
* Number of users impacted
* Whether the issue is in a primary or secondary flow

### High severity
Involves an active (launched) partner in Production environment

* High-sev incidents successfully compromise the confidentiality/integrity of Personally Identifiable Information (PII), impact the availability of services for a large number of customers, or have significant financial impact.

**OR**

* An active (launched) Login.gov partner is reporting that no user can authenticate or proof.
* Required to be addressed immediately and ongoing until resolved.

### Medium severity

* Med-sev incidents represent attempts (possibly un- or not-yet-successful) at breaching PII, or those with limited availability/financial impact.

**OR**

* An active (Launched) Login.gov partner is reporting that some users are not able to authenticate or proof in production.

**OR**

* A partner is reporting that the sandbox/INT environment is down and no user can authenticate or proof.
* Will be addressed immediately during business hours
* Responders should attempt to consult stakeholders before causing downtime, but may proceed without them if they can’t be contacted in a reasonable time-frame.

### Low Severity
* Low-sev incidents don’t affect PII, and have no availability or financial impact. A new partner recently deployed to production is launching their application after hours and reporting that users cannot authenticate or proof. A partner is reporting that some users are not able to authenticate or proof in sandbox/INT
* Responders should avoid service degradation unless stakeholders agree.
* Will be addressed in the normal course of business and prioritized against other Jira issues pending (or potentially added to the backlog for future).

### Inspector General (IG) Requests

* Generally expected to be answered in five business days.
* More complicated requests may take longer; expected turnaround should be communicated.
* On occasion, requests are deemed urgent and should be made a priority.

## Internal Login.gov on-call guidance

Additional on-call guidance, including time in-lieu is available in the [Internal Login.gov on-call guidance Google Doc](https://docs.google.com/document/d/1mOU3rnBJUKiMNFnz-odudmzNCo06CoKsAlCX1ZrK4ZY/edit#)
