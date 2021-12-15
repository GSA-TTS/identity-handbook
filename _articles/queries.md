---
title: "Reporting Queries"
description: "Queries to run in the Rails console for common reporting questions"
layout: article
category: "AppDev"
---

## Query timeout

For queries that take longer than the default timeout (2.5s), run the following command to extend the timeout.

**Note:** Please double check that you're on a read replica before running potentially expensive queries.

```ruby
ActiveRecord::Base.connection.execute 'SET statement_timeout = 200000'
```

## Total Registered

Returns the number of users that created accounts (this includes users who may not have fully registered, see [Fully Registered Users](#fully-registered-users) for that query)

```ruby
User.count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
User.where('created_at <= ?', date).count
```

## Fully Registered Users

Returns the number of fully registered users.

**Note**: This table has been backfilled as far back as 2017, so it is good for all time.

```ruby
RegistrationLog.where.not(registered_at: nil).count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
RegistrationLog.where('registered_at <= ?', date).count
```

## IAL2 Users

Returns the number of users with IAL2 credentials.

```ruby
Profile.where(active: true).count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
Profile.where(active: true).where('activated_at < ?', date).count
```
