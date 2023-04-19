---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually update the configuration of the IdP to provide error messaging to users in affected flows.

There are two ways to turn off flows:
* [Completely disabling identity verification](#completely-disabling-identity-verification)
* [Turning off individual vendors](#turning-off-individual-vendors)

These two are functionally equivalent at present; they both turn off identity verification (IdV). If one of the required vendors is marked as `full_outage`, IdV will be unavailable and users will be shown an error message.

## Completely disabling identity verification

Operators can explicitly disable IdV using the `idv_available` configuration key:

```yaml
# Setting idv_available to false will disable
# remove unsupervised identity verification.
# Users will be shown an error message instead.
idv_available: false
```

## Turning off individual vendors

Several vendors or third-party services can be turned off individually. Each is controlled by a configuration flag:

| vendor | flag(s) |
|---------|------|
| Acuant  | `vendor_status_acuant` |
| LexisNexis| `vendor_status_lexisnexis_instant_verify` <br> `vendor_status_lexisnexis_phone_finder` <br> `vendor_status_lexisnexis_trueid` |
| Pinpoint | `vendor_status_sms` <br> `vendor_status_voice` |


The possible values for each flag:

- `operational`
- `full_outage`

Each flag can be set in the file `config/application.yml`. The default for each is `operational`.

To edit this file, use the [guidance here]({% link _articles/appdev-secrets-configuration.md %}). The final step in the guidance is to restart server instances. Once the restart completes, users in affected flows will be presented with an error message explaining the outage, or redirected to an error page if they are unable to continue.

Once we have received word that the vendor is back up and running, simply re-edit the configuration to delete the vendor status, or explicitly set it to `operational`.

When any flag is set to `full_outage` this is what happens:
- If a new user attempts to sign up, they will be redirected to an outage page.
- If an existing user attempts to enter or re-enter the document
  authentication flow, they will be redirected to a vendor outage
  page. The system retains sufficient information for them to continue
  after the vendor outage is over.

There are additional user-facing implications of setting some of the services to `full_outage`. At present, users will never see them because IDV is completely disabled when any service is turned off. Changes which would be visible are:

- Acuant - none
- Lexis Nexis Instant Verify - none
- Lexis Nexis Phone Finder - none
- Lexis Nexis TrueId - none
- SMS
    - The `SMS` checkbox on the IDV dialogs will be disabled
    - New phone numbers for SMS 2FA will not be verified.
- Voice -
    - New phone numbers for voice 2FA will not be verified
