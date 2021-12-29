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

### Environments

In these lower environments

- dev
- int
- staging

### Schedule

The daily deploys are scheduled for **weekdays at 12am and 5pm UTC**

|  | UTC | Eastern | Central | Mountain | Pacific |
|--| --- | --- | --- | --- | --- |
| Daylight savings time<br />(March-November) | 12am | 8pm | 7pm | 6pm | 5pm |
| Standard time<br />(November-March)         | 12am | 7pm | 6pm | 5pm | 4pm |
| Daylight savings time<br />(March-November) | 5pm | 1pm | 12pm | 11am | 10am |
| Standard time<br />(November-March)         | 5pm | 12pm | 11am | 10am | 9am |