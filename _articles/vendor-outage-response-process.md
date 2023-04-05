---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually update the configuration of the IdP to provide error messaging to users in affected flows.

Currently, this is available for the following vendors:
- `vendor_status_acuant`
- `vendor_status_lexisnexis_instantverify`
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

### Disabling identity verification (IdV)

Remote unsupervised identity verification depends on certain vendors being available to process requests. If one of the required vendors marked as `full_outage`, IdV will be unavailable and users will be shown an error message.

Alternately, operators can explicitly disable IdV using the `idv_available` configuration key:

```yaml
# Setting idv_available to false will disable
# remove unsupervised identity verification. 
# Users will be shown an error message instead.
idv_available: false
```
