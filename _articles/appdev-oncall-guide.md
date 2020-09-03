---
title: "AppDev Oncall"
description: "Responsibilities and runbook for AppDev oncall"
layout: article
category: AppDev
---

## Prerequisiets

Any engineer should be able to be oncall and we encourage all engineers to join the rotation to help
distribute the load. Before being added to the oncall rotation, an engineer must have these prerequisites:

1. Deploy access to production
2. SSH (or SSM) access to production

## OpsGenie Team & Rotations

For OpsGenie access, ask Mo and the devops team.

Team: [End User](https://login-gov.app.opsgenie.com/teams/dashboard/22edb9cb-3110-4494-9f02-db0243780189/members)

Rotations:

1. [Primary Oncall ("End-User Primary")](https://login-gov.app.opsgenie.com/settings/schedule/detail/142b8527-8ef6-4d9d-b81e-24b45d0499ba)
1. [Secondary Oncall ("End-User Secondary")](
https://login-gov.app.opsgenie.com/settings/schedule/detail/1271f41d-aa0c-4a3e-86aa-23162ab5fc9d)

## Handoff

The AppDev Rotation hands off every **Monday at 12pm Eastern (9am Pacific)**.

When handing off:

1. Update the `@login-appdev-oncall` Slack handle to be the new person
1. The outgoing oncall person should let the incoming person know about any outstanding issues or bugs

## Responsibilities

1. Each day, check NewRelic for errors over the last 24h in `prod` and `staging` (there is a Slack reminder in `#login-product` for this)
1. Throughout the week, check for automated vulnerability pull requests and try to get them merged. These links to go GitHub pull request filters, search within these for ones to `identity-` repos:

    * [synk-bot][snyk]
    * [dependabot][dependabot]

[snyk]: https://github.com/search?q=user%3A18F+user%3AGSA+is%3Aopen+archived%3Afalse+author%3Asnyk-bot&type=Issues
[dependabot]: https://github.com/search?o=asc&q=user%3A18F+user%3AGSA+author%3Aapp%2Fdependabot+is%3Aopen+archived%3Afalse&s=created&type=Issues
