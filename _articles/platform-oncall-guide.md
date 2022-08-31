---
title: "Platform On-Call Guide"
description: Runbook/guide for processes/responsibilities for the on-call platform engineers.
layout: article
subcategory: How To
category: Platform
---

## Quick Reference

* [DevOps Oncall Guide Quick Reference](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference/) -
emergency contact list and other private information
* [Incident Response Checklist]({{site.baseurl}}/articles/incident-response-checklist.html) - when an incident arises
* [Troubleshooting Quick Reference]({{site.baseurl}}/articles/troubleshooting-quick-reference.html) - when you are troubleshooting and not sure where to start 

## Responsibilities

### Primary Responsibilities

* **Acknowledge pages** - Ack OpsGenie pages within 5 minutes if possible to ensure timely response and avoid rollover to secondary
* **Appropriately respond to alert** - Assess impact to end users and service providers and judge severity, acting as Incident Response reporter if appropriate
* **Check Production** - Review systems and logs for indicators of issues which are not yet monitored, or unexpected behaviors
* **Alert `@login-appdev-oncall` if production may be impacted** - Make sure they are aware anytime things are going poorly in production
* **Initiate Incident Response (IR)** - Based on [Incident Severities]({% link _articles/secops-incident-response-guide.md %}#incident-severities)
  * **High Severity** - Act immediately 24/7 and see through to remediation or confirmed handoff to other team members
  * **Medium Severity** - During business hours as a top priority
  * **Low Severity** - During business hours and yielding for release and other duties
* **Initiate Incident Response (IR) Process** - Act as Situation Lead/Incident Commander following the [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
* **Handle interrupts** using the [LG Platform - Interrupts board](https://github.com/orgs/18F/projects/34)
  * Administrative tasks (onboard/offboard/change access)
  * Urgent product, app, or ops team requests to @login-devops-oncall
* **Handle maintenance tasks**
  * @ folks in #login-events who have expiring AWS passwords or access keys
  * Certificate rotation
  * Regular cleanup
* **Monitor Channels** - Keep an eye on #login-events and #login-secops-plan for items that may impact DevOps
* **Review any open PRs that have been sitting over 48 hours in identity-devops, identity-terraform, identity-base-image, or identity-cookbooks**
* **Ensure clean handoff of ongoing issues**
* **Discuss prior week's issues in Tuesday 1300ET handoff thread in #login-devops**
* **Maintain the @login-devops-oncall group**
* **Take care of your well being** - You are but one human, and the team is here for you!  Your health and relationships must take priority over on-call.  If on-call is causing harm, let the team know immediately.

### Secondary Responsibilities

* **Acknowledge escalated pages**
* **Work escalated page** - Act as primary if/until issue can be handed off to primary
* **Override OpsGenie to take primary if scheduled primary is unavailable**
* **Assist with active incidents** - Provide additional technical support or offer to take Situation Lead duties
* **Help out with excess toil**
* **Offer material and psychological support to primary** - Empathize! Proactively reach out if they have experienced high stress situations or worked over 8 hours

## Procedure

### On-Call Boundary

The normal schedule rotates at 1300 (1PM) Eastern Time every Tuesday.

### Entering On-Call

Do these as you enter on-call:
* **Update the @login-devops-oncall Slack group** - In #login-devops, click on the @login-devops-oncall link in the topic then edit the list of users to match the new primary and secondary engineers
* **Discuss recent issues with previous on-call engineer**

### One-Time Duties

Do these at least ONE time while on call:
* **Review this document - FIX ANY ERRORS!**
* **Revise or delete at least one existing document**

### Daily Duties

* **Review APM data for IdP prod** - Look for errors or latency spikes
* **PR and AC review**
* **Toil... toil... toil...**

### Exiting On-Call

As you exit your on-call period:
* **Discuss recent issues with engineer going on-call**
* **Reflect on on-call period**:
  * Estimate % of time spent on toil
  * Identify major sources of toil
  * Think about investments that could reduce/eliminate toil
  * Make issues for toil clearly requiring "coding away"
  * Asses the stress level you experienced
  * Suggest improvements to on call process, docs, etc
* **Share in the weekly DevOps rotation thread in #login-devops**

### Schedule Override

To temporarily take on-call:
* Open the [DevOps On-Call Schedule](https://login-gov.app.opsgenie.com/teams/dashboard/2fbef770-e306-488e-bbe2-76e2c860a2c7/main)
* Scroll down to the Devops Primary Schedule or Devops Secondary Schedule
* Click "Add Override" and enter the team member and time range to override

## Are You Ready?

Before going on-call for Identity DevOps ensure the following:

* Access [AWS accounts]({{site.baseurl}}/articles/platform-aws-accounts-and-roles.html)
* Comfortable with sandbox tasks (Terraform plan and apply, navigating instances)
* Comfortable navigating APM and Infrastructure areas in NewRelic
* Comfortable reviewing logs in AWS CloudWatch and/or with cw CLI tool
* Shadowed full set of deploys: `dev`, `int`, `staging`, and `prod` application and other platform code
* Reviewed [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
* Reviewed [past postmortems](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui)
* Joined [#identity-situation](https://gsa-tts.slack.com/messages/login-situation/) channel
* Participated in bi-weekly Contingency Plan Training Wargames
* Participated in "Klaxon" (if sessions are running)
* Joined [identity-devops Hangout](https://chat.google.com/room/AAAAJIpl9Oo) group (* In case of Slack outage)
* Able to SSM into production instances
* OpsGenie app installed on phone and signed in
* [OpsGenie profile and notifications](https://login-gov.app.opsgenie.com/settings/user/profile) configured
  * Suggested notification for New Alert:
    * Mobile App - Immediately
    * Email - Immediately
    * SMS - After 3 minutes
    * Call - After 4 minutes
  * Set call notification for "Schedule Start/End" (*This will also give you active voice for the month so you don't lose your phone)
* Connect your OpsGenie and Slack accounts:
  * In Slack, enter `/genie connect`
  * Click the link
  * Confirm
  * Use `/genie help` to get started or see the [OpsGenie - Slack Integration Docs](https://docs.opsgenie.com/docs/slack-app-integration)
* Created test alarm in OpsGenie to verify notification works (*Please ack before 5 minutes to avoid notifying secondary)
* Created and tested GSA email IdP account with SMS and PIV enabled in:
  * `int`
  * `staging`
  * `prod`
* FEELING READY? You got this.

## Additional Resources

* [SRE Handbook - Being On-Call](https://landing.google.com/sre/sre-book/chapters/being-on-call/)
* [The On-Call Handbook](https://github.com/alicegoldfuss/oncall-handbook)
