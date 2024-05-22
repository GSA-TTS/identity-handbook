---
title: "Reporting Queries"
description: "Queries to run in the Rails console for common reporting questions"
layout: article
category: "Reporting"
subcategory: "Queries"
---

## Query timeout

For queries that take longer than the default timeout (2.5s), run the following command to extend the timeout.

**Note:** Please double check that you're on a read replica before running potentially expensive queries.

```ruby
ActiveRecord::Base.connection.execute 'SET statement_timeout = 200000'
```

## Total Registered

Returns the number of users that created accounts (this includes users who may not have fully registered, see [Fully Registered Users](#fully-registered-users) for that query). The count does not include users who have already deleted their accounts.

```ruby
User.count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
User.where('created_at <= ?', date).count
```

## Total Registered, Including Deletes

Returns the number of users who have ever created an account, including ones who may have later deleted their accounts.

```ruby
User.count + DeletedUser.count
```


To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)

User.where('created_at <= ?', date).count + DeletedUser.where('user_created_at <= ?', date).count
```

## Fully Registered Users

Returns the number of fully registered users. If a user has later deleted their account, they will not be counted.

**Note**: This table has been backfilled as far back as 2017, so it is good for all time.

```ruby
RegistrationLog.where.not(registered_at: nil).count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
RegistrationLog.where('registered_at <= ?', date).count
```

## Total Linked Users for a Service Provider

Returns the total number of registered users linked to a service provider or service providers.

```ruby
User.joins(:service_providers ).where(
  service_providers: {
    issuer: ['issuer:a', 'issuer:b']
  }
).count
```

## IDV Users

Returns the number of users with identity-verified credentials.

```ruby
Profile.where(active: true).count
```

To approximate the count at a past point in time, substitute `date` below:

```ruby
date = Date.new(2021, 1, 1)
Profile.where(active: true).where('activated_at < ?', date).count
```

## Active Partners

**Note**: The queries below can be run locally in the [`18F/identity-idp-config`](https://github.com/18F/identity-idp-config) project by running `bin/data_console` from within the root directory, instead of from a production instance. You will need to remove the `Agreements::` module from the Model name (i.e. start with just `PartnerAccount`) for queries run in the config repo.

The following query returns a list of the currently active Partner Accounts (i.e. organizations with an active IAA).

```ruby
Agreements::PartnerAccount.includes(:agency, :partner_account_status).where(partner_account_statuses: { name: 'active' }).distinct
```

The following query will return a list of the partners *with an active integration in production*, which may be a subset of the list of active partners.

```ruby
Agreements::PartnerAccount.includes(:agency, integrations: :service_provider).where(service_providers: { restrict_to_deploy_env: 'prod', active: true }).distinct
```
