---
title: "Incident Response Checklist"
description: "Quick reference checklist for incident response"
layout: article
category: "Development"
---

This is a quick checklist for any incident (security, privacy, outage, degraded service, etc.) to ensure the team can focus on time critical mitigation/remediation while still communicating appropriately.

# Checklist

## Initiate

* Situation Lead (SL) role assigned (or self-assigned): Usually the team member who discovers the problem OR takes up response to outside report
* Situation Lead: Incident declared in [#login-situation](https://gsa-tts.slack.com/archives/C5QUGUANN)
* Situation Lead: Slack or OpsGenie used to alert additional login.gov responders. At a minimum, on call members of infrastructure, application, and security teams should be alerted
* Situation Lead: Issue created as official record for incident: [Incident Template](https://github.com/18F/identity-security-private/issues/new?template=incidents.md)  **Sensitive information like PII, secrets, etc MAY NOT be logged in the incident**
* Situation Lead: Hangout started and shared in #login-situation

## Assess

* [Incident confirmed]({% link _articles/secops-incident-response-guide.md %}#initiate-phase)
  - System security potentially compromised
  - System unavailable or functionality degraded
  - System under significant active attack from outside or inside threat
  - System integrity in question
* [Severity assigned]({% link _articles/secops-incident-response-guide.md %}#incident-severities) (can be changed later as new information is collected)
  - **High**: Confirmed PII breach, confirmed security penetration, complete outage
  - **Medium**: Suspected PII breach, suspected security penetration, partial outage
  - **Low**: Suspected attack, outage of non-prod persistent system (`int`)
* Situation Lead: If outage or user impacting, [StatusPage updated](https://manage.statuspage.io/login)
* Situation Lead: If shared notepad is needed, Google Doc opened and shared <https://drive.google.com/drive/folders/1TWTMp_w55niNuqC7vTPDEe5vkxaiP4P0>  (Contents should be copied to official issue)

## Remediate

* Situation Lead: Incident response duties delegated as needed to ensure forward progress:
  * **Technical lead (TL)**: Leads technical investigation and mitigation
  * **Comms lead (CL)**: Coordinates communication outside of #login-situation, within GSA, and if needed, with partners and the public
  * **Scribe (S)**: Relays information discussed in war room (hangout) to #login-situation and aids SL in recording incident
* Situation Lead: GSA IR <gsa-ir@gsa.gov> AND IT Service Desk <itservicedesk@gsa.gov> emailed (or GSA IT Helpline called) **within 1 hour** of start of incident
  * If confirmed OR potential PII leak, it must be explicitly noted - GSA IR will contact appropriate security and privacy teams
* Situation Lead: Wellbeing of group considered, including SL (Tired and stressed humans do not make the best decisions)
* Situation Lead: Rotations of all roles planned and performed to prevent any responder spending more than 3 hours in role
* Technical Lead: Lead technical response till issue was remediated (May span multiple TL shifts)
* For security incidents, consult official policy before destroying ANY evidence! **Contain**: Detach a compromised instance, do not destroy!
* Comms Lead: Regular updates to interested parties provided
* Situation Lead: For user impacting incident, StatusPage updated as status changes
* Situation Lead: Ensure a full record is being maintained
* Situation Lead: Signaled end of incident in #login-situation once remediated

## Retrospect

* Situation Lead: Postmortem doc started from copy of [Postmortem Template](https://drive.google.com/open?id=1A9y94VgHPOcaCCTdGRh0aWINOrBjUwo2ZepzBlTM--8)
* Situation Lead: Postmortem meeting scheduled with entire incident response team

# Resources

* [Official login.gov Incident Response plan](https://drive.google.com/file/d/1AQ_TMf7M7WZjHo6hlJ5L3lUxzA57f2oQ/view?usp=sharing): The authoritative source
* [login.gov Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %}): IR guidance and overview, defer to the official IR plan
* [NIST 800-61r2 Computer Security Incident Response Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)
