---
title: "Incident Response Guide"
description: "Security Incident Response Guide"
layout: article
category: "Security"
cSpell: ignore sitrep sitreps ISCP
redirect_from: /articles/secops-incident-response-guide.html
---

{%- capture alert_content -%}
In a situation? Check the [Incident Response Checklist]({% link _articles/incident-response-checklist.md %}) for a quick reference.
{%- endcapture -%}
{% include alert.html content=alert_content %}

## Introduction

This document outlines Login.gov’s process for responding to incidents. It outlines roles and responsibilities during and after incidents, and it lays out the steps we’ll take to resolve them.

The complete [Login.gov Incident Response Plan](https://docs.google.com/document/d/1KxV9jSY3VvckX01Q3UnqjfxFpGO33bMY4Rvx0ovBZqc/) is available on Google Drive and is provided as a part of our FedRAMP ATO Package.


## Contents

* [Response Process Quick Reference](#response-process-quick-reference)
* [Response Process Flow Diagram](#response-process-flow-diagram)
* [Impact Assessment](#impact-assessment)
  * [Incident Severities](#incident-severities)
    * [High Severity](#high-severity)
    * [Medium Severity](#medium-severity)
    * [Low Severity](#low-severity)
    * [Recoverability Levels](#recoverability-levels)
* [Incident Reporting Process](#incident-reporting-process)
* [Frequently Asked Questions and Expectations](#frequently-asked-questions-and-expectations)

## Response Process Quick Reference

Specific activities associated with each phase of response, with the exception of Preparation, are generally documented by type of event in the Login.gov Incident Response runbooks. 

Activities for _Initiate, Assess, Contain and Remediate_ are done in a circular flow until the suspicious or system impacting activity is no longer found in the environment.

### Initiate

**GOAL:** Open a Situation Room, call in responders and assign roles. Then conduct a preliminary assessment of the event.

An incident is any event that presents an immediate risk to **Confidentiality, Integrity, or Availability** of public Login.gov services

### Assess

**GOAL:** Determine the status of the event as either a true positive or false alarm, then assign an impact and severity. 

The Response team should determine the impact classification, make a best guess at severity to move forward quickly.

**Impact:** _Functional, Informational_

**Level:** _High, Medium, Low, None_

**Impact:** _Recoverability_

**Level:** _Not Recoverable, Extended, Supplemented, Normal, Regular_

<details><summary><b>Notes on Recoverability</b> </summary>
1. Regular - time predictable w/ existing resources <br />
2. Normal - time unpredictable w/ existing resources <br />
3. Supplemented - time predictable w/ additional resources <br />
4. Extended - time unpredictable w/ additional resources are required <br />
5. Not Recoverable - Data has been lost or compromised. Systems cannot be restored.
</details>

### Contain
**GOAL:** Document the scope of the incident.  Limit the spread and impact of the incident and begin to formulate what remediation actions are required. 

### Remediate

**GOAL:** Implement steps needed to recover and return the environment to normal operations. Continue to examine the environment for additional signs of compromise. Spin down the Situation Room.

### Retrospect

**GOAL:** Review details of the incident to improve the incident handling processes. Create follow up actions for system improvements. Close the incident report. 


## Response Process Flow Diagram

Details of each phase can be found in section [6.3 Incident Response Phases](https://docs.google.com/document/d/1KxV9jSY3VvckX01Q3UnqjfxFpGO33bMY4Rvx0ovBZqc/edit#heading=h.wnxe5pfga6zb) of the _Incident Response Plan_.

![Flow Diagram for IR process]({{site.baseurl}}/images/incident-process-flow-diagram.png){:height="375"}

## Impact Assessment

Impact assessment is an ongoing activity. When an incident is first declared the impact may be unclear. The responders should make a best guess at impact
and move forward quickly.

Severity ratings drive the actions of the response team. Below are the severities ratings we use, some examples of incidents that might fall into that bucket, and some guidelines for SLs and response teams about how to treat each class of incident.
Note the severities may (and often will) change during the lifecycle of the incident. That’s normal.

We assess an incident on three areas, **Functional Impact**, **Informational Impact** and **Recoverability**.

A **functional impact** is assessed if any part of Login.gov’s usability, functionality or service becomes unavailable to end users, relaying partners or internal staff. 

An **informational impact** is tracked when any data elements categorized as PII is exposed to an unauthorized party. Internal and confidential information such as API keys, private configuration or business data are also included in this impact category.

The Login.gov team tasked with responding to the event must determine the **recoverability** which is defined as the level of effort they believe the incident will take to recover from. This will help shape the type of response that is required and determine the amount of time and resources needed to return to a nominal state. 


## Incident Severities

For incident response Login.gov uses a simple high/medium/low severity categorization for Informational and Functionality impact.

### High Severity

High-sev incidents successfully compromise the confidentiality/integrity of Personally Identifiable Information (PII), impact the availability of services for a large number of customers, or have significant financial impact.

Informational Impacts examples:
* Confirmed breach of PII
* PII breach of more than 1000 users

Functionality Impact examples:
* Application code bugs creating widespread usability issues or outage
* Denial of Service attacks resulting in severe outages
* Events that result in a large volume of inquiries to Customer Contact Center

Both Functionality and Information Impact examples:
* Successful root-level compromise of production systems
* Unauthorized entities accessing any Login.gov system
* Application vulnerabilities


### Medium Severity

Medium-sev incidents represent attempts (possibly un- or not-yet-successful) at breaching PII, or those with limited availability/financial impact.

Informational Impacts examples:
* Suspected PII breach
* PII breach of less than 1000 users
* External leaks of unclassified but controlled information (API tokens, system passwords, private encryption keys)

Functionality Impact examples:
*  Bug preventing individuals from using a feature of the application
* DoS attacks resulting in limited service degradation
* Credential stuffing attacks that result in successful username and password submissions


Both Functionality and Information Impact examples:
* Targeted (but as-of-yet) attempts to compromise production systems
* Vulnerabilities on non-public facing systems with known exploits available


### Low Severity

Low-sev incidents don’t affect PII, and have no availability or financial impact.

Informational Impacts examples:
* Leak or compromise of business process or operational information.
* Internal exposure of controlled information (API tokens, system passwords, private encryption keys)

Functionality Impact examples:
* Unplanned 3rd party or upstream vendor outages
* DoS attacks with no noticeable customer impact
* SMS or Toll fraud with the potential to inhibit the ability for Login.gov to send OTP

Both Functionality and Information Impact examples:
* Attempted compromise of non-important systems (staging/dm/qa/demo, etc.)

### Recoverability Levels

Recoverability Level is used to gauge how much time and resources will be needed to return the system to normal operational state.

| Level           |  Definition  | 
| --------------- | ------------ |
| Regular         | Time to recovery is predictable with existing resources |
| Normal          | Time to recover is unpredictable; no additional resources are needed |
| Supplemental    | Time to recovery is predictable with additional resources |
| Extended        | Time to recovery is unpredictable; additional resources and outside help are needed. The recovery time exceeds the baseline defined by Appendix G - ISCP. |
| Not Recoverable | Recovery from the incident is not possible (e.g., sensitive data exfiltrated and posted publicly); launch investigation |


## Situation Room Roles

Roles are assigned when possible as responders join the incident.

### Situation Lead (SL)
* Responsible for leading all members of the initial incident response. 
* Requests additional responders as needed, including a new SL if they need to cycle off.
* Ensures roles and team are coordinated and have what they need
* Shares context on what is happening and asks clarifying questions
*  Adjusts the severity of the incident based on impact assessment as needed

### Technical Lead (TL)
* Leads technical investigation, containment and remediation.
* Leads technical response, delegating technical tasks as needed
* Checks for relevant Incident Response Runbooks and initiates use
* Ensures screen sharing and other methods are used

### Messenger (M)
* Coordinates communication outside of the situation channel, within GSA, and if needed, initiates contact with Login.gov Communications team to start a crisis comms process.
* Creates the official tracking issue for the incident
* Create and send notice to GSA Incident Response, IT Service Desk, and Login.gov’s GSA ISSO and ISSM.
* Updates the public status monitoring page If incident is an outage (problem impacting users’ ability to use Login.gov)
* Checks the incident against the “Incident Response Thresholds for Communications” and notify Login.gov comms before the incident reaches 50% of its length of time limit

### Scribe (SC)
* Relays information discussed in situation room to situation channel and aids the Situation Lead in recording the incident.
* Records significant activities in situation channel to create a timeline
* Asks for links to resources or extra information to record as needed
* Relays information to help someone NOT in the war room who wants to understand the incident
* Creates the [Incident Review document](https://docs.google.com/document/d/1kf7CT5rm4zaGl4oLU0DkELuMBi-sBzdXTdIStilM_Vc/edit) for incident recap and lessons learned

## Incident Reporting Process

### Internal Reporting

Initiation of the reporting process is the responsibility of any person, staff, or contractor who observes suspicious security activities that involve GSA data or systems. Any incident with a functional, information, or recovery impact, must be reported _IMMEDIATELY_ to Login.gov’s DevOps and Security Engineering teams through real-time chat via [#login-situation][login-situation] channel in Slack or email to **identity-devops@login.gov** and **security@login.gov**.

### External Reporting

If a person outside the Login.gov team notices a Login.gov-related incident, they are instructed to email **security@login.gov**. If an acknowledgement from the Login.gov team is NOT received in one hour, the individual must escalates by contacting a Login.gov lead directly.

### Reporting an Incident to GSA Incident Response

Once the situation room has been established, the Situation Lead will instruct the Messenger to create an incident tracking issue. A brief notification must be sent to GSA Incident Response **gsa-ir@gsa.gov**, IT Service Desk **itservicedesk@gsa.gov** (or GSA IT Helpline called), and Login.gov’s ISSO and ISSM.

The Messenger will also update the public status page when the incident relates to service impacts or creates outages which prohibits customers from using the platform.

### PII Reporting Requirements

GSA requires additional reporting of incidents which involve Personally Identifiable Information (PII). Confirmed or suspected incidents involving the potential loss or compromise of PII must be reported immediately as stated in [CIO-IT Security-01-02, Incident Response](https://insite.gsa.gov/system/files/Incident-Response%20%28IR%29-%5BCIO-IT-Security-01-02-Rev-20%5D-02-08-2024.pdf).

### Crisis Comms

Login.gov Communications maintains a distinct process for assessing the need
to initiate crisis communications with GSA, partner, and other stakeholders.

See [Incident Comms Playbook - Phase 2: ASSESS](https://docs.google.com/document/d/1kG7LXaEThJFJfCVP3jnimEvqbHKlFNvJ_PokZkpu1K8/edit#heading=h.vjtsg6mj5w6c)
for the incident level symptoms, impact, and duration.  It is the responsibility of the **Messenger** to provide 30 minutes advance notice (if possible) to @login-comms-oncall when a crisis communications event is imminent.


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
* After hours - Platform On Call and Application On Call - Additional resources will be brought in via AWS Incident Manager notification

### What is expected when participating?

* Situation Lead (SL) - Once declared, leads the process until the incident is resolved OR Situation Lead role is handed off
  * Ensures process is followed
  * Stays in the situation room
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
