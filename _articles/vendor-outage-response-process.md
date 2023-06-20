---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a 3rd party vendor is identified, we can manually
update the configuration of the IdP to provide error messaging to
users in affected flows.

There are two ways to turn off flows:

* [Completely disabling identity verification](#completely-disabling-identity-verification)
* [Turning off individual vendors](#turning-off-individual-vendors)

These two are functionally equivalent at present; they both turn off
identity verification (IdV). If one of the required vendors is marked
as `full_outage`, IdV will be unavailable and users will be shown an
error message.

Both methods involve changing configuration flags in the
file `config/application.yml`. To edit this file, use the
[guidance here]({% link _articles/appdev-secrets-configuration.md %}).
The final step in the guidance is to restart server instances. Once the
restart completes, users in affected flows will be presented with an
error message explaining the outage, or redirected to an error page if
they are unable to continue.

Once we have received word that the vendor is back up and running,
simply re-edit the configuration and delete the vendor status.

## Completely disabling identity verification

Operators can explicitly disable IdV using the `idv_available` configuration key:

```yaml
# Setting idv_available to false will disable
# unsupervised identity verification.
# Users will be shown an error message instead.
idv_available: false
```

## Turning off individual vendors

Several vendors or third-party services can be turned off
individually. Each is controlled by a configuration flag:

| vendor | flag(s) |
|---------|------|
| Acuant  | `vendor_status_acuant` |
| LexisNexis| `vendor_status_lexisnexis_instant_verify` <br> `vendor_status_lexisnexis_phone_finder` <br> `vendor_status_lexisnexis_trueid` |
| Pinpoint | `vendor_status_sms` <br> `vendor_status_voice` |


The possible values for each flag:

- `operational`
- `full_outage`

The default value for each of the flags is `operational`.

When one or more of the flags are set to `full_outage`, some parts of
account creation and identity verification will be disabled.

As an overview:

- Setting `full_outage` for `accuant`, `lexisnexis_instant_verify`, or
  `lexisnexis_trueid` turns off pretty much everything. Identity verification
  is completely unavailable.

- Setting `full_outage`for `lexisnexis_phone_finder` disables instant
  verification, but verification by mail is still available.

- Setting `full_outage` for `sms` or `voice` disables instant
  verification, but verification by mail is still available.

  ID image uploads from the user's phone are also disabled; instead of
  being given the option to use their phone or their computer for ID
  image upload, users will be routed directly to the upload screen for
  their computer.

The precise effects of each flag are:

#### `vendor_status_acuant`
  - New users will not be able to create an account

  - Users will not be able to enter or re-enter the identity
    verification flow.

  - A user who has reset their password and does not have their
    personal key will not be able to reactivate their profile

#### `vendor_status_lexisnexis_instant_verify`
  - New users will not be able to create an account

  - Users will not be able to enter or re-enter the identity
    verification flow.

  - A user who has reset their password and does not have their
    personal key will not be able to reactivate their profile

#### `vendor_status_lexisnexis_phone_finder`
  - Users will only be able to verify their identity by mail.

  - Any user entering the verification flow will be presented with an
    outage screen telling them that their options are to verify by
    mail or wait until our vendor outage is resolved.

  - Users will still be able to use their phone to upload images of
    their IDs.

#### Lexis Nexis TrueId `vendor_status_lexisnexis_trueid`
  - New users will not be able to create an account

  - Users will not be able to enter or re-enter the identity
    verification flow.

  - A user who has reset their password and does not have their
    personal key will not be able to reactivate their profile

#### SMS
  - Users will only be able to verify their identity by mail.

  - Users will only be able to upload their IDs from their computer;
    phone upload will be disabled.

#### Voice
  - Users will only be able to verify their identity by mail.

  - Users will only be able to upload their IDs from their computer;
    phone upload will be disabled.
