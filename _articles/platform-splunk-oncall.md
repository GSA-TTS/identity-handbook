---
title: "Splunk On-Call"
description: Basic information on our on-call scheduling and alerting tool
layout: article
subcategory: How To
category: Team
---

## Purpose

Splunk On-Call provides on-call rotation scheduling and reliable alerting for
both automated and human generated events.  It is our primary emergency
notification system.

## Getting Started

### Getting an Account and Logging In

Access can be provided for any team member with an on-call or emergency notification
need.  Ask in `#login-platform-support` and tag `@login-platform-help` if you need
access.  One of the Splunk On-Call administrators, as noted in [Services and Accounts]({% link _articles/accounts.md %})
will review your request and send you an invitation via email.

Follow the link in the email to create your account.  Use `firstname.lastname`
for your username.  Use a strong disposable password when you setup the account.

Splunk On-Call is integrated with our enterprise SSO and all further sign ins should
use SSO:

* Go to <https://portal.victorops.com/membership/#/sso> (or click the "Single Sign On" link on the main portal page
* Enter `gsa_login` as the organizational slug value
* Log in with enterprise credentials

### Paging Policy

**Note: If you do not setup your paging policies, the default notification method is SMS.**

* In the Splunk On-Call portal, click you name in the upper right and choose "Profile"
* Scroll to "Contact methods" and ensure your phone is listed.  If not, use Add Contact Method to add it.
* Scroll further down to "Paging Policies" and edit your "Primary Paging Policy".
  Most engineers use a policy like:
  * Step 1 Immediately...
    * Send a push notification to -> all my devices
    * Execute the next step if I have not responded within 1 minute
  * Step 2 Then... (Use "Add a Step")
    * Send an SMS to -> (Your phone number)
    * Execute the next step if I have not responded within 1 minute
  * Step 3 Then...
    * Make a phone call to -> (Your phone number)
    * Execute the next step if I have not responded within 1 minute
  * Step 4 Finally...
    * Every 5 minutes until we have reached you
    * Send a push notification to -> all my devices
* Save the updated paging policy.

If you choose not to use the [iOS App](#ios-app) it is suggested
that you use SMS first, then voice, then a repeated SMS notification for the final
step.

### iOS App

It is recommended that you use the Splunk On-Call mobile app on your GFE iPhone.  Download
the app from the AppStore, open, and log in using the "Sign in with Enterprise SSO..."
option.  There are rough edges.  Make sure to do the following after installing
the app to ensure reliable notification, even in Do Not Disturb mode:

To enable in-application notifications:
* In the menu choose "Notifications".
* Turn on "Incidents are Critical Alerts" and then OK when asked to approve allowing emergency notification.
* Under "Incident Notifications" you can change notification sounds for the start ("Triggered incidents") and end ("Resolved incidents") of an incident.
* In your iPhone's Settings under "Splunk On-Call" make sure that access to "Contacts",
  "Background App Refresh", and "Cellular Data" are enabled.
  * Under the "Notifications" item ensure "Allow Notifications", "Critical Alerts", and "Sounds" are enabled.
  * See [iOS App Permission Settings](https://help.victorops.com/knowledge-base/ios-application/#ios-app-permission-settings) for details.
* **Make sure you have set up your [Paging Policy](#paging-policy)!**

As a backup you should also enable SMS notifications and if you don't mind some
tedium, you can add the list of Splunk On-Call numbers under a contact then
mark each as a favorite as noted here:
[Add Splunk On-Call to your contacts](https://help.victorops.com/knowledge-base/ios-application/#add-splunk-on-call-contact)

The app can be used to see your schedule and manage alerts for your team as well as others.
You can adjust notifications (including changing notification sounds) in the
"Notifications" section of the menu.

For more information see [Splunk On-Call - iOS Application](https://help.victorops.com/knowledge-base/ios-application/).

## Teams and Scheduling

Splunk On-Call is structured as follows:
* [Teams](https://help.victorops.com/knowledge-base/configure-teams/) - Each user
  must be assigned to one or more "Teams".
  We generally organize our team membership by collecting users who will be part
  of the same set of on-call rotations and have the same on-call responsibilities.
* [Rotations and Shifts](https://help.victorops.com/knowledge-base/rotation-setup/) -
  Each Team can have one or more Rotations, each with one or more Shifts.  For
  example, the "Support" team might have a rotation called "Primary" with a
  "daytime" shift for business hours and an "after-hours" shift for non-business hours.
* [Escalation Policies](https://help.victorops.com/knowledge-base/team-escalation-policy/) -
  Each team should have an escalation policy which defines the order of notifications
  when an incident is routed to the policy.
* [Routing Keys](https://help.victorops.com/knowledge-base/routing-keys/) - Direct
  incoming alerts to one or more escalation policies and are
  used by our integrations with CloudWatch and NewRelic to direct alerts appropriately.

See [Splunk On-Call Knowledge Base](https://help.victorops.com/) for more information.

## Active Integrations

Integrations are configured for the following:
* Email - Allows inbound email to trigger an incident.  Do not share these addresses
  outside of GSA!  (You may add the address to a Google Group if external paging
  is required.)
* CloudWatch - Allows CloudWatch to use SNS to raise an incident.  Used by our [splunk_oncall_sns Terraform module](https://github.com/18F/identity-devops/tree/main/terraform/modules/splunk_oncall_sns).
* NewRelic - Allows NewRelic to use Splunk On-Call as an alert destination.  Used by our [newrelic Terraform module](https://github.com/18F/identity-devops/tree/main/terraform/modules/newrelic).
* Slack - Allows Splunk On-Call to send alerts to Slack and recipients to acknowledge alerts.

## Support and Documentation

* Ask in #login-platform-support if you have a problem with Splunk On-Call.
* You can contact Splunk On-Call support using the "Chat with an Expert" link.
  on the bottom right of the screen in the Splunk On-Call portal.
* [Splunk On-Call Knowledge Base](https://help.victorops.com/) - Top level support site.
* [User Training](https://help.victorops.com/knowledge-base/user-training/) - General user training.
* [Login.gov Splunk On-Call Test Notes](https://docs.google.com/document/d/1Eb2V9D5Rl4eMpQgrleNbU9OShzg8Ql_25_NDvdZdoHU/edit#heading=h.80oxhhhdg1xe) -
  Notes from initial testing of Splunk On-Call.

