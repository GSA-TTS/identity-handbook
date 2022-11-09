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

In these environments

- int
- pt
- staging
- dm

The daily deploys are scheduled for **weekdays at 5pm UTC**. See
the [daily business schedule in identity-devops][identity-devops-schedule].

| UTC  | Local (<lg-local-zone-name />) |
|------|--------------------------------|
| 5pm  | <lg-local-time utc="5pm" />    |

[identity-devops-schedule]: https://github.com/18F/identity-terraform/blob/3a37047cfae6949dab1150025c528ccc5332f837/asg_recycle/main.tf#L44-L78

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
