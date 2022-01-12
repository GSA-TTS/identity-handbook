---
title: "Incident Response Checklist"
description: "Quick reference checklist for incident response"
layout: article
category: "Team"
---

This is a quick checklist for any incident (security, privacy, outage, degraded service, etc.) to ensure the team can focus on time critical mitigation/remediation while still communicating appropriately.

{%- capture alert_content -%}
This is a checklist/overview document!
<br />
For detailed information see the [Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %})
{%- endcapture -%}

{% include alert.html content=alert_content %}

# Checklist

## Initiate

* Incident declared in [#login-situation](https://gsa-tts.slack.com/archives/C5QUGUANN) using `@here` to get everyone's attention
* Situation Lead and team assemble in War Room (See the Topic in #login-situation channel for the link)
* Roles assigned and duties started:
  * **Situation Lead (SL)**: - Responsible for ensuring all following steps are completed
    * Slack or OpsGenie used to alert additional responders (See [Emergency Contacts](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#emergency-contacts) if needed)
  * **Scribe (SC)**: Notes activities in war room (hangout) to #login-situation to produce timeline / share with others not in room
  * **Technical Lead (TL)**: Leads technical investigation and mitigation
  * **Comms Lead (CL)**: Coordinates communication outside of #login-situation, within GSA, and if needed, with partners and the public
    * Issue created as official record for incident: [Incident Template](https://github.com/18F/identity-security-private/issues/new?template=incidents.md)
    * Incident Review document started and shared [Incident Review Google Doc](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy)
    * Used [GSA IR Email Template](https://docs.google.com/document/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA) to create and send notice to GSA Incident Response <gsa-ir@gsa.gov> AND IT Service Desk <itservicedesk@gsa.gov> (or GSA IT Helpline called) **within 1 hour** of start of incident ([Alternate contact methods](https://insite.gsa.gov/employee-resources/information-technology))

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
* If user or partner impacting, [StatusPage updated](https://manage.statuspage.io/login)
* If secure shared notepad is needed, Google Doc opened and shared <https://drive.google.com/drive/folders/1TWTMp_w55niNuqC7vTPDEe5vkxaiP4P0>  (Contents should be copied to official issue)

## Remediate

* For security incidents, consult official policy before destroying ANY evidence! **Contain**: Detach a compromised instance, do not destroy!

Loop through per-role items until remediation is complete.

**By Role**
* Situation Lead (SL)
  * Wellbeing of group monitored, including self (Tired and stressed humans make poor decisions)
  * Rotations of all roles planned and performed to prevent any responder spending more than 3 hours in role
* Technical Lead (TL)
  * Lead technical response till issue is remediated
  * **OR** role is handed off
* Comms Lead (CL)
  * Regular updates to interested parties provided
  * StatusPage updated as status changes
* Scribe (SC)
  * Ensure a full record is being maintained in Slack


Upon remediation:
* Signaled end of incident in #login-situation once remediated

## Retrospect

* Postmortem doc started from copy of [Postmortem Template](https://drive.google.com/open?id=1A9y94VgHPOcaCCTdGRh0aWINOrBjUwo2ZepzBlTM--8)
* Postmortem meeting scheduled with entire incident response team

# Resources

* [Login.gov Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %}): IR guidance and overview, defer to the official IR plan
* [Official Login.gov Incident Response plan](https://drive.google.com/file/d/1AQ_TMf7M7WZjHo6hlJ5L3lUxzA57f2oQ/view?usp=sharing): The authoritative source for login
* [TTS incident response process](https://handbook.tts.gsa.gov/security-incidents/)
* [GSA IT - IT Security Procedural Guide: Incident Response](https://www.gsa.gov/cdnstatic/Incident_Response_%5BCIO_IT_Security_01-02_Rev_18%5D_03-26-2021docx.pdf)
* [NIST 800-61r2 Computer Security Incident Response Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)
