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

- dm
- int
- staging

The daily deploys are scheduled for **weekdays at 12am and 5pm UTC**. See
the [daily business schedule in identity-devops][identity-devops-schedule].

|                                 | UTC | Eastern | Central | Mountain | Pacific |
|---------------------------------------------|------|------|------|------|------|
| Daylight savings time<br />(March-November) | 12am | 8pm  | 7pm  | 6pm  | 5pm  |
| Standard time<br />(November-March)         | 12am | 7pm  | 6pm  | 5pm  | 4pm  |
| Daylight savings time<br />(March-November) | 5pm  | 1pm  | 12pm | 11am | 10am |
| Standard time<br />(November-March)         | 5pm  | 12pm | 11am | 10am | 9am  |

[identity-devops-schedule]: https://github.com/18F/identity-terraform/blob/3a37047cfae6949dab1150025c528ccc5332f837/asg_recycle/main.tf#L44-L78

### Every 6 Hours Deploy Schedule

In these environments

- dev
- (personal sandbox environments)

Deploys are scheduled every 6 hours at **5am, 11am, 5pm, 11pm UTC**.

|                                 | UTC | Eastern | Central | Mountain | Pacific |
|---------------------------------------------|------|------|------|------|------|
| Daylight savings time<br />(March-November) | 5am  | 1am  | 12am | 11pm | 10pm |
| Standard time<br />(November-March)         | 5am  | 12am | 11pm | 10pm | 9pm  |
| Daylight savings time<br />(March-November) | 11am | 7am  | 6am  | 5am  | 4am  |
| Standard time<br />(November-March)         | 11am | 6am  | 5am  | 4am  | 3am  |
| Daylight savings time<br />(March-November) | 5pm  | 1pm  | 12pm | 11am | 10am |
| Standard time<br />(November-March)         | 5pm  | 12pm | 11am | 10am | 9am  |
| Daylight savings time<br />(March-November) | 11pm | 7pm  | 6pm  | 5pm  | 4pm  |
| Standard time<br />(November-March)         | 11pm | 6pm  | 5pm  | 4pm  | 3pm  |
