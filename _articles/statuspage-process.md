---
title: "StatusPage Update Process"
description: "Publishing outage and maintenance information to StatusPage"
layout: article
category: Team
subcategory: Guides
---

Our public facing status page is: [status.login.gov](https://status.login.gov)

A high level overview of StatusPage management follows.  See
[support.atlassian.com/statuspage/resources/](https://support.atlassian.com/statuspage/resources/)
for full product documentation.

## Components

The following components are published to [status.login.gov](https://status.login.gov):

* **Login (secure.login.gov)** - Our production IdP service including authentication and identity verification services
* **Brochure site (login.gov)** - Our informational website
* **Customer Support** (group)
  * **Customer Support Online Form** - Our online customer support request form
  * **Customer Support Phone Line** - Our customer support phone line

Each component can be managed individually to share information to the public
and partners.

## StatusPage Admins

A link to the StatusPage management site and the list of StatusPage Admins is
available in the [Handbook Appendix](https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.1c3ohc5eqn5r)

You can ask for help from a StatusPage admin by using the Slack group `@login-statuspagers`.

The remaining content is for StatusPage admins.

## What to Share and What Not to Share

StatusPage is a public resource.  It is important to provide transparency without
oversharing.  Using [templates](#template-management) is advised to avoid having
to create language under duress.

Do:
* Use plain language
* Explain how our users (the public) and our agency partners are impacted
* Highlight what works and what does
* Focus on functionality and availability

Do Not:
* Share security details
* Share the name of any vendor or service provider
* Promise a time to recover service

## Managing an Outage

### Start

_(All work perfomed in the StatusPage management interface in the Login.gov "page".)_

* In **Incidents** click **Create incident**
* Use the **Apply template** dropdown on the top right and select an appropriate
  template from the **OUTAGE** list
* Refine the **Incident name** as needed
* Set the **Incident status** to the option that best describes where we are in the IR process
* Refine the **Message** as needed
* Ensure the affected component(s) are checked
* Change the status from **Operational** to the current status
  * Degraded Performance - Slow response or intermittent errors
  * Partial Outage - Some functionality unavailable
  * Major Outage - All or most functionality unavailable
* Ensure **Send notifications** is checked
* **PROOF READ THE INCIDENT NAME AND MESSAGE** - You are about to send notification
  to thousands of people!
* Click **Create** to post the incident to StatusPage and send notifications

### Update

The incident should be updated when:
* The status changes (e.g.: Moving from Investigating to Identified when the cause
  of the outage has been identified)
* When the operational status of the service(s) changes (e.g: Moving from Partial Outage
  to Degraded Performance)
* Every 30 minutes for a Major or Partial Outage, even if it is just to say
  "Login.gov is continuing to work to restore service"

To update the incident:
* If not already in the incident navigate to **Incidents** and click on it
* Change the **incident status** if appropriate
* Enter the **message**
* Change the availability if appropriate
* **PROOF READ**
* Click **Update** to post and send the update

### End

Status should be change to **monitoring** with an availability of **Operational**
for at the following time minimums before closing an incident:

* **Major Outage** or outage where things "mysteriously fixed themselves": 30 minutes
* **Partial Outage** or **Degraded Service**: 15 minutes

Once the appropriate time has passed with no issues you can close the incident.

* Change the **Incident status** to **Resolved**
* Enter a message like "Service has been functioning normally for over X minutes.  We consider this issue resolved."
* **PROOF READ**
* Click **Update** to close the incident and send notification

## Managing a Maintenance Window

Planned maintenance can be anything from maintenance that is anticipated to be
non-disruptive to a full complete outage window.

### Scheduling Maintenance

Whenever possible 14 calendar days of advanced notice should be provided
prior to maintenance.  Work with the Partnerships team to ensure additional
partner communication if maintenance must be performed with less than 14 days
notice.

Where possible the recommended change window should be used for maintenance.
See [Runbook: Maintenance Window Tasks](https://github.com/18F/identity-devops/wiki/Runbook:-Maintenance-Window-Tasks)
for the suggested time window.  It is recommended that you reach out to the
Partnerships team before scheduling maintenance in production, and that you
do the same for our `sandbox` (integration testing) environment.

Once the window has been selected, enter the StatusPage management interface and:
* Click "Incidents" on the left menu and then select the "Maintenances" tab in the center top list
* Click "Schedule maintenance"
* Click the "Apply template" pull down and look for an applicable maintenance type
* Make sure the "Maintenance name" starts with the text `[Planned Maintenance]`
  and accurately represents what users will experience
* Enter the maintenance window start date and time in **Scheduled Time**, minding
  the listed timezone (Eastern Time)
* Select the duration of the window using the **for** hours and minutes input
* Update the message section:
  * Include a "Maintenance Window" section that has the correct start and end dates listed for common timezones - You can use one of these templates:
~~~
# Standard Time template
Maintenance Window:
UTC: YYYY-MM-DD 06:00 to 09:30
Eastern:  YYYY-MM-DD 1:00AM to 04:30AM
Central:  YYYY-MM-DD 12:00AM to 03:30AM
Mountain:  YYYY-MM-DD-1 11:00PM to  YYYY-MM-DD 02:30AM
Pacific: YYYY-MM-DD-1 10:00PM to YYYY-MM-DD 01:30AM

# Daylight Savings Time template
Maintenance Window:
UTC: YYYY-MM-DD 05:00 to 08:30
Eastern:  YYYY-MM-DD 1:00AM to 04:30AM
Central:  YYYY-MM-DD 12:00AM to 03:30AM
Mountain:  YYYY-MM-DD-1 11:00PM to  YYYY-MM-DD 02:30AM
Pacific: YYYY-MM-DD-1 10:00PM to YYYY-MM-DD 01:30AM
~~~
* Ensure only the Component affected is selected: "Login (secure.login.gov)" for our main IdP
* Leave notification check boxes as is
* **BEFORE CLICKING SCHEDULE NOW**:
  * **PROOF READ** - Are you sure everything reads correctly?
  * Double check the schedule date/time and ensure it aligns with the **Maintenance Window** text
    in the **Message** box
* Click "Schedule now" to post the maintenance on the status page and send notifications

### Start

StatusPage will automatically post the scheduled maintenance to the page
and send notifications at the start of the maintenance window.

### Exceeding Window

Note that StatusPage will auto-close the incident
once the window has ran its defined duration.

If maintenance is not going to plan and you need to exceed the window:
* Under **Incidents** click on the open maintenance incident
* Select the **Schedule & Automation** tab
* Uncheck **Set status to completed** under **At the end of time for this maintenance**
* Click **Update**

Remember that you will need to manually close the incident once maintenance is
complete.

### End

Once work is complete and service has been fully restored you can close
the maintenance incident before the end of the window.  This is always
recommended to ensure the public knows they can resume using Login.gov.

* Under **Incidents** click on the open maintenance incident
* Change the status to **Completed**
* In **Message** enter **Maintenance has been completed and all systems are functioning normally.**
* Click **Update** to close the incident, mark services as Operational, and send notifications

## Template Management

Templates should be used wherever possible for incidents and maintenance.
When developing a new template reach out to Login.gov communications for help
refining and streamlining messaging.

See [StatusPage - Incident template](https://support.atlassian.com/statuspage/docs/create-an-incident-template/)
for more on templates.


## Correcting Uptime Reporting

StatusPage is integrated with NewRelic to provide request, latency, and uptime
information automatically.  At times the NewRelic Synthetics monitor used to
determine uptime of `secure.login.gov` and `login.gov` may produce a false
positive alarm and mark us as down.

In the case of a false positive we can update StatusPage to reflect uptime
accurately:

* Verify that traffic levels and availability were normal during the time in
  question
* Confirm your findings with platform or engineering leadership
* Follow instructions in [Changing component status outside of an incident](https://support.atlassian.com/statuspage/docs/what-is-a-component/#Changing-component-status-outside-of-an-incident)
  to update the specific time frame to accurately represent availability

Always err on the side of caution with any availability publishing adjustment.

