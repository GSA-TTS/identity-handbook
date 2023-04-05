---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually update the configuration of the IdP to provide error messaging to users in affected flows.

Currently, this is available for the following vendors:
- `vendor_status_acuant`
- `vendor_status_lexisnexis_instant_verify` (not used?)
- `vendor_status_lexisnexis_phone_finder` (ToDo: remove or update)
- `vendor_status_lexisnexis_trueid`
- `vendor_status_sms`
- `vendor_status_voice`

The possible values are:
- `operational`
- `full_outage`

The default value is `operational`, set in `config/application.yml.default`

To do the configuration change, edit the configuration (per the [guidance here]({% link _articles/appdev-secrets-configuration.md %}).

Once the restart completes, users in affected flows will be presented with an error message explaining the outage, or redirected to an error page if they are unable to continue.

Once we have received word that the vendor is back up and running, simply re-edit the configuration to delete the vendor status, or explicitly set it to `operational`.

For any vendor outage:
- If a new user attempts to sign up, they will be redirected to an outage page.
- If an existing user attempts to enter or re-enter the document
  authentication flow, they will be redirected to a vendor outage
  page. The system retains sufficient information for them to continue
  after the vendor outage is over.

The additional user-facing implications of setting each of the vendors
to `full_outage` are:

    - Acuant - none
    - Lexis Nexis Instant Verify - none
    - Lexis Nexis Phone Finder - none
    - Lexis Nexis TrueId - none
    - SMS
      - The `SMS` checkbox on the IDV dialogs will be disabled
      - New phone numbers for SMS 2FA will not be verified.
    - Voice -
      - New phone numbers for voice 2FA will not be verified
