---
title: "Deploy Schedule for Automated Deploys"
description: "The daily deploy schedule for IDP, PKI and Dashboard in lower environments"
layout: article
category: "AppDev"
subcategory: "Deploying"
---

### Apps

These apps are deployed on weekdays:

- IDP
- PKI
- Dashboard

### Daily Business Schedule Deploys

#### Staging

| Eastern  |
|----------|
| 5pm      |

In staging, daily deploys are scheduled for **weekdays at 5pm Eastern**. See the [staging schedule][staging-specific-timing] for the time it's set to deploy, and [the staging variables][staging-specific-time-zone] for the time zone.

[staging-specific-timing]: https://github.com/18F/identity-terraform/blob/main/asg_recycle/schedule.tf#L15-L20
[staging-specific-time-zone]: https://github.com/18F/identity-devops-private/blob/main/vars/staging.tfvars#L4-L5

#### INT

| UTC  | Local (<lg-local-zone-name />) |
|------|--------------------------------|
| 5pm  | <lg-local-time utc="5pm" />    |

See the [int schedule][int-specific-timing] for the time it's set to deploy. Default is UTC, and int has the [overwrite timezone setting][int-specific-time-zone] commented out.

[int-specific-timing]: https://github.com/18F/identity-terraform/blob/main/asg_recycle/schedule.tf#L15-L20
[int-specific-time-zone]: https://github.com/18F/identity-devops-private/blob/main/vars/int.tfvars#L4-L5

### Every 6 Hours Deploy Schedule

In these environments

- dev
- (personal sandbox environments)

Deploys are scheduled every 6 hours at **5am, 11am, 5pm, 11pm UTC**.

| UTC  | Local (<lg-local-zone-name />) |
|------|--------------------------------|
| 5am  | <lg-local-time utc="5am" />    |
| 11am | <lg-local-time utc="11am" />   |
| 5pm  | <lg-local-time utc="5pm" />    |
| 11pm | <lg-local-time utc="11pm" />   |

### Not being deployed automatically

#### DM

See the [dm schedule][dm-specific-timing] for the time it's set to deploy (currently, `nozero_norecycle`), and [the dm variables][dm-specific-time-zone] for the time zone.

[dm-specific-timing]: https://github.com/18F/identity-terraform/blob/main/asg_recycle/schedule.tf#L3-L7
[dm-specific-time-zone]: https://github.com/18F/identity-devops-private/blob/main/vars/dm.tfvars#L4-L5

#### PT

See the [pt settings][pt-settings] for further info.

[pt-settings]: https://github.com/18F/identity-devops-private/blob/main/vars/pt.tfvars#L6

### Environment status

You can view the [Environment status](https://dashboard.int.identitysandbox.gov/env) which includes the SHA and the date of last deploy.
