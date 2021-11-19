---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually update the configuration of the IdP to provide error messaging to users in affected flows.

Currently, this is available for the following vendors:
- `vendor_status_acuant`
- `vendor_status_lexisNexis_instantverify`
- `vendor_status_lexisNexis_trueid`
- `vendor_status_sms`
- `vendor_status_voice`

The possible values are:
- `operational`
- `partial_outage` (not yet implemented)
- `full_outage`

The default value is `operational`, set in `config/application.yml.default`

To do the configuration change, edit the configuration (per the [guidance here]({% link _articles/appdev-secrets-configuration.md %}).

Once the recycle completes, users in affected flows will be presented with an error message explaining the outage, or redirected to an error page if they are unable to continue.

Once we have received word that the vendor is back up and running, simply re-edit the configuration to delete the vendor status, or explicitly set it to `operational`.
