---
title: "Splunk On-Call"
description: Basic information on our on-call scheduling and alerting tool
layout: article
subcategory: How To
category: Team
---

## Purpose

Splunk On-Call provides on-call rotation scheduling and reliable alerting for
both automated and human generated events.  It is our primary emergency
notification system.

## Getting an Account and Logging In

Access can be provided for any team member with an on-call or emergency notification
need.  Ask in #login-platform-support and tag @login-platform-help if you need
access.  One of the Splunk On-Call administrators, as noted in [Services and Accounts]({% link _articles/accounts.md %})
will review your request and send you an invitation via email.

Follow the link in the email to create your account.  Use `firstname.lastname`
for your username.  Use a strong disposable password when you setup the account.

Splunk On-Call is integrated with our enterprise SSO and all further sign ins should
use SSO:

* Go to <https://portal.victorops.com/membership/#/sso> (or click the "Single Sign On" link on the main portal page
* Enter `gsa_login` as the organizational slug value
* Log in with enterprise credentials

## Teams, Rotations, Escalation Policies, and Routing Keys

* Each Splunk On-Call user is a member of one or more "Teams".  The on-call guide
  for your team will have more information on specific teams and their purposes.
  We generally organize our team membership by collecting users who will be part
  of the same set of on-call rotations and have the same on-call responsibilities.
* Each team should have one or more rotations.  Each rotation can have multiple
  "shifts".  (Example: "daytime" and "after-hours")
* Each team should have one or more escalation policies, which define who gets notified
  and how things are escalated in case no acknowledgement has been received.
* routing-keys direct incoming alerts to one or more escalation policies and are
  used by our integrations with CloudWatch and NewRelic to direct alerts appropriately.

## Integrations

Integrations are configured for the following:
* Email - Allows inbound email to trigger an incident.  Do not share these addresses
  outside of GSA!  (You may add the address to a Google Group if external paging
  is required.)
* CloudWatch - Allows CloudWatch to use SNS to raise an incident.  Used by our [splunk_oncall_sns Terraform module](https://github.com/18F/identity-devops/tree/main/terraform/modules/splunk_oncall_sns).
* NewRelic - Allows NewRelic to use Splunk On-Call as an alert destination.  Used by our [newrelic Terraform module](https://github.com/18F/identity-devops/tree/main/terraform/modules/newrelic).

## Mobile App

You may choose to use the Splunk On-Call mobile app on your GFE iPhone.  Download
the app from the AppStore, open, and log in using the "Sign in with Enterprise SSO..."
option.

The app can be used to see your schedule and manage alerts for your team as well as others.
You can adjust notifications (including changing notification sounds) in the
"Notifications" section of the menu.

## Support and Documentation

* Ask in #login-platform-support if you have a problem with Splunk On-Call
* You can contact Splunk On-Call support using the "Chat with an Expert" link
  on the bottom right of the screen in the Splunk On-Call portal
* [Splunk On-Call Knowledge Base](https://help.victorops.com/)
* [Login.gov Splunk On-Call Test Notes](https://docs.google.com/document/d/1Eb2V9D5Rl4eMpQgrleNbU9OShzg8Ql_25_NDvdZdoHU/edit#heading=h.80oxhhhdg1xe)

