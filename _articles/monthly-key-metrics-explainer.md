---
title: "Monthly Key Metrics Reporting"
description: "Overview of report, includes metrics and methodology"
layout: article
category: "Reporting"
---

Hello! This document is to help explain the measurements behind the Monthly Key Metrics Report email. If you have any questions, please reach out to Team Agnes in [#login-team-agnes][agnes-slack].

## Monthly Active Users

Re-formatting of the [`sp-active-users-report`](https://github.com/18F/identity-idp/blob/main/app/jobs/reports/sp_active_users_report.rb),
looks at `identities.last_ial1_authenticated_at` (for IAL1) and `identities.last_ial2_authenticated_at` for (IDV users) columns.

## Total User Counts

### User counts

Looks at the [total number of users created][query-total-registered]. This is not the [Fully Registered Users][query-fully-registered], which would include users who have created an account as well as set up their MFA.

### Verified Users

Counts currently-active at profile rows. Today, a user can only have one active profile.

[agnes-slack]: https://gsa-tts.slack.com/archives/C03N6KQBAKS
[query-total-registered]: {% link _articles/queries.md %}#total-registered
[query-fully-registered]: {% link _articles/queries.md %}#fully-registered-users