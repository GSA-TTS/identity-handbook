---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually update the configuration of the idp to divert users to an error page.

Currently, this is available for the following vendors:
- `vendor_status_acuant`
- `vendor_status_lexisNexis_instantverify`
- `vendor_status_lexisNexis_trueid`

The possible values are:
- `operational`
- `partial_outage`
- `full_outage`

The default value is `operational`, set in `config/application.yml.defaults`

To do the configuration change, edit the configuration (per the [guidance here]({% link _articles/appdev-secrets-configuration.md %}).

Once the recycle completes, users will be diverted to an error page, rather than hitting an unexpected error when the system attempts to access the vendor in question.

Once we have received word that the vendor is back up and running, simply re-edit the configuration to delete the vendor status, or explicitly set it to `operational`.
