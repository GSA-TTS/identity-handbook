---
title: "Deploy Schedule for Automated Deploys"
description: "The daily deploy schedule for IDP, PKI and Dashboard in lower environments"
layout: article
category: "AppDev"
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

The daily deploys are scheduled for **weekdays at 12am and 5pm UTC**. See
the [daily business schedule in identity-devops][identity-devops-schedule].

| UTC  | Daylight Savings               | Eastern | Central | Mountain | Pacific |
|------|--------------------------------------|------|------|------|------|------|
| 12am | Daylight savings time<br />(March-November) | 8pm  | 7pm  | 6pm  | 5pm  |
|      | Standard time                               | 7pm  | 6pm  | 5pm  | 4pm  |

[identity-devops-schedule]: https://github.com/18F/identity-terraform/blob/3a37047cfae6949dab1150025c528ccc5332f837/asg_recycle/main.tf#L44-L78

### Every 6 Hours Deploy Schedule

In these environments

- dev
- (personal sandbox environments)

Deploys are scheduled every 6 hours at **5am, 11am, 5pm, 11pm UTC**.

| UTC  | Daylight Savings               | Eastern | Central | Mountain | Pacific |
|------|--------------------------------------|------|------|------|------|------|
| 5am  | Daylight savings time<br />(March-November) | 1am  | 12am | 11pm | 10pm |
|      | Standard time                               | 12am | 11pm | 10pm | 9pm  |
| 11am | Daylight savings time<br />(March-November) | 7am  | 6am  | 5am  | 4am  |
|      | Standard time                               | 6am  | 5am  | 4am  | 3am  |
| 5pm  | Daylight savings time<br />(March-November) | 1pm  | 12pm | 11am | 10am |
|      | Standard time                               | 12pm | 11am | 10am | 9am  |
| 11pm | Daylight savings time<br />(March-November) | 7pm  | 6pm  | 5pm  | 4pm  |
|      | Standard time                               | 6pm  | 5pm  | 4pm  | 3pm  |
