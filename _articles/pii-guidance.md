---
title: "PII Guidance"
description: "Guidance on safe handling of Personally Identifiable Information"
layout: article
category: "Team"
---

## Overview

**Personally Identifiable Information** is any information that may be used to identify a member of the public. Login.gov and the GSA are committed to the privacy of the public, and all members of the Login.gov team must ensure PII is protected at all times. See <https://login.gov/policy/> and <https://login.gov/policy/our-privacy-act-statement/> for more on our official stance on privacy and the regulations and law that govern us.

## PII Handling Guidance

* PII must be encrypted at all times with the narrow exception of when in use, unlocked by the owner, and being used in a way the owner has approved
* PII entrusted to Login.gov must remain within the Login.gov system boundary (i.e. - prod) at all times, unless specifically authorized for transmission
* Never download PII to GFE or personal devices
* Treat PII as you would highly radioactive material - With extreme caution, as little handling as possible, and maintaining containment at all times

### Normal Use

* An individual's PII may leave the system boundary under these normal circumstances, if consented to by said individual:
  * PII sent to service provider (application) as part of sign in process
  * PII sent to proofing services as part of proofing process

### Investigative Use

* An email address and phone number may be provided to the OIG as part of an investigation
* If PII is requested by GSA IR or by other agencies the following must be understood and documented before any PII is extracted from the Login.gov system boundary:
  * Under what legal authority is the PII being requested?  (Team members should contact the [Office of General Counsel (OGC)](https://www.gsa.gov/about-us/organization/office-of-general-counsel-overview) for clarification as needed.)
  * Why is the PII needed?
  * What is the narrowest list of PII that fulfill the investigative need?
  * How will the PII be provided securely to the receiving party? (transit)
  * How will the PII be protected at rest, while in use, and within what authorized system boundary?
  * Who will have access and how will that access be fully auditable?
  * When will the data be deleted?
  * Have Login.gov leadership, CISO's office, and Privacy Office been notified regarding this request?

### Incidents

{%- capture alert_content -%}
In a situation? Check the [Incident Response Checklist]({% link _articles/incident-response-checklist.md %}) for a quick reference.
{%- endcapture -%}

#### Breach

* PII leaked or exfiltrated from the Login.gov system boundary will result in immediate execution of incident response procedures - See [Incident Response Checklist]({% link _articles/incident-response-checklist.md %})

#### PII Spillage

* PII leaked to logs or outside of the Login.gov IdP, but still contained within the ATO boundary, must not be removed from the protection of the boundary
* An investigation to verify that spilled PII has not left the system boundary must be completed
* Once investigation is completed, all spilled PII must be scrubbed from logs as soon as possible
