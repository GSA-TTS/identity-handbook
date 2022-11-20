---
title: "Contact Form Updating Instructions"
description: "Procedure for updating fields in the Help Center's Contact Form"
layout: article
category: "AppDev"
subcategory: "Tasks"
---

## Contact Form Runbook

### Enabling / Disabling the Contact Phone Number

The **Call us** section of the [Contact Form](https://login.gov/contact/) is
controlled by the `contact_phone_number_enabled` advanced setting.

To quickly change this setting:
1. Sign into [pages.cloud.gov](https://pages.cloud.gov)
1. Navigate to `identity-site`
1. Navigate to __Site Settings__, and open __Advanced Settings__
1. Change the line `contact_phone_number_enabled:` to `false` to hide the phone number or `true` to show the phone number
1. Select Save to commit the advanced settings
1. Wait 6-8 minutes for the site to rebuild and publish
1. Verify your intended changes are present on <https://login.gov/contact/>

## Contact Form Backend

The backend to the Login.gov marketing site [Contact Form](https://login.gov/contact/) is
a Salesforce instance.

{%- capture alert_content -%}
The backend will reject form posts that contain dropdown values it does not know about,
so new field options need to be added explicitly with the help of the Salesforce team
before we can deploy changes on our side.
{%- endcapture -%}
{% include alert.html content=alert_content alert_class="usa-alert--error" %}

### Salesforce Configuration and Change Procedure

To streamline working with the Salesforce team and their QA/validation process,
we've set up our Cloud.gov Pages preview site to

- disable captchas
- point at the sandbox instance

Check out this document with more details on the procedure, including who to contact:

- [Contact Form Procedure Doc][procedure]
- [Mirror of Contact Form Procedure Doc][procedure-mirror] in case access to the original
  is too restrictive

[procedure]: https://docs.google.com/document/d/1mMbDFzbzVKn1A1W87XFHakr-oz1-WKxBPQ3cT9VbEH4/edit
[procedure-mirror]: https://docs.google.com/document/d/1hQN8Az_ibSNf_c-iMR2RhRSZzz-RQtk6mZJW00-Cd2c/edit
