---
title: "Incident Response Checklist"
description: "Quick reference checklist for incident response"
layout: article
category: "Team"
subcategory: Guides
---

This is a quick checklist for any incident (security, privacy, outage, degraded service, etc.) to ensure the team can focus on time critical mitigation/remediation while still communicating appropriately.

{%- capture alert_content -%}
This is a checklist/overview document!
<br />
For detailed information see the [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
{%- endcapture -%}

{% include alert.html content=alert_content %}

## Start

There is one checklist per-role starting with the Situation Lead.

* [Situation Lead](#situation-lead) - Declares incident and facilitates incident response
* [Tech Lead](#technical-lead) - Focuses on hands on technical response
* [Messenger](#messenger) - Passes information out of the situation room to stakeholders
* [Scribe](#scribe) - Keeps running notes in Slack on what is happening in the situation room
* [Responder](#responder) - Everyone else in the situation room without an assigned role
Find and follow your appropriate role checklist.  Checklists are intentionally terse
with links to supporting process and information where needed.

These additional roles are external to, and highly engaged with, responders in the situation room:

* [Comms Lead](#comms-lead) - Login.gov communications lead overseeing crisis communications
* [Envoy](#envoy) - Joins agency partner situation room in case of joint incident and ensures appropriate inter-team coordination
* [Executive On-Call](#executive-on-call) - Designated Login.gov leadership member for escalation and support
* [GSA IR](#gsa-ir) - GSA Incident Response - Official Incident Command for incidents

Sections for these roles are intentionally brief and these roles should follow their own
procedures.

## Role Checklists

### Situation Lead

*Initiate and Assess*
* In situation room
* Initial [severity level assessed]({% link _articles/secops-incident-response-guide.md %}#incident-severities)
* Initial roles assigned if possible - Continue with unfilled roles if needed
* Incident declared using the Slack "Declare Incident Workflow"
* Additional responders called in using Splunk On-Call, Slack, or voice
* [Tech Lead](#technical-lead) role assigned and focused on technical response
* [Scribe](#scribe) role assigned and taking notes in situation thread
* [Messenger](#messenger) roles assigned

*Mitigate*
(Continuous)
* Situation room is well controlled
* GSA-IR briefed when asked
* [Severity level is appropriate]({% link _articles/secops-incident-response-guide.md %}#incident-severities) or incident is cancelled if false-positive
* Roles being effectively executed - Adjust/reassign as needed
* Too many responders?  Let people go
* Too few responders?  Call people in
* Any responder needing to cycle out (including self) has role clearly transferred
* Any responder in room more than 4 hours relieved of role and asked to take a break

*Resolve and Retrospect*
* Incident clearly declared **closed** in #login-situation
* Incident review scheduled (within 1 week)
* Lead incident review

### Technical Lead

*Initiate and Assess*
* In situation room
* Evidence of incident confirmed and shared with responders

*Mitigate* (Continous)
* Technical context shared with responders in the room
* [Incident Response Runbooks](https://github.com/18F/identity-devops/wiki/Incident-Response-Runbooks) used where appropriate and steps executed
* Creates parallel lines of investigation and mitigation to delegate to [other responders](#responder)

*Resolve and Retrospect*
* Normal system operation confirmed

### Scribe

*Initiate and Assess*
* In situation room
* Impact assessment notes recorded in situation thread
* Incident Review document created using [Incident Review Google Doc](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy) and moved to the year's subfolder under the [Incident Reviews Folder](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui?usp=sharing)
* Link to Incident Review shared in situation thread

*Mitigate* (Continuous)
* **(Every 30 Minutes)** Time check verbally called out
* Any finding or significant event noted in situation thread
* Responders asked to share artifacts (non-sensitive screenshots, command snippets, etc) in situation thread

*Resolve and Retrospect*
* Noted in #login-situation when responders have drawn down
* Timeline constructed in Incident Review document prior to Incident Review

### Messenger

*Initiate and Assess*
* In situation room
* **If a public impacting (availability) incident**, posts initial incident notice following [StatusPage Process - Managing an Outage]({% link _articles/statuspage-process.md %}#managing-an-outage)
* Situation Report (sitrep) ticket created in [identity-security-private repo](https://github.com/18F/identity-security-private/issues/new?assignees=&labels=task%3A+IR&template=incidents.md&title=security+incident+capture)
* [GSA IR Email Template](https://docs.google.com/document/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA) used to create send notice to GSA-IR, ISSM, and ISSO
* Once the situation is assessed, ping `@login-comms-oncall`

*Mitigate* (Continous)
* **(Every 30 Minutes)** Check the [Incident Comms Playbook - ACCESS](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c) section 
* **(Every 30 Minutes)** [Update StatusPage]({% link _articles/statuspage-process.md %}#update) (if an incident is posted)

*Resolve and Retrospect*
* [StatusPage incident end process completed]({% link _articles/statuspage-process.md %}#end)

### Responder

*Initiate, Assess, and Mitigate* (Continuous)
* In situation room
* Volunteer to fill unfilled roles
* Follow direction of [Situation Lead](#situation-lead)
* Support [Tech Lead](#technical-lead) with parallel tasks as needed
* If you have additional relevant evidence or suggestions, share when appropriate
* Drop from the situation room when asked
* Ask to leave if you have no actions to take

*Retrospect*
* Participate in the Incident Review if you performed actions during the incident


### Comms Lead

* Notified by the `@login-comms-oncall` Slack handle; Manually notified via Splunk On-Call [comms-primary rotation](https://portal.victorops.com/dash/gsa_login/#/team/team-uDT03dJxKxWOvUTx/rotations) after-hours (Target: 30 minutes before crisis comms level reached)
* Monitors the situation thread
* If needed, briefly joins situation room to gather context
* Follows the [Login.gov Incident Comms Playbook](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.330ecfi08z29)

### Envoy

* Notified by partner email to Partner Down address
* Check in with Situation Lead if incident is active
* Use Splunk On-Call or phone to pull in responders if a situation has not been declared
* NOT acting as Login.gov Situation Lead
* Joins partner situation room (or equivalent)
* Important status and context communicated between Login.gov and partner situation rooms
* Can ask for technical resource from Login.gov situation room to join partner room
* Can not bring partner responders into Login.gov situation room

### Executive On-Call

* Notified by the `@login-executive-oncall` Slack handle
* Monitors the situation thread
* Ensure protection and support of incident responders

### GSA IR

* Joins situation room to be briefed by Situation Lead
* Initiates GSA-IR incident if warranted and shares case number
* Pulls in additional GSA-IR and other GSA level responders as needed
* Manages required notifications to CISA, CERT, and other parties
* Drops from situation room if incident is only related to availability or does not require GSA-IR command

# Resources

* [Login.gov Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %}): IR guidance and overview, defer to the official IR plan
* [Emergency Contact List](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#emergency-contacts): Private emergency contact list
* [Official Login.gov Incident Response plan](https://drive.google.com/file/d/1SVz5keBYiDSXvzBdkLFOqdnAplZWqL9D/view): The authoritative source for login
* [TTS incident response process](https://handbook.tts.gsa.gov/security-incidents/)
* [GSA IT - IT Security Procedural Guide: Incident Response](https://www.gsa.gov/cdnstatic/Incident_Response_%5BCIO_IT_Security_01-02_Rev_18%5D_03-26-2021docx.pdf)
* [NIST 800-61r2 Computer Security Incident Response Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)
