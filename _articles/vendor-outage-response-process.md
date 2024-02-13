---
title: "Vendor outage response process"
description: "What to do in the event of a 3rd party vendor outage."
layout: article
category: Security
---

If an outage in a third party vendor is identified, we can manually
update the configuration of the IdP to provide error messaging to
users in affected flows.

In addition, if we know in advance that a third party vendor will be
down (e.g. for scheduled maintenance), we can schedule a time window
for IdV to be down without anyone having to turn it off and then on
again manually.

The options for disabling part or all of IdV are:

* [Manually disable identity verification](#manually-disable-identity-verification)
* [Manually turn off individual vendors](#manually-turn-off-individual-vendors)
* [Schedule a maintenance window](#schedule-a-maintenance-window)

All of these methods involve changing configuration flags in the file
`config/application.yml`. To edit this file, use the [guidance
here]({% link _articles/appdev-secrets-configuration.md %}).  The
final step in the guidance is to [restart server instances]({% link
_articles/appdev-deploy.md %}#config-recycle). Once the restart completes, users in
affected flows will be presented with an error message explaining the
outage, or redirected to an error page if they are unable to continue.

Once we have received word that the vendor is back up and running,
simply re-edit the configuration and delete the vendor status or
maintenance window, and restart server instances again.

## Runbooks for individual vendors

| vendor                    | runbook                                                                                                                            |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| AAMVA                     | [Runbook: AAMVA DLDV outage](https://github.com/18F/identity-devops/wiki/Runbook:-AAMVA-DLDV-outage)                               |
| Acuant                    | TBD                                                                                                                                |
| LexisNexis TrueID         | [Runbook: LexisNexis TrueID outage](https://github.com/18F/identity-devops/wiki/Runbook%3A-LexisNexis-TrueID-outage)               |
| LexisNexis Instant Verify | [Runbook: LexisNexis Instant Verify outage](https://github.com/18F/identity-devops/wiki/Runbook:-LexisNexis-Instant-Verify-outage) |
| LexisNexis Phone Finder   | TBD                                                                                                                                |
| ThreatMetrix              | [Runbook: ThreatMetrix outage](https://github.com/18F/identity-devops/wiki/Runbook:-ThreatMetrix-outage)
| Pinpoint                  | TBD                                                                                                                                |

### Contact Information

For escalation contacts at our vendors, see the "Proofing vendors" section of [On Call Guide Quick Reference](https://github.com/18F/identity-devops/wiki/On-Call-Guide-Quick-Reference#proofing-vendors).

## Manually disable identity verification

For a full AAMVA outage, disable identity verification.

Operators can explicitly disable IdV using the `idv_available` configuration key:

```yaml
# Setting idv_available to false will disable
# unsupervised identity verification.
# Users will be shown an error message instead.
idv_available: false
```
For faster results, [recycle without a migration instance]({% link _articles/appdev-deploy.md %}#no-migration-recycle).

## Manually turn off individual vendors

Several vendors or third-party services can be turned off
individually. Each is controlled by a configuration flag:

| vendor     | flag(s)                                                                                                                       |
|------------|-------------------------------------------------------------------------------------------------------------------------------|
| AAMVA      | See [manually disable identity verification](#manually-disable-identity-verification)                                         |
| Acuant     | `vendor_status_acuant`                                                                                                        |
| LexisNexis | `vendor_status_lexisnexis_instant_verify` <br> `vendor_status_lexisnexis_phone_finder` <br> `vendor_status_lexisnexis_trueid` |
| Pinpoint   | `vendor_status_sms` <br> `vendor_status_voice`                                                                                |

The possible values for each flag:

- `operational`
- `full_outage`

The default value for each of the flags is `operational`.

When one or more of the flags are set to `full_outage`, some parts of
identity verification will be disabled.

As an overview:

- Setting `full_outage` for `acuant`, `lexisnexis_instant_verify`, or
  `lexisnexis_trueid` turns off pretty much everything. Identity verification
  is completely unavailable.

![total-outage](https://github.com/18F/identity-handbook/assets/101212334/710b6e6f-e111-4acb-b568-b234efa03c74)

- Setting `full_outage` for `lexisnexis_phone_finder` disables instant
  verification, but verification by mail is still available.

![mail-only](https://github.com/18F/identity-handbook/assets/101212334/3785cf49-a813-4774-ab50-2afe36549c11)

- Setting `full_outage` for `sms` or `voice` disables instant
  verification, but verification by mail is still available.

![mail-only](https://github.com/18F/identity-handbook/assets/101212334/767b1145-0f98-4c05-9fba-b410caf548b7)

  ID image uploads must be done on the device with which the user
  began verification. Normally, desktop computer users are able to
  use their phone to upload pictures of their ID. Desktop users will
  not be offered this choice.

The precise effects of each flag are:

#### `vendor_status_acuant`
  - Users will not be able to enter or re-enter the identity
    verification flow.

  - A user who has reset their password and does not have their
    personal key will not be able to reactivate their profile

#### `vendor_status_lexisnexis_instant_verify`
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
  - Users will not be able to enter or re-enter the identity
    verification flow.

  - A user who has reset their password and does not have their
    personal key will not be able to reactivate their profile

#### SMS
  - Users will only be able to verify their identity by mail.

  - Any user entering the verification flow will be presented with an
    outage screen telling them that their options are to verify by
    mail or wait until our vendor outage is resolved.

  - ID image uploads must be done on the device with which the user
    began verification. Normally, desktop computer users are able to
    use their phone to upload pictures of their ID. Desktop users will
    not be offered this choice when this flag is set to `full_outage`.

#### Voice
  - Users will only be able to verify their identity by mail.

  - Any user entering the verification flow will be presented with an
    outage screen telling them that their options are to verify by
    mail or wait until our vendor outage is resolved.

  - ID image uploads must be done on the device with which the user
    began verification. Normally, desktop computer users are able to
    use their phone to upload pictures of their ID. Desktop users will
    not be offered this choice when this flag is set to `full_outage`.

## Schedule a Maintenance Window

The scheduled maintenance window is controlled by the config flags

* `vendor_status_idv_scheduled_maintenance_start`
* `vendor_status_idv_scheduled_maintenance_finish`

These are string values that specify the start and end time of the
window. Use ISO8601 date format. For example:

* `2023-11-15T05:30Z` for a time in UTC
* `2023-11-15T01:30-5:00` for a time in Eastern Standard Time (5 hours
  behind UTC)

While the code will accept a wide variety of other formats for the
date and time, it will **fail silently, and not take IdV down for the
maintenance window** if it can't parse the values.

## Proofing Resolution Result Missing Alert
On rare occasions, the third party proofing checks will time out and the
system will log an `IdV: proofing resolution result missing` event.
This is a reasonably rare event, e.g., in the month of August, 2023,
this event only fired 103 times. That said, on August 9, 2023, we had
a third party outage that resulted in several events firing in a 15 minute
window.

We now trigger an alert to slack if we see 3 or more occurrences in a
15 minute window. If this alert fires, we should be looking for problems
with our third party vendors. Some places to start include the following
dashboards:

- [Verify Your Identity](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards/dashboard/prod-idv-verify-your-identity-overview)
- [IdV Monitoring Dashboard](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards/dashboard/prod-idp-idv-vendors)

## AAMVA DLDV Certificate Testing

Login.gov has infrequently been asked to submit transactions to the AAMVA DLDV CERT/Test environment.
The steps to test in our staging environment are outlined in [this Google doc](https://docs.google.com/document/d/1lfeFOF_965AA8r4SnZFppUgGrZKaEvMagUh4GT5dgF8/edit).
