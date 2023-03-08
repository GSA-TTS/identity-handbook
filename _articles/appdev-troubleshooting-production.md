---
title: "Triage User Issues"
description: Rails console scripts and Cloudwatch queries, for debugging the IDP
layout: article
category: AppDev
---

These are common scripts and tasks for lookup up data in production

## Prerequisites

Before you can access any systems, you will need to [set up AWS-vault](https://github.com/18F/identity-devops/wiki/Setting-Up-AWS-Vault)


## SSM Documents

We used AWS SSM, which is kind of like SSH. Our main script, `ssm-instance` is set up for a few documents aimed at common tasks. See the [guide to `ssm-instance`]({% link _articles/devops-scripts.md %}#ssm-instance) for more information
on the script and the documents.

## Inside a Rails Console

Inside a Rails console (see [`rails-c`]({% link _articles/devops-scripts.md %}#rails-c)) here are some other things you can do to quickly get a sense of how a user's account is set up

### Find a user by email

This is what [`uuid-lookup`]({% link _articles/devops-scripts.md %}#uuid-lookup) does under the hood basically

```ruby
user = User.find_with_email('address@example.com')
user.uuid
```

### Check what MFA methods they have configured

```ruby
MfaContext.new(user).enabled_two_factor_configuration_counts_hash
=> { :phone => 1, :backup_codes => 10 }
```

### Check events

```ruby
user.events.count
=> 10
user.events.pluck(:created_at).minmax
=> [Mon, 03 Apr 2021 18:53:38.820730000 UTC +00:00, Wed, 29 Jun 2022 16:47:46.275708000 UTC +00:00]
```

### Check what SPs the user has connected to

```
user.identities
```

## Cloudwatch Logs

Once you have a user's UUID (from [`uuid-lookup`]({% link _articles/devops-scripts.md %}#uuid-lookup)), you can look in Cloudwatch logs for
events.log events for that user.

For a full list of documented events, see [Analytics Events]({% link _articles/analytics-events.md %})

### Cloudwatch Insights

1. Open up AWS console (`aws-vault login prod-power`)
2. Navigate to "Cloudwatch", then find "Logs Insights"
3. Select `prod_/srv/idp/shared/log/events.log` from "Log Groups"
4. Select a time range
5. Enter a query

#### Saved Queries

On the right side of the page, we have a few saved queries useful for common triage tasks under "user" under "prod".

![saved user queries in Cloudwatch Insights]({{ site.baseurl }}/images/cloudwatch-saved-queries-users.png)

### Via the command line

Cloudwatch queries are limited to 15 minutes and 10,000 rows. To get around these limitations,
we have a script that runs the same query over adjacent slices in time, see the
[guide to `query-cloudwatch`]({% link _articles/devops-scripts.md %}#query-cloudwatch) for more
information.

### Sample Queries

A sample triage query for a particular user might look like this:

```cloudwatch
fields
  name,
  properties.user_id,
  properties.user_ip,
  properties.event_properties.success,
  @timestamp,
  @message
| filter properties.user_id = "USER_ID_HERE"
| sort @timestamp desc
| limit 10000
```

## Workflows

### Find a user by phone number

We don't have indexed lookups by phone number so we need to combine a few approaches to get a user's phone number

1. Normalize and fingerprint the phone

    In a Prod Rails console (to use the correct hash salts)

    ```ruby
    parsed_phone = Phonelib.parse("+1 (888) 867-5309")
    fingerprints = [
      Pii::Fingerprinter.fingerprint(parsed_phone.e164),
      *Pii::Fingerprinter.previous_fingerprints(parsed_phone.e164)
    ]
    # => ["aaa", "bbb", "ccc"]
    ```

2. In Cloudwatch, look up OTP requests to those fingerprints. It helps to have an approximate date
   this user was active to help narrow down the Cloudwatch search time frame.

   ```cloudwatch
   fields
     properties.user_id,
     @timestamp
   | filter name = 'Telephoy: OTP sent'
   | filter properties.event_properties.phone_fingerprint in ["aaa", "bbb", "ccc"] # CHANGE THIS
   ```
