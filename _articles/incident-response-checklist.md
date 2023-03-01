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

# Checklist

## Initiate

* Incident declared in [#login-situation](https://gsa-tts.slack.com/archives/C5QUGUANN) by typing `/declare` and launching the `Declare Incident` workflow
* Situation Lead and team assemble in War Room (See the Topic in #login-situation channel for the link)
* Situation Lead asks for more participants if needed:
  * During business hours:
    * Call in on-call members using the @login-appdev-oncall and @login-devops-oncall handles in Slack
    * Use @here in #login-situation if still understaffed
  * After hours:
    * Slack or OpsGenie used to alert additional responders (See [Emergency Contacts](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#emergency-contacts) if needed)
* Roles assigned and duties started:
  * **Situation Lead (SL)**: - Responsible for ensuring all following steps are completed
  * **Scribe (SC)**: Notes significant events observed in the war room (hangout) to #login-situation to produce timeline / share with others not in room (Just notes - Not a transcript!)
  * **Technical Lead (TL)**: Leads technical investigation and mitigation
    * Checks for relevant [Incident Response Runbooks](https://github.com/18F/identity-devops/wiki/Incident-Response-Runbooks)
    * Ensures execution of relevant runbook steps, delegating as needed
  * **Messenger (M)**: Shares information outside of #login-situation including: StatusPage (the public), LG Customer Support, LG Partnerships, LG Communications, and GSA IR
    * Issue created as official record for incident: [Incident Template](https://github.com/18F/identity-security-private/issues/new?template=incidents.md)
    * Incident Review document created from [Incident Review Google Doc](https://docs.google.com/document/d/1Yaqnb9QsHRrlaBvlTeO_qHGmuP-0h4z-CCustU8gBdk/copy) and moved to the year's subfolder under the [Incident Reviews Folder](https://drive.google.com/drive/folders/1ZdroGfCbGmeUPuCqiR8BetUhEXRfk4ui?usp=sharing)
    * Used [GSA IR Email Template](https://docs.google.com/document/d/16h4gDq9JeW8JBhBDswSvoGRWx6qQvX_4spyEZVbjlcA) to create and send notice to GSA Incident Response <gsa-ir@gsa.gov>, IT Service Desk <itservicedesk@gsa.gov> (or GSA IT Helpline called), and our [GSA ISSO and ISSM](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference/#emergency-contacts) **within 1 hour** of start of incident
    * **Every 30 minutes** ensures StatusPage and external stakeholders are updated
    * **Every 30 minutes** notifies Login.gov comms if the incident reaches 50% of the "Length of time" limit for the type of incident in the [Incident Response Thresholds for Communications](https://docs.google.com/document/d/19LfFyjlUeM2bbcztaMCswFm68FL5X51zzG1yNMQapz0/edit?skip_itp2_check=true&pli=1)

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
* If user or partner impacting, [StatusPage updated](https://manage.statuspage.io/login) notice posted using one of the pre-made `Outage` templates if applicable
* Checked [Incident Response Runbooks](https://github.com/18F/identity-devops/wiki/Incident-Response-Runbooks) for relevant runbooks to execute
* If secure shared notepad is needed, Google Doc opened and shared <https://drive.google.com/drive/folders/1TWTMp_w55niNuqC7vTPDEe5vkxaiP4P0>  (Contents should be copied to official issue)

## Remediate

* For security incidents, consult official policy before destroying ANY evidence! **Contain**: Detach a compromised instance, do not destroy!

Loop through per-role items until remediation is complete.

**By Role**
* Situation Lead (SL)
  * Well-being of group monitored, including self (Tired and stressed humans make poor decisions)
  * Keeps situation room clean - Non-responders need to move elsewhere
  * Rotations of all roles planned and performed to prevent any responder spending more than 3 hours in role
* Technical Lead (TL)
  * Lead technical response till issue is remediated
  * **OR** role is handed off
* Messenger (M)
  * **Every 30 minutes or when status changes** - Regular updates to interested parties provided
  * **Every 30 minutes or when status changes** - StatusPage updated
  * **Every 30 minutes** notifies Login.gov comms if the incident reaches 50% of the "Length of time" limit for the type of incident in the [Incident Response Thresholds for Communications](https://docs.google.com/document/d/19LfFyjlUeM2bbcztaMCswFm68FL5X51zzG1yNMQapz0/edit?skip_itp2_check=true&pli=1)
* Scribe (SC)
  * Ensure a timeline of significant events is recorder in the #login-situation Slack channel
  * Relay technical information to help someone NOT in the war room who wants to understand the incident

Upon remediation:
* Signaled end of incident in #login-situation once remediated
* Statuspage updated once confident that issue is remediated

## Retrospect

* Postmortem doc started from copy of [Postmortem Template](https://drive.google.com/open?id=1A9y94VgHPOcaCCTdGRh0aWINOrBjUwo2ZepzBlTM--8)
* Postmortem meeting scheduled with entire incident response team

# Resources

* [Login.gov Security Incident Response Guide]({% link _articles/secops-incident-response-guide.md %}): IR guidance and overview, defer to the official IR plan
* [Official Login.gov Incident Response plan](https://drive.google.com/file/d/1SVz5keBYiDSXvzBdkLFOqdnAplZWqL9D/view): The authoritative source for login
* [TTS incident response process](https://handbook.tts.gsa.gov/security-incidents/)
* [GSA IT - IT Security Procedural Guide: Incident Response](https://www.gsa.gov/cdnstatic/Incident_Response_%5BCIO_IT_Security_01-02_Rev_18%5D_03-26-2021docx.pdf)
* [NIST 800-61r2 Computer Security Incident Response Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)
