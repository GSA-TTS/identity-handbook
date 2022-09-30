---
title: "Platform On-Call Guide"
description: Runbook/guide for processes/responsibilities for the on-call platform engineers.
layout: article
subcategory: How To
category: Platform
---

## Rotations

To spread the toil accross the Platform teams we have the following rotations:

| Rotation / Paging Schedule Name | Slack Handle | Slack Main Channel(s) | Coverage | Notes |
| ------------------------------- | ------------ | --------------------- | -------- | ----- |
| [Platform OnCall - Primary](#primary-on-call) | @login-platform-oncall | #login-devops / #login-events | 24/7 | Top responder for Platform issues |
| [Platform OnCall - Secondary](#secondary-on-call) | @login-platform-oncall | #login-devops / #login-events | 24/7 | 5 minute delay backup for primary |
| [Interrupts](#interrupts) | @login-platform-help | #login-platform-help | Business Hours | Developer support and toil |
| [Deployment](#deployment) | @login-platform-deployer | #login-devops | Business Hours | Release manager for identity-devops code |
| [DevTools](#devtools) | @login-devtools-oncall | #login-devops | Business Hours | GitLab and automation specific support |

## Quick Reference

* [DevOps Oncall Guide Quick Reference](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference/) -
emergency contact list and other private information
* [Incident Response Checklist]({{site.baseurl}}/articles/incident-response-checklist.html) - when an incident arises
* [Troubleshooting Quick Reference]({{site.baseurl}}/articles/troubleshooting-quick-reference.html) - when you are troubleshooting and not sure where to start 

## Handoff Boundary

All schedules rotate at 1300 (1PM) Eastern Time every Tuesday and are signaled by an automated message in #login-devops

## Roles

### Primary On-Call

Mission: Take care of production!

#### Responsibilities

* **Acknowledge pages** - Ack OpsGenie pages within 5 minutes if possible to ensure timely response and avoid rollover to secondary
* **Appropriately respond to alert** - Assess impact to end users and service providers and judge severity, acting as Incident Response reporter if appropriate
* **Check Production** - Review systems and logs for indicators of issues which are not yet monitored, or unexpected behaviors
* **Alert `@login-appdev-oncall` if production may be impacted** - Make sure they are aware anytime things are going poorly in production
* **Initiate Incident Response (IR) Process** - Act as Situation Lead/Incident Commander following the [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
* **Monitor Channels** - Keep an eye on #login-events for problems requiring response or investigation
* **Review any open PRs that have been sitting over 48 hours in identity-devops, identity-terraform, identity-base-image, or identity-cookbooks**
* **Ensure clean handoff of ongoing issues**
* **Discuss prior week's issues in Tuesday 1300ET handoff thread in #login-devops**
* **Maintain the @login-devops-oncall group**
* **Take care of your well being** - You are but one human, and the team is here for you!  Your health and relationships must take priority over on-call.  If on-call is causing harm, let the team know immediately.

#### Procedures

##### Entering

Do these as you enter on-call:
* **Update the @login-devops-oncall Slack group** - In #login-devops, click on the @login-devops-oncall link in the topic then edit the list of users to match the new primary and secondary engineers
* **Discuss recent issues with previous on-call engineer**

##### Daily

* **Review `prod-idp-workload` CloudWatch dashboard**
  * Look for errors or latency spikes
  * Look for unusual activity...
  * Improve your feeling on what "unusual" and "usual" look like by zooming out

##### Weekly

* **File PRs or issues to adjust problematic alerts or fill critical observability gaps**
  * Alert fatigue is real, so let's fight it!
  * Not being able to understand what is happening in the system is stressful, so let's improve observability!

##### Exiting

As you exit your on-call period:
* **Discuss recent issues with engineer going on-call**
* **Reflect on on-call period**:
  * Asses the stress level you experienced
  * Suggest improvements to on call process, docs, etc
* **Share in the weekly Platform rotation thread in #login-devops**

### Secondary On-Call

Mission: Support Primary!

#### Responsibilities

* **Acknowledge escalated pages**
* **Work escalated page** - Act as primary if/until issue can be handed off to primary
* **Override OpsGenie to take primary if scheduled primary is unavailable**
* **Assist with active incidents** - Provide additional technical support or offer to take Situation Lead duties
* **Help out with excess toil**
* **Offer material and psychological support to primary** - Empathize! Proactively reach out if they have experienced high stress situations or worked over 8 hours

#### Procedures

##### Daily

* **If any incident has occurred in the last 24 hours, check in with Primary OnCall**
  * How are they feeling?
  * Do they need to pass off Primary for a bit?

### Interrupts

Mission: Support the Platform's customers!

#### Responsibilities

* **Watch #login-platform-help** and assist users with Platform questions, automation, tools, and application sandboxes
* **Manage the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)**
* **Provision new users and remove offboarded users**
* **Lead AWS onboarding sessions with new users**
* **Refine automation/tools** to make things easier, safer, and requiring less context
* **Do NOT do project work!**  Go mining in our docs for things to fix if you are bored

#### Procedures

##### Entering

Do these as you enter Interrupts:

* **Update the @login-platform-help Slack handle**
* **Check in on the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)**
* **Check with outgoing Interrupts engineer** for any handoff items
* **Make sure any unprovisioned new users are invited to a future AWS onboarding session** - This should be during your rotation!

##### Daily

* **Check if anyone needs help in #login-platform-help**
* **Immediately disable anyone who has left the program but is still provisioned**
* **Work the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)**

##### Weekly

* **Schedule and hold at least one AWS onboarding session if anyone needs to onboard** - Issues on the Interrupts board should help you identify new and not yet initialized users

##### Exiting

* **Make sure [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34) is up to date**
* **Communicate in-flight work with incoming Interrupts engineer**
* **Reflect on your Interrupts experience**
  * Identify major sources of toil
  * Think about investments that could reduce/eliminate toil

### Deployment

Mission: Ship!

#### Responsibilities

* **Prepare weekly identity-devops release and deploy it** following [Release Prep Steps](https://github.com/18F/identity-devops/wiki/Runbook:-Weekly-Platform-Deployments-via-Ter

#### Procedures

See the Responsibilities above for a link to the full release and deployment process including daily tasks.

##### Entering

* **Update the @login-platform-deployer Slack handle**

### DevTools

Mission: Support GitLab and related automation

__Note - This is not currently a rotation.  We will reassess our approach to GitLab and automation support in the coming months.__

#### Responisibilities

* **Respond to problems with GitLab CI/CD**

### Schedule Overrides

To temporarily take Primary On-Call:
* Open the [DevOps On-Call Schedule](https://login-gov.app.opsgenie.com/teams/dashboard/2fbef770-e306-488e-bbe2-76e2c860a2c7/main)
* Scroll down to the Devops Primary Schedule or Devops Secondary Schedule
* Click "Add Override" and enter the team member and time range to override

## Participating in Rotations

Engineers on the Platform teams at Login.gov are expected to participate in at
least one of the rotation types every 8 weeks starting after their first 60
days on the program.  Suggested rotations:

* Interrupts - A great first rotation type for new team members and a great way
  to contribute if you are not part of On-Call rotations.
* Deployer - Another good new team member rotation or option of you are not part
  of the On-Call rotations.
* DevTools - Ideal for members of Team Mary.  Currently just a group but this may
  become a rotation.
* On-Call Primary/Secondary - After time in other rotations, and after preparing as
  described in [Are You Ready To Be On-Call?](#are-you-ready-to-be-on-call), those
  who can are urged to join this rotation.

## Are You Ready To Be On-Call?

Before going on-call for Platform ensure the following:

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
