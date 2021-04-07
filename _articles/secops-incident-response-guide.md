---
title: "Incident Response Guide"
description: "Security Incident Response Guide"
layout: article
category: "Team"
---

<!-- TOC -->

- [Introduction](#introduction)
- [Overview](#overview)
  - [Roles](#roles)
  - [Phases](#phases)
    - [Initiate](#initiate)
    - [Assess](#assess)
    - [Remediate](#remediate)
    - [Retrospective](#retrospective)
- [Response process](#response-process)
  - [Initiate Phase](#initiate-phase)
    - [Comms at the Initiate phase](#comms-at-the-initiate-phase)
  - [Assess Phase](#assess-phase)
    - [Comms at the Assess phase](#comms-at-the-assess-phase)
  - [Remediate Phase](#remediate-phase)
  - [Retrospective Phase](#retrospective-phase)
- [Incident Severities](#incident-severities)
  - [**1 - High Severity**](#1---high-severity)
  - [**2 - Medium Severity**](#2---medium-severity)
  - [**3 - Low Severity**](#3---low-severity)
- [Frequently Asked Questions / Expectations](#frequently-asked-questions--expectations)
  - [Who does the Incident Response Guide apply to?](#who-does-the-incident-response-guide-apply-to)
  - [What is an incident?](#what-is-an-incident)
  - [When do you declare an incident?](#when-do-you-declare-an-incident)
  - [When do you engage GSA-IR?](#when-do-you-engage-gsa-ir)
  - [How should I prioritize assisting with an incident vs. my other work?](#how-should-i-prioritize-assisting-with-an-incident-vs-my-other-work)
  - [When should I report into the situation room?](#when-should-i-report-into-the-situation-room)
  - [What is expected when participating?](#what-is-expected-when-participating)
  - [What if I can't participate?](#what-if-i-cant-participate)
  - [Why do I need to participate in contingency planning exercises (wargames) and IR Fire Drills?](#why-do-i-need-to-participate-in-contingency-planning-exercises-wargames-and-ir-fire-drills)

<!-- /TOC -->

## Introduction

This document outlines login.gov’s process for responding to incidents. It outlines roles and responsibilities during and after incidents, and it lays out the steps we’ll take to resolve them.

See the [Incident Response Checklist]({% link _articles/incident-response-checklist.md %}) for a quick reference.

The formal version from the FedRAMP Agency ATO package can be found here [Login.gov Incident Response Plan](https://drive.google.com/open?id=1Em3F3oZF_SRuuRLqwr6-pwlE4iNmT2ix)


## Overview

At a high level, incident response follows this process:

### Roles

### Phases

#### Initiate

An TTS staff member inside or outside the login.gov team (the reporter) notices and reports a login.gov-related incident, using the TTS incident response process and notifying the login.gov team in the #login-situation Slack channel.

- The first responder on the login.gov team (which could be the reporter if the reporter is on the team) becomes the initial Incident Commander (IC).

The IC follows this Login.gov IR Plan and may follow [TTS incident response process](https://handbook.tts.gsa.gov/security-incidents/) (or supports the reporter if the reporter already started it) as a supplement, including notifying GSA IT (itservicedesk@gsa.gov, gsa-ir@gsa.gov), opening a Google Doc, and creating an issue in the DevOps GitHub repository to track the event.
- Create a ticket in the appropriate repository
   - Availability/system: https://github.com/18F/identity-devops-private/issues
   - Security: https://github.com/18F/identity-security-private/issues
   - Other: https://github.com/18F/identity-private/issues
- The IC notifies [#login-situation](https://gsa-tts.slack.com/messages/login-situation/) that an incident has been declared
- IC uses [OpsGenie](https://www.opsgenie.com/) to reach teams and team members as needed
- If incident is an outage (problem impacting users' ability to use Login.gov), IC updates the [Logon.gov Statuspage](https://logingov.statuspage.io/) via the [Statuspage Admin Interface](https://manage.statuspage.io/login) ([View Sample Message]({{site.baseurl}}/images/statuspage-sample-message.png){:target="_blank"})

#### Assess

- The IC forms a team (responders) to determine if the event is actually a confirmed incident, and if so assesses the severity (investigating).
- The IC sends out an initial situation report (sitrep), or a false-alarm notification.

#### Remediate

- The IC coordinates, communicates, and tracks the investigation and remediation.

The responders work to contain and remediate the issue; timelines vary based on the assessed severity.
- Initial stopgap fix
- Longer-term solution
- Impact Discovery
- Send GSA IR (gsa-ir@gsa.gov) and partner notifications/updates if relevant
- If breach and theft is determined involve GSA IR for forensics
- Other remediation
- Discuss closing out urgent response

  - Two phases to close out: finished urgent response, and fully closed
     - For an incident to remain in the active emergency phase, it must need all hands on deck no matter the time of day/night. If the initial remediation is complete, then urgent response can conclude, which ends the discussion in #login-situation and clears the topic in that channel.
     - This doesn’t mean response is finished. There may still be more follow up tasks required during business hours for the team to fully close out the incident ticket.

#### Retrospective
The responding team holds a retrospective to analyze the incident, capture follow-up action items and lessons-learned, and write a formal report.

Real-time communication happens in Slack.
- If needed, the team can use a Google Hangout and/or Google Docs to share information that’s not appropriate for Slack or GitHub (PII, etc.).
- About a month after the retrospective, review the action items to see which ones are complete and if any merit further action.

For full details, read on.

## Response process

### Initiate Phase

An incident begins when someone becomes aware of a potential incident. We define “incident” broadly, following [NIST SP 800-61](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf), as “a violation or imminent threat of violation of computer security policies, acceptable use policies, or standard security practices” (6). This is a deliberately broad definition, designed to encompass any scenario that might threaten the security of login.gov.

When a person outside the login.gov team (the reporter) notices a login.gov-related incident, they should begin reporting it by using the 18F incident response process (need link here), and then post about it in #login-situation. If they don’t get acknowledgment from the login.gov team right away, they should escalate by contacting the login.gov leads directly until they receive acknowledgment of their report.

The first person to notice an incident, they should begin reporting it by using the this incident response process and posting about it in [#login-situation](https://gsa-tts.slack.com/messages/login-situation/) (including notifying the login.gov leads).

The first participant becomes the initial IC and carries out the next steps in the response. The IC’s responsibility is coordination, not necessarily investigation. The IC’s primary role is to guide the process. The first responder may remain IC throughout the process, or they may hand off IC duties later in the process.

The IC makes sure that the Login.gov incident response process is followed, including supporting the reporter if the reporter already started it, or starting it if nobody has started it yet.

#### Comms at the Initiate phase

Note that at this point the issue’s status is “investigating” — we haven’t confirmed that it’s really an issue yet. So, we should actually refer to this as just an “event” at this point; it doesn’t become an “incident” until we’ve confirmed it.

At this phase, communications should follow these steps (and any additional steps listed at :

* IC notifies [#login](https://gsa-tts.slack.com/messages/login/) channel that an incident is underway in [#login-situation](https://gsa-tts.slack.com/messages/login-situation/), brief summary
* The IC should inform GSA of the investigation by emailing itservicedesk@gsa.gov, gsa-ir@gsa.gov with a description of the incident, via a single email to all three addresses WITHIN one (1) hour of the finding.
* GSA-IR team responds:
    - Does not yet meet threshold for reportable incident
    - Continue investigating and keep us in the loop
* Real-time chat should happen in [#login-situation](https://gsa-tts.slack.com/messages/login-situation/).
* Create an issue in the [identity-security-private](https://github.com/18F/identity-security-private/issues/new?template=incidents.md) GitHub repository.
* Create a google docs
* If incident is an outage IC updates the [Login.gov Statuspage](https://logingov.statuspage.io/) via the [Statuspage Admin Interface](https://manage.statuspage.io/login) ([View Sample Message]({{site.baseurl}}/images/statuspage-sample-message.png){:target="_blank"})
* Login.gov Agency Partners: send out an incident summary to LOGIN-PARTNERS@listserv.gsa.gov. Partner list: https://drive.google.com/drive/u/0/folders/0B4yIa0Upv1JJSkJOSmdsLWVOVmM)

The IC is responsible for keeping this issue up-to-date as investigation and remediation progresses. Everyone involved in the issue (responders) should leave notes as comments on the issue.

* The IC may start a Google Hangout and/or create Google Docs so that responders can share sensitive information not suitable for sharing in GitHub or Slack.


### Assess Phase

The next step is to assess the issue. We need to answer two questions:
* Is this an incident (i.e., did the thing we suspect happen actually happen?)
* If so, how severe is it? (This will determine how our response proceeds.)

To answer these questions, the IC should form a response team by Direct Messaging (DM) people in Slack. The response team should work to confirm the issue and assess its impact.

If the issue turns out to be a false alarm, the IC should update the ticket, setting the status to “false alarm”, and closing the issue.

If the issue is valid, the team should assess its impact and determine an initial severity following the incident severity guide below. (Note that the severity can change over the lifespan of the incident, so it’s OK to determine the initial severity fairly quickly.)

Once this is done, the IC should update the ticket, noting:

> - ` ** Status: “confirmed” `
> - ` ** Severity: High/Med/Low `
> - ` ** Any new/changed responders `

At this point, the IC should write an initial **situation report** (“sitrep”) confirming the incident, summarizing what’s going on, identifying the SL, and linking to the issue. Here’s an example sitrep:

> Subject: [sitrep] The chickens have escaped
>
> https://github.com/18F/identity-security-private/issues/12345
>
> - ` ** Severity: high `
> - ` ** IC: Farmer Jane `
> - ` ** Responders: Spot the Dog, Farmer Dave `
>
> We've confirmed reports of escaped chickens. Looks like a fox may
> have tunneled into the run. Dave is working to fix the fence, Spot is tracking the fox.

This sitrep should be:
* Posted in [#login-situation](https://gsa-tts.slack.com/messages/login-situation/)
* Emailed to GSA IR (gsa-ir@gsa.gov)
* Send (email or Slack) to external stakeholders, if applicable and relevant

#### Comms at the Assess phase

Updates and real-time chat should continue as above (updates on the GitHub issue, chat in Slack or Google Hangouts, and update to open Statuspage incident if applicable).

### Remediate Phase

At this point, we’re trying to fix the issue! Remediation will be very situation-specific, so specific steps are hard to suggest. However, a few **guidelines** to follow during this process:

* The IC’s responsibility is coordination, communication, and information-collection. The remediation team will be focused on resolving the issue, so it’s up to the IC to make sure that we properly track what happened, how we’re fixing it, who’s doing what, etc. Ideally, the notes kept by the IC should be sufficient for an outside investigator to independently follow the work of the response team and validate the team’s work.

* Similarly, the team will develop a list of **remediation steps**. The IC is likewise responsible for tracking those, making sure they’re assigned and followed-up, and verifying them as they’re completed. These may be tracked in the central GitHub issue as well. The IC should distinguish between immediate concerns which should be completed before the incident is considered resolved and long-term improvements/hardening which can be deferred to the Retrospective.

* The response team should aim to adopt a _containment strategy_: if machines are compromised, they should avoid destroying or shutting them down if possible (this can hamper forensics). For AWS instances, you can leave the instance running and instead reconfigure the Security Group for the instance to drop all ingress and egress traffic until forensics can be performed. (GSA IR team May be involved as well at this stage).

* Remediation may require service disruption. If it does, the team should proceed in a different way depending on the severity:

  * For High-severity incidents, the team should take action immediately, even if this causes disruption. A notification about the disruption should be sent out as soon as possible, but the team needs no permission to take action at this level.

  * For Medium-severity incidents, the team should notify the login.gov leads of the planned action, and help them assess the relative risk of disruption vs. security. If the leads are unavailable via Slack, they should be contacted using the phone numbers in their Slack profiles. The team should reach a collaborative decision on action, with a bias towards disruption. If they can’t be reached within 1 hour, the team may take action without them.

  * For Low-severity issues, the team should notify as above, and not take action until a mutually-agreed-on course of action has been determined.

* Remediation can sometimes take a long time. If the issue progresses for more than 3 hours without being resolved, the IC should plan for a long remediation.

This means:
* Determine if remediation efforts should be “business hours” or “24⁄7." This will depend on the severity of the issue, and whether breaches are ongoing.

* For 24⁄7 responses, the IC should begin shift-planning. Generally, responders should only work 3 hour shifts, so the IC should begin scheduling shifts and sending people “home” to preserve their ability to function.

* The IC also needs to get into rotation — again, 3 hour shifts are about the maximum suggested. So, the IC should likely hand off duties at this point.

Once the incident is no longer active — i.e. the breach has been contained, the issue has been fixed, etc. — the IC should spin down the incident. There may still be longer-term remediation needed, and possibly more investigation, but as long as the incident is no longer active these activities can proceed at the regular pace of business. To close out an incident, the IC should:

* Set the status of the incident to “resolved."
* Send a final sitrep to stakeholders.
* Thank everyone involved for their service!

Comms at the Remediate phase
* Updates and real-time chat should continue as above (updates on the GitHub issue, chat in Slack or Google Hangouts).

* The IC should continue to post updated sitreps on a regular cadence (the section on severities, below, suggests cadences for each level). These sitreps should be sent to Slack, to GSA-IT and US-CERT via email, and to any other stakeholders identified throughout the process (e.g. clients).

* For user impacting incidents, users must be kept up to date via the [Logon.gov Statuspage](https://logingov.statuspage.io/)  ([Statuspage Admin Interface](https://manage.statuspage.io/login))

### Retrospective Phase

The final step in handling a security incident is figuring out what we learned. The IC (or one of the ICs if there were multiple, or a designated other party) should lead a retrospective and develop an incident report.

Conducting retrospectives is out of the scope of this document, but as a crash course, here’s an [introduction to blameless postmortems](https://codeascraft.com/2012/05/22/blameless-postmortems/). We follow the basic steps listed at [login-gov-postmortems](https://drive.google.com/open?id=1A9y94VgHPOcaCCTdGRh0aWINOrBjUwo2ZepzBlTM--8).

The report should contain a timeline of the incident, details about how the incident progressed, and information about the vulnerabilities that led to the incident. A cause analysis is an important part of this report; the team should use tools such as [Infinite Hows](http://www.kitchensoap.com/2014/11/14/the-infinite-hows-or-the-dangers-of-the-five-whys/) and [Five Whys](https://en.wikipedia.org/wiki/5_Whys) to try to dig into causes, how future incidents could be prevented, how responses could be better in the future, etc.

The report should also contain some basic response metrics:
* Discovery method (how did we become aware of the issue?)

* Time to discovery (how long did it take from when the incident started until we became aware of it?)
* Time to containment (how long did it take from when we became aware until the issue was contained?)
* Threat actions (which specific actions – e.g. phishing, password attacks, etc) – were taken by the actor)?

This report should be posted as a final comment on the GitHub issue, which can then be closed. If appropriate, this should also be posted at [postmortems](https://drive.google.com/drive/u/0/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui?lfhs=2) (omitting any sensitive information).

## Incident Severities

Severity ratings drive the actions of the response team. Below are the severities ratings we use, some examples of incidents that might fall into that bucket, and some guidelines for ICs and response teams about how to treat each class of incident.

Note the severities may (and often will) change during the lifecycle of the incident. That’s normal.

### **1 - High Severity**

High-sev incidents successfully compromise the confidentiality/integrity of Personally Identifiable Information (PII), impact the availability of services for a large number of customers, or have significant financial impact. Examples include:

* Confirmed breach of PII

* Successful root-level compromise of production systems

* Financial malware (ie. CryptoLocker) targeting 18F staff

* Denial of Service attacks resulting in severe outages

Guidelines for addressing High-sev issues:

* Work will likely be 24⁄7 (e.g. work until the issue is contained).

* Responders are empowered to take any step needed to contain the issue, up to and including complete service degradation.

* Sitreps should be sent every hour, or more.

### **2 - Medium Severity**

Medium-sev incidents represent attempts (possibly un- or not-yet-successful) at breaching PII, or those with limited availability/financial impact. Examples include:

* Suspected PII breach

* Targeted (but as-of-yet) attempts to compromise production systems

* Spam/phishing attacks targeting 18F staff

* DoS attacks resulting in limited service degradation

Guidelines for addressing Medium-sev issues:

* Response should be business-hours.

* Responders should attempt to consult stakeholders before causing downtime, but may proceed without them if they can’t be contacted in a reasonable time-frame.

* Sitreps should be sent approximately twice a day.

### **3 - Low Severity**

Low-sev incidents don’t affect PII, and have no availability or financial impact. Examples include:
* Attempted compromise of non-important systems (staging/dm/qa/demo, etc.)

* Incidents involving specific employees

* DoS attacks with no noticeable customer impact

Guidelines for addressing Low-sev issues:

* Response should be business-hours.

* Responders should avoid service degradation unless stakeholders agree.

* Sitreps should be sent approximately daily.

## Frequently Asked Questions / Expectations

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

* Anything that presents an immediate risk to **Confidentiality**, **Integrity**, or **Availability** of public login.gov services
* If it smells like an incident, declare an incident
  * False positives are normal and useful to keep us sharp
  * Long delays while deciding if something is an incident are not acceptable
* When in doubt, call it out!

### When do you declare an incident?

* Immediately!  
* Failing to report an incident in a timely manner after discovery jeopardizes login.gov - FISMA requires timely reporting and declaring an incident and following our policy ensures we do not fail to meet that requirement

### When do you engage GSA-IR?

* Always - (Max of 60 minutes) GSA Incident Response is here to support our mission and protect our users, our agency, our program, and you!
* Even if it is low priority/no big deal? - That is not a determination that can be made alone, and GSA-IR will constructively challenge assumptions to ensure it is indeed no big deal

### How should I prioritize assisting with an incident vs. my other work?

* Incidents are always highest priority!
* Development, planning, and meeting activities should be paused during participation in an incident
* When the Situation Lead acknowledges you are not needed for incident response activities you can resume normal work
* Engineering and Infrastructure leads are happy to answer questions about prioritization and your need to drop everything and participate

### When should I report into the situation room?

* Business hours - Responders as defined in [Who does the Incident Response Guide apply to?](#who-does-the-incident-response-guide-apply-to?)
* After hours - DevOps On Call and Application On Call - Additional resources will be brought in via OpsGenie notification

### What is expected when participating?

* Situation Lead (SL) - Once declared, leads the process until the incident is resolved OR Situation Lead role is handed off
  * Ensures process is followed
  * Stays in situation room
  * Delegates activities - Does NOT act as Technical Lead
  * Ensures communication and mitigation are being addressed by others
  * Makes sure everything that needs doing is being done
  * Checks in with participants for status updates
  * Make sure that people have something to do, and if not, communicate clearly that they can drop
* Participants
  * Provide clear updates to the team
  * If unfilled or someone needs to rotate out, volunteers to serve in one of the defined roles:
    * Technical lead (TL): Leads technical investigation and mitigation
    * Comms lead (CL): Coordinates communication outside of #login-situation, within GSA, and if needed, with partners and the public
    * Scribe (S): Relays information discussed in war room (hangout) to #login-situation and aids SL in recording incident
  * If assigned a specific role or task, sees it through until it is complete OR handed off to another participant and confirmed by the SL
  * Be ready to answer SL/others when questions arise
  * Scribe your activities and artifacts in #login-situation

### What if I can't participate?

* We are humans, it is OK!  All the same reasons for not working at a given time apply to incidents.
* If asked to join, let the Situation Lead know you cannot at this time.
* If you are participating but need to drop off:
  * Ensure any role or activity you are responsible for has been handed off to another participant
  * Let the Situation Lead know you are dropping off
  * Wait for confirmation from the Situation Lead before dropping

### Why do I need to participate in contingency planning exercises (wargames) and IR Fire Drills?

* **Resources** - It takes a full team to respond, and every participant is important! 
* **Readiness** - Only through practice will we be and remain ready to meet the challenges login.gov faces
* **Refinement** - Only through participating fully can we refine our processes to improve response and efficiency
* **Regulation (Law)** - Per FISMA and our FedRAMP authorization we must follow [NIST 800-61r2](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) - Computer Security Incident Handling Guide
