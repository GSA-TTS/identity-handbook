---
title: "Reporting Queries"
description: "Queries to run in the Rails console for common reporting questions"
layout: article
category: "AppDev"
---

## Fully Registered Users

Returns the number of fully registered users.

**Note**: This table has been backfilled as far back as 2017, so it is good for all time.

```ruby
RegistrationLog.where.not(registered_at: nil).count
```

## IAL2 Users

Returns the number of users with IAL2 credentials.

```ruby
Profile.where(active: true).count
```
