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
  * [Emergency Contacts](#emergency-contacts)
  * [Crisis Comms](#crisis-comms)
* [Frequently Asked Questions and Expectations](#frequently-asked-questions-and-expectations)

## Response Process

The incident response process has four phases:
* [Initiate](#initiate-phase) - An incident is detected, [declared by the Situation Lead](#incident-declaration), and responders assemble in the [situation room](#situation-room)
* [Assess](#assess-phase) - The situation is assessed, initial [impact assessment](#impact-assessment) is conducted.
* [Remediate](#remediate-phase) - The team continuously works to mitigate the situation and ultimate return to normal operation.
* [Retrospect](#retrospective-phase) - The team learns from the incident and identifies specific and actionable improvements.

### Initiate Phase

An incident begins when someone becomes aware of a potential incident. We define “incident” broadly, following [NIST SP 800-61](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf), as “a violation or imminent threat of violation of computer security policies, acceptable use policies, or standard security practices” (6). This is a deliberately broad definition, designed to encompass any scenario that might threaten the security of Login.gov.

When a person outside the Login.gov team (the reporter) notices a Login.gov-related incident, they should begin reporting it by using the 18F incident response process (need link here), and then post about it in [#login-situation][login-situation]. If they don’t get acknowledgment from the Login.gov team right away, they should escalate by contacting the Login.gov leads directly until they receive acknowledgment of their report.

The first person to notice an incident, they should begin reporting it by using the this incident response process and posting about it in [#login-situation][login-situation] (including notifying the Login.gov leads).

The first participant becomes the initial SL and carries out the next steps in the response. The SL’s responsibility is coordination, not necessarily investigation. The SL’s primary role is to guide the process. The first responder may remain SL throughout the process, or they may hand off SL duties later in the process.

The SL makes sure that the Login.gov incident response process is followed, including supporting the reporter if the reporter already started it, or starting it if nobody has started it yet.

#### Messaging at the Initiate phase

Note that at this point the issue’s status is “investigating” — we haven’t confirmed that it’s really an issue yet. So, we should actually refer to this as just an “event” at this point; it doesn’t become an “incident” until we’ve confirmed it.

At this phase, communication should follow these steps (and any additional steps listed at :

* SL notifies [#login](https://gsa-tts.slack.com/messages/login/) channel that an incident is underway in [#login-situation][login-situation], brief summary
* The SL should inform GSA of the investigation by emailing itservicedesk@gsa.gov, gsa-ir@gsa.gov with a description of the incident, via a single email to all three addresses WITHIN one (1) hour of the finding.
* GSA-IR team responds:
    - Does not yet meet threshold for reportable incident
    - Continue investigating and keep us in the loop
* Real-time chat should happen in [#login-situation][login-situation].
* Create an issue in the [identity-security-private](https://github.com/18F/identity-security-private/issues/new?template=incidents.md) GitHub repository.
* Create a google docs
* If incident is an outage SL updates the [Login.gov StatusPage](https://logingov.statuspage.io/) following [StatusPage Process - Managing an Outage]({% link _articles/statuspage-process.md %}#managing-an-outage)
* Check the incident against the [Incident Response Thresholds for Communications](https://docs.google.com/document/d/19LfFyjlUeM2bbcztaMCswFm68FL5X51zzG1yNMQapz0/edit?skip_itp2_check=true&pli=1) and notify Login.gov comms before the incident reaches 50% of its length of time limit
* Login.gov Agency Partners: send out an incident summary to LOGIN-PARTNERS@listserv.gsa.gov. Partner list: https://drive.google.com/drive/u/0/folders/0B4yIa0Upv1JJSkJOSmdsLWVOVmM)

The SL is responsible for keeping this issue up-to-date as investigation and remediation progresses. Everyone involved in the issue (responders) should leave notes as comments on the issue.

* The SL may start a Google Hangout and/or create Google Docs so that responders can share sensitive information not suitable for sharing in GitHub or Slack.


### Assess Phase

The next step is to assess the issue. We need to answer two questions:
* Is this an incident (i.e., did the thing we suspect happen actually happen?)
* If so, how severe is it? (This will determine how our response proceeds.)

To answer these questions, the SL should form a response team by Direct Messaging (DM) people in Slack. The response team should work to confirm the issue and assess its impact.

If the issue turns out to be a false alarm, the SL should update the ticket, setting the status to “false alarm”, and closing the issue.

If the issue is valid, the team should assess its impact and determine an initial severity following the incident severity guide below. (Note that the severity can change over the lifespan of the incident, so it’s OK to determine the initial severity fairly quickly.)

Once this is done, the SL should update the ticket, noting:

> - ` ** Status: “confirmed” `
> - ` ** Severity: High/Med/Low `
> - ` ** Any new/changed responders `

At this point, the SL should write an initial **situation report** (“sitrep”) confirming the incident, summarizing what’s going on, identifying the SL, and linking to the issue. Here’s an example sitrep:

> Subject: [sitrep] The chickens have escaped
>
> https://github.com/18F/identity-security-private/issues/12345
>
> - ` ** Severity: high `
> - ` ** SL: Farmer Jane `
> - ` ** Responders: Spot the Dog, Farmer Dave `
>
> We've confirmed reports of escaped chickens. Looks like a fox may
> have tunneled into the run. Dave is working to fix the fence, Spot is tracking the fox.

This sitrep should be:
* Posted in [#login-situation][login-situation]
* Emailed to GSA IR (gsa-ir@gsa.gov)
* Send (email or Slack) to external stakeholders, if applicable and relevant

#### Comms at the Assess phase

Updates and real-time chat should continue as above (updates on the GitHub issue, chat in Slack or Google Hangouts, and update to open StatusPage incident if applicable).

### Remediate Phase

At this point, we’re trying to fix the issue! Remediation will be very situation-specific, so specific steps are hard to suggest. However, a few **guidelines** to follow during this process:

* The SL’s responsibility is coordination, communication, and information-collection. The remediation team will be focused on resolving the issue, so it’s up to the SL to make sure that we properly track what happened, how we’re fixing it, who’s doing what, etc. Ideally, the notes kept by the SL should be sufficient for an outside investigator to independently follow the work of the response team and validate the team’s work.

* Similarly, the team will develop a list of **remediation steps**. The SL is likewise responsible for tracking those, making sure they’re assigned and followed-up, and verifying them as they’re completed. These may be tracked in the central GitHub issue as well. The SL should distinguish between immediate concerns which should be completed before the incident is considered resolved and long-term improvements/hardening which can be deferred to the Retrospective.

* The response team should aim to adopt a _containment strategy_: if machines are compromised, they should avoid destroying or shutting them down if possible (this can hamper forensics). For AWS instances, you can leave the instance running and instead reconfigure the Security Group for the instance to drop all ingress and egress traffic until forensics can be performed. (GSA IR team May be involved as well at this stage).

* Remediation may require service disruption. If it does, the team should proceed in a different way depending on the severity:

  * For High-severity incidents, the team should take action immediately, even if this causes disruption. A notification about the disruption should be sent out as soon as possible, but the team needs no permission to take action at this level.

  * For Medium-severity incidents, the team should notify the Login.gov leads of the planned action, and help them assess the relative risk of disruption vs. security. If the leads are unavailable via Slack, they should be contacted using the phone numbers in their Slack profiles. The team should reach a collaborative decision on action, with a bias towards disruption. If they can’t be reached within 1 hour, the team may take action without them.

  * For Low-severity issues, the team should notify as above, and not take action until a mutually-agreed-on course of action has been determined.

* Remediation can sometimes take a long time. If the issue progresses for more than 3 hours without being resolved, the SL should plan for a long remediation.

This means:
* Determine if remediation efforts should be “business hours” or “24⁄7." This will depend on the severity of the issue, and whether breaches are ongoing.

* For 24⁄7 responses, the SL should begin shift-planning. Generally, responders should only work 3 hour shifts, so the SL should begin scheduling shifts and sending people “home” to preserve their ability to function.

* The SL also needs to get into rotation — again, 3 hour shifts are about the maximum suggested. So, the SL should likely hand off duties at this point.

Once the incident is no longer active — i.e. the breach has been contained, the issue has been fixed, etc. — the SL should spin down the incident. There may still be longer-term remediation needed, and possibly more investigation, but as long as the incident is no longer active these activities can proceed at the regular pace of business. To close out an incident, the SL should:

* Set the status of the incident to “resolved."
* Send a final sitrep to stakeholders.
* Thank everyone involved for their service!

Comms at the Remediate phase
* Updates and real-time chat should continue as above (updates on the GitHub issue, chat in Slack or Google Hangouts).

* The SL should continue to post updated sitreps on a regular cadence (the section on severities, below, suggests cadences for each level). These sitreps should be sent to Slack, to GSA-IT and US-CERT via email, and to any other stakeholders identified throughout the process (e.g. clients).

* For user impacting incidents, users must be kept up to date via the [Login.gov StatusPage](https://logingov.statuspage.io/) following [StatusPage Process - Managing an Outage]({% link _articles/statuspage-process.md %}#managing-an-outage)

### Retrospective Phase

The final step in handling a security incident is figuring out what we learned. The SL (or one of the SLs if there were multiple, or a designated other party) should lead a retrospective and develop an incident report.

Conducting retrospectives is out of the scope of this document, but as a crash course, here’s an [introduction to blameless postmortems](https://codeascraft.com/2012/05/22/blameless-postmortems/). We follow the basic steps listed at [login-gov-postmortems](https://drive.google.com/open?id=1A9y94VgHPOcaCCTdGRh0aWINOrBjUwo2ZepzBlTM--8).

The report should contain a timeline of the incident, details about how the incident progressed, and information about the vulnerabilities that led to the incident. A cause analysis is an important part of this report; the team should use tools such as [Infinite Hows](https://www.kitchensoap.com/2014/11/14/the-infinite-hows-or-the-dangers-of-the-five-whys/) and [Five Whys](https://en.wikipedia.org/wiki/5_Whys) to try to dig into causes, how future incidents could be prevented, how responses could be better in the future, etc.

The report should also contain some basic response metrics:
* Discovery method (how did we become aware of the issue?)

* Time to discovery (how long did it take from when the incident started until we became aware of it?)
* Time to containment (how long did it take from when we became aware until the issue was contained?)
* Threat actions (which specific actions – e.g. phishing, password attacks, etc) – were taken by the actor)?

This report should be posted as a final comment on the GitHub issue, which can then be closed. If appropriate, this should also be posted at [postmortems](https://drive.google.com/drive/u/0/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui?lfhs=2) (omitting any sensitive information).

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

## Frequently Asked Questions and Expectations

### Who does the Incident Response Guide apply to?

Anyone with access to production, including:
* All SREs
* All SecOps
* All developers
* All partnerships technical resources
* Representatives from the following teams:
  * UX
  * User Support

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
  * The current AppDev Primary and Secondary on-call
  * The current Platform Primary and Secondary on-call
  * Additional Responders as needed - The Situation Lead can call in anyone defined in [Who does the Incident Response Guide apply to?](#who-does-the-incident-response-guide-apply-to)
* After hours - Platform On Call and Application On Call - Additional resources will be brought in via Splunk On-Call notification

### What is expected when participating?

* Situation Lead (SL) - Once declared, leads the process until the incident is resolved OR Situation Lead role is handed off
  * Ensures process is followed
  * Stays in situation room
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

[login-situation]: https://gsa-tts.slack.com/messages/login-situation/
