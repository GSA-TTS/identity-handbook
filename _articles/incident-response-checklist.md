---
title: "Incident Response Checklist"
description: "Quick reference checklist for incident response"
layout: article
category: "Team"
subcategory: Guides
---

This is a quick checklist for any incident (security, privacy, outage, degraded service, etc.) to ensure the team can focus on time critical mitigation/remediation while still communicating appropriately.

# Quick Links
* Situation Lead: **Situation Room** link on [#login-situation][login-situation] bookmark bar
* Situation Lead: [Declare Incident Workflow](#declaring-an-incident-workflow)
* Situation Lead: [Impact Assessment]({% link _articles/incident-response-guide.md %}#incident-severities)
* Scribe: [Copy Incident Review Template](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy)
* Scribe: [Postmortems Folder](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui)
* Messenger: [GSA IR Email Template](https://docs.google.com/document/u/0/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA/edit)
* Technical Lead: [Incident Response Runbooks](https://gitlab.login.gov/lg/identity-devops/-/wikis/Incident-Response-Runbooks)

# Start

There is one checklist per-role starting with the Situation Lead. Find and follow your appropriate role checklist.  Checklists are intentionally terse
with links to supporting process and information where needed.

* [Situation Lead](#situation-lead): Declares incident and facilitates incident response
* [Tech Lead](#technical-lead): Focuses on hands on technical response
* [Messenger](#messenger): Passes information out of the situation room to stakeholders
* [Scribe](#scribe): Keeps running notes in Slack on what is happening in the situation room
* [Responder](#responder): Everyone else in the situation room without an assigned role

These additional roles are external to, and highly engaged with, responders in the situation room:

* [Comms Lead](#comms-lead): Login.gov communications lead overseeing crisis communications
* [Envoy](#envoy): Joins agency partner situation room in case of joint incident and ensures appropriate inter-team coordination
* [Executive On-Call](#executive-on-call): Designated Login.gov leadership member for escalation and support


# Role Checklists

## Situation Lead
### Initiate

1. Spins up Situation Room with Google Meet
1. Calls in additional responders to Situation Room
1. Calls in Security Engineer to Situation Room
1. Delegates roles assignments. Triage may continue with unfilled roles, if needed
  * [Tech Lead](#technical-lead) role assigned and focused on technical response
  * [Scribe](#scribe) role assigned and taking notes in Slack in situation thread
  * [Messenger](#messenger) roles assigned
1. Declares incident and facilitates incident response using the [Slack “Declare Incident Workflow”](#declaring-an-incident-workflow) on [#login-situation][login-situation] bookmark bar
1. Begins situation thread in Slack [#login-situation][login-situation] channel

### Assess
1. Keeps Situation Room well controlled
1. Preforms [impact assessment and severity]({% link _articles/incident-response-guide.md %}#incident-severities) with input from Response Team
1. GSA-IR briefed when asked

### Contain
1. Determines if containment is required and to what strategy is acceptable.
1. Makes the decision to return to the Assess phase or move to the Remediate phase
1. Roles being effectively executed. Adjust/reassign as needed:
    * Too many responders?  Let people go
    * Too few responders?  Call people in
1. Cycle responders out (including self) has role clearly transferred. Any responder in room more than 4 hours relieved of role and asked to take a break

### Remediate
1. Verify a recovery plan is ready
1. Makes decision to return to the Contain phase if additional compromise activity is reported
1. Spin down incident with input from Tech Lead after system have returned to normal
1. Close Situation Room and notify [#login-situation][login-situation]

### Retrospect
1. Schedule Incident Review within 1 week
1. Lead the Incident Review
1. Schedules Lessons Learned - 30 day follow up
<hr>

## Technical Lead
### Initiate
1. Begins technical triage of event
1. Delegates technical response task to technical team
1. Collects evidence of incident

### Assess
1. Technical context shared with responders in the room
1. Determine which [Incident Response Runbooks](https://gitlab.login.gov/lg/identity-devops/-/wikis/Incident-Response-Runbooks) to invoke
1. Creates parallel lines of investigations delegated to [other responders](#responder)

### Contain
1. Follow [Incident Response Runbooks](https://gitlab.login.gov/lg/identity-devops/-/wikis/Incident-Response-Runbooks) where appropriated, based on the type of event to limit impact.
1. Delegates to Responders examination of environment task to uncover other areas of potential compromise

### Remediate
1. Verify no additional signs of compromise must be addressed
1. Implement remediation and recovery plan
1. Confirm Normal system operation

### Retrospect
- Participate Lessons Learned 
- Provide feedback on technical response
<hr>

## Scribe
### Initiate
1. Triage notes recorded in situation thread
1. Create Incident Review from template [!!! INCIDENT REVIEW TEMPLATE](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy). Place Incident Review document in [Postmortems Folder](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui)
1. Add link to the incident document to situation thread

### Assess
1. Provide verbal time check every 30 minutes
1. Note significant events and findings in situation thread
1. Ask responders to share evidence and artifacts in the situation thread.

### Contain
- Provide verbal time check every 30 minutes
- Collects evidence provided from Responders into a single source

### Remediate
- Provide verbal time check every 30 minutes
- Add the recovery plan to the situation thread
- Noted in #login-situation when responders have drawn down

### Retrospect
- Construct timeline and complete Incident Review document before lessons learned meeting
- Attend Incident Review
<hr>

## Messenger
### Initiate
1. For public impacting incidents, post initial incident notice following StatusPage Process
1. Situation Report (sitrep) ticket created in [identity-security-private](https://github.com/18F/identity-security-private) repo
1. Create email notice to GSA IR, ISSM, ISSO using the [Incident Response - GSA IR Email Template](https://docs.google.com/document/u/0/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA/edit)
1. Once the situation is assessed, ping @login-comms-oncall with brief triage summary

### Assess
- Check the [Incident Comms Playbook](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c) every 30 minutes
- Update the platform [StatusPage]({% link _articles/statuspage-process.md %}#update) (if an incident is posted) every 30 minutes

### Contain
- Provides update to stakeholders outside of Situation Room
- Relays questions from stakeholders to Response Team
- **(Every 30 Minutes)** Check the [Incident Comms Playbook - ASSESS](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c) section
- Provide a [situation report](#situation-report) during prolonged incidents

### Remediate
- Update StatusPage with [incident end process]({% link _articles/statuspage-process.md %}#end)
- Provide all clear update using to GSA IR, ISSO and ISSM
- **(Every 30 Minutes)** Check the [Incident Comms Playbook - ASSESS](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c) section
- Provide a [situation report](#situation-report) during prolonged incidents

### Retrospect
- Attend Incident Review
<hr>

## Responder
### Initiate
- Volunteers for unfilled roles
- Ask where assistance is needed from Tech Lead

### Assess
- Support Tech Lead with parallel tasks as needed
- Share additional relevant evidence or suggestions when appropriate
- Ask to leave if you have no actions to take

### Contain
- Monitors environment for additional signs of compromise, based on direction from Tech Lead

### Remediate
- Assists Tech Lead in implementing recovery and remediation plan

### Retrospect
- Participate in the Incident Review if you performed actions during the incident
<hr>


## Comms Lead

* Notified by the `@login-comms-oncall` Slack handle; Manually notified via Splunk On-Call [comms-primary rotation](https://portal.victorops.com/dash/gsa_login/#/team/team-uDT03dJxKxWOvUTx/rotations) after-hours (Target: 30 minutes before crisis comms level reached)
* Monitors the situation thread
* If needed, briefly joins situation room to gather context
* Follows the [Login.gov Incident Comms Playbook](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.330ecfi08z29)

## Envoy

* Notified by partner email to Partner Down address
* Check in with Situation Lead if incident is active
* Use Splunk On-Call or phone to pull in responders if a situation has not been declared
* NOT acting as Login.gov Situation Lead
* Joins partner situation room (or equivalent)
* Important status and context communicated between Login.gov and partner situation rooms
* Can ask for technical resource from Login.gov situation room to join partner room
* Can not bring partner responders into Login.gov situation room

## Executive On-Call

* Notified by the `@login-executive-oncall` Slack handle
* Monitors the situation thread
* Ensure protection and support of incident responders


# Resources

## Contact List

[Emergency Contact List](https://gitlab.login.gov/lg/identity-devops/-/wikis/On-Call-Guide-Quick-Reference#emergency-contacts): Private emergency contact list, includes
contact and escalation information for Login.gov, GSA, and vendors.

## Declaring an Incident Workflow

In most cases the **`Declare Incident`** Slack workflow should be used to initiate
and incident. To use:

1. Enter the [#login-situation][login-situation] channel
1. Either:
    * Type `/declare` and hit enter to be prompted with a form to enter basic information.

        ![Screenshot of /declare workflow]({{site.baseurl}}/images/declare-incident-slash-command.png){:height="125"}

    * Select "Declare Incident" from the pinned "Workflows" folder up top

        ![Screenshot of declare workflow in menus]({{site.baseurl}}/images/declare-incident-menu.png){:height="125"}

Early in the response is may be hard to assess impact. The Situation Lead should
perform a quick [impact assessment]{% link _articles/incident-response-guide.md %}#incident-severities) to set the initial impact,
and it can be revised as needed later.

The full list of roles may not be known at the time of posting. Leave unassigned
roles blank and ensure they are documented in the response Slack thread as
they are assigned.

Once posted the team should use a thread under the incident declaration in the
channel. This allows for additional threads to be established and multiple
sub-incidents to be split off while remaining in the [#login-situation][login-situation] channel.


## Situation Report

There will be times, particularly in a prolonged outage, where sharing a point in time situation report will be needed. Here is a suggested format with the expectation that it would be posted in Slack and shared with leadership.

~~~
Subject: YYYY-MM-DD HH:MM Situation Report for ongoing incident INCIDENT_NAME

* Incident Review Thread: SLACK_THREAD_LINK
* Phase: Initiate|Assess|Remediate|Retrospect
* Severity: High|Med|Low
* Current responders:
  * Situation Lead: NAME
  * Technical Lead: NAME
  * Messenger: NAME
  * Scribe: NAME
* Incident Communications triggered: yes|no

UPDATE NARRATIVE
~~~

The `UPDATE NARRATIVE` is targeted toward leadership. Here are some suggested
items to address (with the leader's view in parenthesis):

* What is the current state of the incident? (Where are we?)
* What progress has been made since the last update? (Are we moving?)
* What is being done now and what might be done next? (Where are we going?)
* Does the team need support to continue to respond? (What do you need from me?)
* Is there an estimate of when service might be restored? (ETA?)

The last question is often unanswerable. That is OK! You can always say:
"We don't know right now and we will tell you when we have more information."

[login-situation]: https://gsa-tts.slack.com/archives/C5QUGUANN
