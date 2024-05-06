---
title: "Platform On-Call Guide"
description: Runbook/guide for rotations/responsibilities for the Login.gov Platform engineering teams.
layout: article
subcategory: How To
category: Platform
---

## Rotations

To help balance the different workloads across the Login.gov Platform teams, we have multiple 'oncall'/help roles with weekly Rotation schedules. This allows us to provide our customers (primarily the AppDev engineers) with timely and comprehensive assistance, and to help strengthen our teams' knowledge base and comfort with the various tasks and responsibilities involved in the Platform teams' work.

### Schedules

| Rotation / Paging Schedule Name                   | Slack Handle             | Slack Main Channel(s)         | Coverage       | Notes                                    |
| -------------------------------                   | ------------             | ---------------------         | --------       | -----                                    |
| [Platform OnCall - Primary](#primary-on-call)     | @login-platform-oncall   | [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)** / [`#login-events`](https://gsa-tts.slack.com/archives/C42TZ3K5H) | 24/7           | Top responder for Platform issues        |
| [Platform OnCall - Secondary](#secondary-on-call) | @login-platform-oncall   | [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)** / [`#login-events`](https://gsa-tts.slack.com/archives/C42TZ3K5H) | 24/7           | 5 minute delay backup for primary        |
| [Interrupts](#interrupts)                         | @login-platform-help     | [`#login-platform-help`](https://gsa-tts.slack.com/archives/CMW9H0RFX)          | Business Hours | Developer support and toil               |
| [Deployment](#deployment)                         | @login-platform-deployer | [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)**                 | Business Hours | Release manager for identity-devops code |
| [DevTools](#devtools)                             | @login-devtools-oncall   | [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)**                 | Business Hours | GitLab and automation specific support   |

### Handoff Boundary

All schedules rotate at 1300 (1PM) Eastern Time every Tuesday, and are signaled by an automated message in the [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)** Slack channel, e.g.:

![Screenshot of weekly Slack message for Platform rotation handoffs]({{ site.baseurl }}/images/oncall-rotation-slack-weekly.png)

## Roles

### Primary On-Call

Mission: Take care of production!

#### Quick Reference

* [Oncall Guide Quick Reference](https://gitlab.login.gov/lg/identity-devops/-/wikis/On-Call-Guide-Quick-Reference/) -
emergency contact list and other private information
* [Incident Response Checklist]({{site.baseurl}}/articles/incident-response-checklist.html) - when an incident arises
* [Troubleshooting Quick Reference]({{site.baseurl}}/articles/troubleshooting-quick-reference.html) - when you are troubleshooting and not sure where to start
* [Platform Rotations in Splunk On-Call](https://portal.victorops.com/dash/gsa_login#/team/team-oMJ7AAPwdFSwsMJc/rotations) - to check who is on call

#### Responsibilities

* **Acknowledge pages** - ACK Splunk On-Call pages within 5 minutes (if possible) to ensure a timely response and to avoid rollover to the Secondary On-Call
* **Appropriately respond to alerts** - Assess an alert's impact to end users and service providers and judge severity, acting as Incident Response reporter/Situation Lead if appropriate
* **Check production (`prod`) environment** - Review systems and logs for indicators of issues which are not yet monitored, or unexpected behaviors
* **Alert `@login-appdev-oncall` if production may be impacted** - Make sure they are aware anytime things are going poorly in production
* **Initiate Incident Response (IR) process** - Act as Situation Lead/Incident Commander following the [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
* **Monitor Channels** - Keep an eye on [`#login-events`](https://gsa-tts.slack.com/archives/C42TZ3K5H) for problems requiring response or investigation
* **Review any open PRs that have been sitting over 48 hours in [`identity-devops`](https://github.com/18F/identity-devops/pulls), [`identity-terraform`](https://github.com/18F/identity-terraform/pulls), [`identity-base-image`](https://github.com/18F/identity-base-image/pulls), or [`identity-cookbooks`](https://github.com/18F/identity-cookbooks/pulls)**
* **Ensure clean handoff of ongoing issues** - Review and update as is appropriate in the [LG Platform - Interrupts board](https://github.com/orgs/18F/projects/34)
* **Discuss prior week's issues in Tuesday 1300ET handoff thread in [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)****
* **Maintain the `@login-devops-oncall` group** - Update the handle at the time of the weekly Handoff Boundary
* **Take care of your well being** - You are but one human, and the team is here for you! Your health and relationships must take priority over on-call responsibilities. If being on-call is causing harm, let the team know immediately.

#### Procedures

##### Entering

Do these as you enter the Primary On-Call rotation:
1. **Update the `@login-devops-oncall` Slack group handle** - In [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49), click on `@login-devops-oncall` in the channel topic, and then edit the list of users to match the new Primary and Seconday On-Call engineers, as per [the schedule in Splunk On-Call](https://portal.victorops.com/dash/gsa_login#/team/team-oMJ7AAPwdFSwsMJc/rotations)
2. **Discuss recent issues with previous Primary On-Call engineer**, if any

##### Daily

* **Review the [`prod-idp-workload` CloudWatch dashboard](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards:name=prod-idp-workload)**
  * Look for errors, latency spikes, or any other unusual activity
  * Improve your sense of what "unusual" and "usual" events look like by zooming out

##### Weekly

* **[Open PRs or track issues in `identity-devops`](https://github.com/18F/identity-devops/) to adjust problematic alerts or fill critical observability gaps**
  * Alert fatigue is real, so let's fight it!
  * Not being able to understand what is happening in the system is stressful, so let's improve observability!

##### Exiting

As you exit your Primary On-Call period:
1. **Discuss recent issues with the incoming Primary On-Call engineer**
2. **Reflect on this On-Call period**:
  * Asses the stress level you experienced
  * Suggest improvements to on call process, docs, etc
3. **Share your experience(s) in the weekly Platform Rotation Handoff Boundary message thread in [`#login-devops`](https://gsa-tts.slack.com/archives/C16RSBG49)****

### Secondary On-Call

Mission: Support the Primary On-Call engineer!

#### Responsibilities

* **Acknowledge and work on escalated pages** - ACK pages that Primary On-Call is unable to reach in initial 5-minute period
* **[Override Splunk On-Call schedule](https://portal.victorops.com/dash/gsa_login#/team/team-oMJ7AAPwdFSwsMJc/scheduled-overrides) to act as Primary On-Call if scheduled Primary is unavailable**
* **Assist with active incidents** - Provide additional technical support or offer to take Situation Lead duties
* **Help out with excess toil** - Assist the Interrupts engineer if necessary
* **Offer material and psychological support to Primary** - Empathize! Proactively reach out if they have experienced high stress situations or worked over 8 hours without any breaks

#### Procedures

##### Daily

* **If any incident has occurred in the last 24 hours, check in with Primary On-Call engineer:**
  * How are they feeling?
  * Do they need to pass off Primary for a bit?

### Interrupts

Mission: Support the Login.gov Platform's customers!

#### Quick Reference

In addition to the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34) on GitHub, the following `identity-devops` wiki pages are helpful for most Interrupts responsibilities:

* [Setting Up your Login.gov Infrastructure Configuration](https://gitlab.login.gov/lg/identity-devops/-/wikis/Setting-Up-your-Login.gov-Infrastructure-Configuration)
* [Setting Up AWS Vault](https://gitlab.login.gov/lg/identity-devops/-/wikis/Setting-Up-AWS-Vault)
* [Building a Personal Sandbox Environment](https://gitlab.login.gov/lg/identity-devops/-/wikis/Building-a-Personal-Sandbox-Environment)
* [Common Infrastructure Commands and Shortcuts](https://gitlab.login.gov/lg/identity-devops/-/wikis/Common-Infrastructure-Commands-and-Shortcuts)
* [IAM Configurations](https://gitlab.login.gov/lg/identity-devops/-/wikis/IAM-Configurations) - for on/offboarding AWS IAM users
* [Making Changes via Terraform](https://gitlab.login.gov/lg/identity-devops/-/wikis/Making-Changes-via-Terraform) - for troubleshooting Terraform deployment issues

#### Responsibilities

* **Watch the [`#login-platform-help`](https://gsa-tts.slack.com/archives/CMW9H0RFX) Slack channel** - Assist users with Platform questions, automation, tools, and application sandbox troubleshooting
* **Manage the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)**
* **Provision new users and remove offboarded users** - Self-assign open Onboarding and Offboarding issues in [`identity-devops`](https://github.com/18F/identity-devops/issues?q=is%3Aissue+offboard+is%3Aopen)
* **Lead AWS onboarding sessions with new users** - Attend and lead the bi-weekly AWS Onboarding Time meeting Mondays at 1630 (4:30PM) Eastern Time
* **Refine automation/tools** - Make things easier, safer, and requiring less context
* **Do NOT do project work!** - Go mining in our docs for things to fix if you are bored!

#### Procedures

##### Entering

Do these as you enter Interrupts:

* **Update the `@login-platform-help` Slack group handle**
* **Check in on the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)**
* **Check with outgoing Interrupts engineer** - Review any notable handoff items
* **Make sure any un-provisioned new users are invited to a future AWS Onboarding Time session** - This should be done during your rotation!

##### Daily

* **Check if anyone needs help in [`#login-platform-help`](https://gsa-tts.slack.com/archives/CMW9H0RFX)**
* **Immediately disable anyone who has left the program but is still provisioned** - Additionally, remove `prod` access for anyone who will be leaving the program within the week
* **Work the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34)** - Update issue Status and add notes as is appropriate

##### Weekly

* **Host at least one AWS Onboarding Time session if anyone needs to onboard with AWS Access** - Issues on the [Interrupts board](https://github.com/orgs/18F/projects/34) / in [`identity-devops`](https://github.com/18F/identity-devops/issues?q=is%3Aissue+offboard+is%3Aopen) should help you identify new and not yet initialized users

##### Exiting

* **Make sure the [LG Platform: Interrupts board](https://github.com/orgs/18F/projects/34) is up to date**
* **Communicate in-flight work with incoming Interrupts engineer** - Review any notable handoff items
* **Reflect on your Interrupts rotation experience**
  * Identify major sources of toil
  * Think about investments that could reduce/eliminate toil

### Deployment

Mission: Ship!

#### Quick Reference

* [Runbook: Weekly Platform Deployments via Terraform](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Weekly-Platform-Deployments)
* [Baking New AWS AMI Images](https://gitlab.login.gov/lg/identity-devops/-/wikis/Baking-New-AWS-AMI-Images)

#### Responsibilities

* **Prepare weekly `identity-devops` release and deploy it** following the [Weekly Platform Deployments guide](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Weekly-Platform-Deployments#release-prep)

#### Procedures

See the Responsibilities above for a link to the full release and deployment process including daily tasks.

##### Entering

* **Update the `@login-platform-deployer` Slack group handle**

##### Exiting

* **Communicate any deploy issues with incoming Deployment rotation engineer**
  * Note any `stages/` branches which required force-pushing (i.e. could not be fast-forwarded) to the newest release tag
  * Note any environments and/or directory/account combinations that should _not_ be deployed to in the next release, and why

### DevTools

Mission: Support GitLab and related automation tools and infrastructure!

__Note - This is not currently a rotation.  We will reassess our approach to GitLab and automation support in the coming months.__

#### Responsibilities

* **Respond to problems with GitLab CI/CD**

### Schedule Overrides

To temporarily take over the Primary or Secondary On-Call schedule:

1. Open [Platform Team Overrides](https://portal.victorops.com/dash/gsa_login#/team/team-oMJ7AAPwdFSwsMJc/scheduled-overrides)
1. Click "Create Override"
1. In "Override for" select which team member should get alerts during the override period
1. Select the start and end time of the override
1. Click "Create" to set the override

## Participating in Rotations

Engineers on the Platform teams at Login.gov are expected to participate in at least one of the rotation types every 8 weeks starting after their first 60
days on the program. Suggested rotations:

* **Interrupts** - A great first rotation type for new team members, and a great way to contribute if you are not part of On-Call rotations.
* **Deployment** - Another good new team member rotation, particularly if you are not part of the On-Call rotations.
* **DevTools** - Ideal for members of Team Mary. Currently just a group, but this may become a rotation in the future.
* **On-Call Primary/Secondary** - After time in other rotations, and after preparing as described in [Are You Ready To Be On-Call?](#are-you-ready-to-be-on-call), those who can are urged to join this rotation.

## Are You Ready To Be On-Call?

Before joining the Primary/Secondary On-Call rotation schedules for the Platform team, ensure the following are all true:

* Able to fully access our [AWS accounts]({{site.baseurl}}/articles/platform-aws-accounts-and-roles.html)
* Comfortable with sandbox tasks (Terraform `plan` and `apply`, navigating instances)
* Comfortable navigating APM and Infrastructure areas in NewRelic
* Comfortable reviewing logs in AWS CloudWatch and/or with `tail-cw` SSM command
* Shadowed full set of deploys: `dev`, `int`, `staging`, `dm`, and `prod` application deployments, and other platform code (**Deployment** rotation)
* Reviewed [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
* Reviewed [past postmortems](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui)
* Joined [`#login-situation`](https://gsa-tts.slack.com/archives/C5QUGUANN) channel
* Participated in at least one bi-weekly Contingency Plan Training Wargames session
* Participated in at least one "Klaxon" session (if sessions are running)
* Joined [`identity-devops` Google Hangout group](https://chat.google.com/room/AAAAJIpl9Oo) (in case of Slack outage)
* Able to SSM into `prod` EC2 instances
* [Splunk On-Call - Paging Policy]({% link _articles/platform-splunk-oncall.md %}#paging-policy) configured
* [Splunk On-Call - iOS App]({% link _articles/platform-splunk-oncall.md %}#ios-app) installed and configured
* Created and tested GSA email IdP account with SMS and PIV enabled in:
  * `int`
  * `staging`
  * `prod`

FEELING READY? You got this!

## Additional Resources

* [SRE Handbook - Being On-Call](https://landing.google.com/sre/sre-book/chapters/being-on-call/)
* [The On-Call Handbook](https://github.com/alicegoldfuss/oncall-handbook)
