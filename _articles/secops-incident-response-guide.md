---
title: "Incident Response Guide"
description: "Security Incident Response Guide"
layout: article
category: "Security"
cSpell: ignore sitrep sitreps
---

## Introduction

This document outlines Login.gov’s process for responding to incidents. It outlines roles and responsibilities during and after incidents, and it lays out the steps we’ll take to resolve them.

{%- capture alert_content -%}
This is the full explicit document!
<br />
In a situation? Check the [Incident Response Checklist]({% link _articles/incident-response-checklist.md %}) for a quick reference.
{%- endcapture -%}

{% include alert.html content=alert_content %}

The formal version from the FedRAMP Agency ATO package can be found here [Login.gov Incident Response Plan](https://drive.google.com/file/d/1SVz5keBYiDSXvzBdkLFOqdnAplZWqL9D/)

Login.gov incident response operates under the GSA Incident Response framework.  See [GSA IT - IT Security Procedural Guide: Incident Response](https://www.gsa.gov/cdnstatic/Incident_Response_%5BCIO_IT_Security_01-02_Rev_18%5D_03-26-2021docx.pdf) for detailed GSA IR guidance.

## Contents

* [Response process](#response-process)
  * [Initiate Phase](#initiate-phase)
  * [Assess Phase](#assess-phase)
  * [Remediate Phase](#remediate-phase)
  * [Retrospective Phase](#retrospective-phase)
* [Impact Assessment](#impact-assessment)
  * [Incident Severities](#incident-severities)
    * [High Severity](#high-severity)
    * [Medium Severity](#medium-severity)
    * [Low Severity](#low-severity)
* [Resources](#resources)
  * [Incident Declaration](#incident-declaration)
  * [Situation Room](#situation-room)
  * [Emergency Contacts](#emergency-contacts)
  * [Crisis Comms](#crisis-comms)
  * [Situation Report](#situation-report)
* [Frequently Asked Questions and Expectations](#frequently-asked-questions-and-expectations)

## Response Process

The incident response process has four phases:
* [Initiate](#initiate-phase) - An incident is detected, [declared by the Situation Lead](#incident-declaration), and responders assemble in the [situation room](#situation-room)
* [Assess](#assess-phase) - The situation is assessed, initial [impact assessment](#impact-assessment) is conducted.
* [Remediate](#remediate-phase) - The team continuously works to mitigate the situation and ultimate return to normal operation.
* [Retrospect](#retrospective-phase) - The team learns from the incident and identifies specific and actionable improvements.

### Initiate Phase

Response begins when an TTS staff member inside or outside the Login.gov team (the reporter) notices and reports a Login.gov-related incident, using the TTS incident response process and notifying the Login.gov team in the [#login-situation][login-situation] Slack channel.

We define “incident” broadly, following [NIST SP 802-61](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf), as “a violation or imminent threat of violation of computer security policies, acceptable use policies, or standard security practices” (6). This is a deliberately broad definition, designed to encompass any scenario that might threaten the security of Login.gov.

The first responder on the Login.gov team (which could be the reporter if the reporter is on the team) becomes the initial Situation Lead (SL).
The SL follows this Login.gov IR Plan and may additionally reference [TTS incident response process](https://handbook.tts.gsa.gov/security-incidents/)

Initial steps:

* The SL performs an initial [incident declaration](#incident-declaration)
* Responders assemble in the [situation room](#situation-room)
* SL requests more responders if needed:
  * During business hours:
    * Call in on-call members using the @login-appdev-oncall and @login-devops-oncall handles in Slack
    * Use @here in [#login-situation][login-situation] if still understaffed
  * After hours:
    * Use Splunk On-Call page on-call engineers (See [Emergency Contacts](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#emergency-contacts)). Please err on the side of caution and page the on-call engineers.
* Roles are assigned when possible as responders join the incident:
  * **Situation Lead (SL)**: - Responsible for ensuring all following steps are completed. [Situation Lead Checklist]({% link _articles/incident-response-checklist.md %}#situation-lead)
  * **Technical Lead (TL)**: Leads technical investigation and mitigation. [Technical Lead Checklist]({% link _articles/incident-response-checklist.md %}#technical-lead)
  * **Messenger (M)**: Coordinates communication outside of #login-situation, within GSA, and if needed, initiates contact with Login.gov Communications to start [crisis comms](#crisis-comms) process. [Messenger Checklist]({% link _articles/incident-response-checklist.md %}#messenger)
  * **Scribe (SC)**: Relays information discussed in [situation room](#situation-room) to [#login-situation][login-situation] channel and aids the Situation Lead in recording incident. [Scribe Checklist]({% link _articles/incident-response-checklist.md %}#scribe)

Roles proceed as follows:
* **Situation Lead (SL)**:
  * Requests additional responders as needed, including a new SL if they need to cycle off
  * Ensures roles and team are coordinated and have what they need
  * Shares context on what is happening and asks clarifying questions
  * Adjusts the severity of the incident based on [impact assessment](#impact-assessment) as needed
* **Tech Lead (TL)**:
  * Leads technical response, delegating technical tasks as needed
  * Checks for relevant [Incident Response Runbooks](https://github.com/18F/identity-devops/wiki/Incident-Response-Runbooks) and initiates use
  * Ensures screen sharing and other methods are used
* **Scribe (SC)**:
  * Records significant activities in [#login-situation][login-situation] channel to create a timeline
  * Asks for links to resources/extra information to record as needed
  * Relays information to help someone NOT in the war room who wants to understand the incident
* **Messenger (M)**:
  * Creates the official tracking issue for the incident: [Incident Template](https://github.com/18F/identity-security-private/issues/new?template=incidents.md)
  * Creates the Incident Review document by copying [Incident Review Google Doc](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy) and shares a link in #login-situation
  * Uses [GSA IR Email Template](https://docs.google.com/document/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA) to create and send notice to GSA Incident Response <gsa-ir@gsa.gov>, IT Service Desk <itservicedesk@gsa.gov> (or GSA IT Helpline called), and our [GSA ISSO and ISSM](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference/#emergency-contacts) **within 1 hour** of start of incident
  * If incident is an outage (problem impacting users' ability to use Login.gov), SL updates the [Login.gov StatusPage](https://logingov.statuspage.io/) following [StatusPage Process - Managing an Outage]({% link _articles/statuspage-process.md %}#managing-an-outage)
  * Checks the incident against the [Incident Response Thresholds for Communications](https://docs.google.com/document/d/19LfFyjlUeM2bbcztaMCswFm68FL5X51zzG1yNMQapz0/edit?skip_itp2_check=true&pli=1) and notify Login.gov comms before the incident reaches 50% of its length of time limit

### Assess Phase

The next step is to fully assess the issue. We need to answer these questions:
* Is this really an incident?
* If so, how severe is it? (This will determine how our response proceeds.)
* Is this outage due to a 3rd party, warranting use of the [Vendor Outage Response Process]({% link _articles/vendor-outage-response-process.md %})?
* Is this user impacting, and if so, what information should be shared?

To answer these questions the assembled incident response team should work
together and draw in additional resources if needed.

If the issue turns out to be a false alarm the SL should declare the incident closed
in Slack. The messenger should update the ticket, setting the status to “false alarm”, and closing the issue.

If the issue is valid, a more complete [impact assessment](#impact-assessment)
should be performed and the impact should be revised accordingly.

### Remediate Phase

At this point, we’re trying to fix the issue! The majority of time spent in an
incident where participation is active is during the remediation phase.

Remediation will be very situation-specific, so specific steps are hard to suggest. However, a few **guidelines** to follow during this process:

* The SL’s responsibility is coordination, communication, and information-collection. The remediation team will be focused on resolving the issue, so it’s up to the SL to make sure that we properly track what happened, how we’re fixing it, who’s doing what, etc. Ideally, the notes kept by the SL should be sufficient for an outside investigator to independently follow the work of the response team and validate the team’s work.

* Similarly, the team will develop a list of **remediation steps**. The SL is likewise responsible for tracking those, making sure they’re assigned and followed-up, and verifying them as they’re completed. These may be tracked in the central GitHub issue as well. The SL should distinguish between immediate concerns which should be completed before the incident is considered resolved and long-term improvements/hardening which can be deferred to the Retrospective.

* The response team should aim to adopt a _containment strategy_: if machines are compromised, they should avoid destroying or shutting them down if possible (this can hamper forensics). For AWS instances, you can leave the instance running and instead reconfigure the Security Group for the instance to drop all ingress and egress traffic until forensics can be performed. (GSA IR team May be involved as well at this stage).

* Remediation may require service disruption. If it does, the team should proceed in a different way depending on the severity:

  * For High-severity incidents, the team should take action immediately, even if this causes disruption. A notification about the disruption should be sent out as soon as possible, but the team needs no permission to take action at this level.

  * For Medium-severity incidents, the team should notify the Login.gov leads of the planned action, and help them assess the relative risk of disruption vs. security. If the leads are unavailable via Slack, they should be contacted using the phone numbers in their Slack profiles. The team should reach a collaborative decision on action, with a bias towards disruption. If they can’t be reached within 1 hour, the team may take action without them.

  * For Low-severity issues, the team should notify as above, and not take action until a mutually-agreed-on course of action has been determined.

* Longer incidents may also require posting a regular (hourly) [situation report](#situation-report). These are to augment but not replace all the other communication from the incident response team and the communications team.

* Remediation can sometimes take a long time. If the issue progresses for more than 3 hours without being resolved, the SL should plan for a long remediation.

This means:
* Determine if remediation efforts should be “business hours” or “24⁄7." This will depend on the severity of the issue, and whether breaches are ongoing.

* For 24⁄7 responses, the SL should begin shift-planning. Generally, responders should only work 3 hour shifts, so the SL should begin scheduling shifts and sending people “home” to preserve their ability to function.

* The SL also needs to get into rotation — again, 3 hour shifts are about the maximum suggested. So, the SL should likely hand off duties at this point.

Once the incident is no longer active — i.e. the breach has been contained, the issue has been fixed, etc. — the SL should spin down the incident. There may still be longer-term remediation needed, and possibly more investigation, but as long as the incident is no longer active these activities can proceed at the regular pace of business. To close out an incident, the SL should:

* Set the status of the incident to “resolved."
* Post a final notice Slack to clearly demarcate the end of the active response.
* If appropriate, post a final [situation report](#situation-report) in Slack and share via email.
* Thank everyone involved for their service!

Comms at the Remediate phase
* Updates and real-time chat should continue as above (updates on the GitHub issue, chat in Slack or Google Hangouts).

* For user impacting incidents, users must be kept up to date via the [Login.gov StatusPage](https://logingov.statuspage.io/) following [StatusPage Process - Managing an Outage]({% link _articles/statuspage-process.md %}#managing-an-outage)

### Retrospective Phase

The final step in handling an incident is learning. The SL (or one of the SLs if there were multiple, or a designated other party) should lead a retrospective and develop an incident report (a.k.a. - postmortem).

Conducting incident reviews is out of the scope of this document, but as a crash course, here’s an [introduction to blameless postmortems](https://codeascraft.com/2012/05/22/blameless-postmortems/) by John Allspaw, one of the originators of the [Learning from Incidents](https://www.learningfromincidents.io/) community.

The report should contain a timeline of the incident, details about how the incident progressed, and information about the vulnerabilities that led to the incident. The purpose of an incident review is learning.

* The team learns from the overall system (people and technology).
* The technical system (software) "learns" through improvements the team makes to it.
* The organization learns through improved processes and the analysis of the incident.

The team may use tools such as [Infinite Hows](https://www.kitchensoap.com/2014/11/14/the-infinite-hows-or-the-dangers-of-the-five-whys/) to drive the analysis.

All incident reviews must also stored in the [incident reviews folder](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui?usp=drive_link) under the current year.

## Impact Assessment

Impact assessment is an ongoing activity. When an incident is first declared
the impact may be unclear. The responders should make a best guess at impact
and move forward quickly.

Severity ratings drive the actions of the response team. Below are the severities ratings we use, some examples of incidents that might fall into that bucket, and some guidelines for SLs and response teams about how to treat each class of incident.
Note the severities may (and often will) change during the lifecycle of the incident. That’s normal.

### Incident Severities

For incident response Login.gov uses a simple high/medium/low severity categorization.
These levels are distinct from the [Comms team's levels](#crisis-comms).

#### High Severity

High-sev incidents successfully compromise the confidentiality/integrity of Personally Identifiable Information (PII), impact the availability of services for a large number of customers, or have significant financial impact. Examples include:

* Confirmed breach of PII

* Successful root-level compromise of production systems

* Financial malware (ie. CryptoLocker) targeting 18F staff

* Denial of Service attacks resulting in severe outages

Guidelines for addressing High-sev issues:

* Work will likely be 24⁄7 (e.g. work until the issue is contained).

* Responders are empowered to take any step needed to contain the issue, up to and including complete service degradation.

* Sitreps should be sent every hour, or more.

#### Medium Severity

Medium-sev incidents represent attempts (possibly un- or not-yet-successful) at breaching PII, or those with limited availability/financial impact. Examples include:

* Suspected PII breach

* Targeted (but as-of-yet) attempts to compromise production systems

* Spam/phishing attacks targeting 18F staff

* DoS attacks resulting in limited service degradation

Guidelines for addressing Medium-sev issues:

* Response should be business-hours.

* Responders should attempt to consult stakeholders before causing downtime, but may proceed without them if they can’t be contacted in a reasonable time-frame.

* Sitreps should be sent approximately twice a day.

#### Low Severity

Low-sev incidents don’t affect PII, and have no availability or financial impact. Examples include:
* Attempted compromise of non-important systems (staging/dm/qa/demo, etc.)

* Incidents involving specific employees

* DoS attacks with no noticeable customer impact

Guidelines for addressing Low-sev issues:

* Response should be business-hours.

* Responders should avoid service degradation unless stakeholders agree.

* Sitreps should be sent approximately daily.

## Resources

### Incident Declaration

In most cases the `Declare Incident` Slack workflow should be used to initiate
and incident. To use, enter the [#login-situation][login-situation] channel, type `/declare` and
hit enter to be prompted with a form to enter basic information.

Early in the response is may be hard to assess impact. The Situation Lead should
perform a quick [impact assessment](#impact-assessment) to set the initial impact,
and it can be revised as needed later.

The full list of roles may not be known at the time of posting. Leave unassigned
roles blank and ensure they are documented in the response Slack thread as
they are assigned.

Once posted the team should use a thread under the incident declaration in the
channel. This allows for additional threads to be established and multiple
sub-incidents to be split off while remaining in the [#login-situation][login-situation] channel.

### Situation Room

This is generally a Google Meet. The link is present at the top of the [#login-situation][login-situation]
channel. It is also included in the `Declare Incident` Slack workflow output.

If Google Meet is not available the team may use Zoom or another GSA approved
video communication service to coordinate. The relevant link/invite must be
shared in the [#login-situation][login-situation] channel.

### Emergency Contacts

The [Emergency Contact List](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#emergency-contacts) includes
contact and escalation information for Login.gov, GSA, and vendors.

### Crisis Comms

Login.gov Communications maintains a distinct process for assessing the need
to initiate crisis communications with GSA, partner, and other stakeholders.

See [Incident Comms Playbook - Phase 2: ASSESS](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c)
for the incident level symptoms, impact, and duration.  It is the responsibility
of the **Messenger** to provide 30 minutes advance notice (if possible) to @login-comms-oncall
when a crisis communications event is imminent.

### Situation Report

In prior versions of this guide "situation reports" (or "sitreps") were referenced
with the suggestion to share in multiple communication channels. The current process
captures the needs of most incidents without this additional item. Notably:
* The going thread in [#login-situation][login-situation] should provide the latest
  detailed context.
* The [crisis comms](#crisis-comms) process covers external stakeholder communications.
* For availability incidents, [StatusPage](https://status.login.gov) provides
  a high level overview sharable with the public.
* For security incidents, GSA-IR engagement will provide the overarching regular
  updates needed.

There will be times, particularly in a prolonged outage, where sharing a point in
time situation report will be needed. Here is a suggested format with the expectation
that it would be posted in Slack and shared with leadership.

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
"We don't know right now and we will
tell you when we have more information."

## Frequently Asked Questions and Expectations

### Who does the Incident Response Guide apply to?

Anyone with access to production, including:
* All SREs
* All SecOps Engineers
* All developers with production access

### What is an incident?

* Anything that presents an immediate risk to **Confidentiality**, **Integrity**, or **Availability** of public Login.gov services
* If it smells like an incident, declare an incident
  * False positives are normal and useful to keep us sharp
  * Long delays while deciding if something is an incident are not acceptable
* When in doubt, call it out!  (If someone asks if it is an incident, it is probably an incident)

### When do you declare an incident?

* Immediately!
* Failing to report an incident in a timely manner after discovery jeopardizes Login.gov - FISMA requires timely reporting and declaring an incident and following our policy ensures we do not fail to meet that requirement

### When do you engage GSA-IR?

* Always - (Max of 60 minutes) GSA Incident Response is here to support our mission and protect our users, our agency, our program, and you!
* Even if it is low priority/no big deal? - That is not a determination that can be made alone, and GSA-IR will constructively challenge assumptions to ensure it is indeed no big deal

### How should I prioritize assisting with an incident vs. my other work?

* If you are on call (primary or secondary) you are expected to join situations immediately
* Incidents are always highest priority!  If you are asked to join, please check in
* Development, planning, and meeting activities should be paused during participation in an incident
* When the Situation Lead acknowledges you are not needed for incident response activities you can resume normal work
* Engineering and Platform leads are happy to answer questions about prioritization and your need to drop everything and participate

### When should I report into the situation room?

* Business hours:
  * The current Application (AppDev) Primary and Secondary on-call
  * The current Platform (DevOps) Primary and Secondary on-call
  * Additional Responders as needed - The Situation Lead can call in anyone defined in [Who does the Incident Response Guide apply to?](#who-does-the-incident-response-guide-apply-to)
* After hours - Platform On Call and Application On Call - Additional resources will be brought in via Splunk On-Call notification

### What is expected when participating?

* Situation Lead (SL) - Once declared, leads the process until the incident is resolved OR Situation Lead role is handed off
  * Ensures process is followed
  * Stays in the [situation room](#situation-room)
  * Delegates activities - Does NOT act as Technical Lead
  * Ensures communication and mitigation are being addressed by others
  * Makes sure everything that needs doing is being done
  * Checks in with participants for status updates
  * Makes sure that people have something to do, and if not, communicates clearly that they can drop
* Participants
  * Provide clear updates to the team
  * If unfilled or someone needs to rotate out, volunteers to serve in one of the defined roles:
    * Technical lead (TL): Leads technical investigation and mitigation
    * Messenger (M): Coordinates communication outside of [#login-situation][#login-situation], within GSA, and if needed, with partners and the public
    * Scribe (S): Relays information discussed in war room (hangout) to [#login-situation][login-situation] and aids SL in recording incident (Just notes, not a transcript)
  * If assigned a specific role or task, sees it through until it is complete OR handed off to another participant and confirmed by the SL
  * Be ready to answer SL/others when questions arise
  * Scribe your activities and artifacts in [#login-situation][login-situation]

### What if I can't participate?

* We are humans, it is OK!  All the same reasons for not working at a given time apply to incidents.
* If asked to join, let the Situation Lead know you cannot at this time.
* If you are participating but need to drop off:
  * Ensure any role or activity you are responsible for has been handed off to another participant
  * Let the Situation Lead know you are dropping off
  * Wait for confirmation from the Situation Lead before dropping

### Why do I need to participate in contingency planning exercises (wargames) and IR Fire Drills?

* **Resources** - It takes a full team to respond, and every participant is important!
* **Readiness** - Only through practice will we be and remain ready to meet the challenges Login.gov faces
* **Refinement** - Only through participating fully can we refine our processes to improve response and efficiency
* **Required** - GSA authorizes Login.gov to operate, in part on the understanding that we will adhere to [GSA IT - IT Security Procedural Guide: Incident Response](https://www.gsa.gov/cdnstatic/Incident_Response_%5BCIO_IT_Security_01-02_Rev_18%5D_03-26-2021docx.pdf)
* **Regulation (Law)** - Per FISMA we must follow [NIST 800-61r2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) - Computer Security Incident Handling Guide

[login-situation]: https://gsa-tts.slack.com/archives/C5QUGUANN
