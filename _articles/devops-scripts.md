---
title: "Scripts"
description: "Overview of scripts used for interacting with deployed boxes"
layout: article
category: "Development"
subcategory: "References"
---

These area scripts we use to interact with our deployed boxes,
they're all in the [identity-devops](https://github.com/18f/identity-devops) repo.

Each script also has a `--help` with additional documentation.

## Prerequisites

Before you can access any systems, you will need to [set up AWS-vault](https://github.com/18F/identity-devops/wiki/Setting-Up-AWS-Vault)

## `app-s3-secret`

These examples are for the IDP app in the `sandbox` AWS account and the `dev` environment:

### Viewing Secrets

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev
```

**Recommended**: `grep` for the keys you want to check

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev | grep foo
some_foo_key: 'true'
```

### Editing Secrets

The adding `--edit` will
- Download the secrets to a tempfile
- Open your `$EDITOR` (defaults to vim) to edit that copy
- Show you a diff of the preview before uploading
- Clean up the tempfile after

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev --edit
#
# opens vim
#
app-s3-secret: Here's a preview of your changes:
2a3
>   foobar: 'true'
app-s3-secret: Upload changes to S3? (y/n)
y
```

After updating, [recycle the configuration][config-recycle] so that
this updated config is picked up.

[config-recycle]: {% link _articles/appdev-deploy.md %}#config-recycle

### Looking at Changes to Secrets

The `--last` flags lets us look at the last N changes:

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev --last 1
Comparing: 2022-09-14 03:59:18 UTC (DtE0w1CVOkRrhxCSUcmFJhPFPsoJI9So)
       to: 2022-09-01 21:01:10 UTC (CRuDO2Ii4UIu14HCSgYj5g85fNUsLAHX)
(no diff)
```

The `--log` flag lets us look at all changes like `git log`

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev --log
Comparing: 2022-09-01 21:01:10 UTC (snK3BVbsNWMW-WhTLO-_RM_M53oI3DMB)
       to: 2022-08-30 20:06:14 UTC (FedolxH-3uevGB_WBcdliPBNx90a1tOK)
59c59
<   foo_bar: '["a","b","c"]'
---
>   foo_bar: '[]'
Comparing: 2022-08-30 20:06:14 UTC (FedolxH-3uevGB_WBcdliPBNx90a1tOK)
       to: 2022-08-30 14:56:21 UTC (6VuhS9TAH0EXtlfr0Ueo3P4QcIPhLAAF.F9Lyz)
75a76
>   abc: "123"
Comparing: 2022-08-30 14:56:21 UTC (6VuhS9TAH0EXtlfr0Ueo3P4QcIPhLAAF.F9Lyz)
       to: 2022-08-26 14:08:49 UTC (2fXwjhRjy9pyzlbKijgNbZlqoEyOLBRn)
59a60
>   def: "456"
```

### Comparing Secrets Across Environments

The `--diff` flag lets us compare values across environments (only within the same AWS account)

```bash
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --diff dev,int
+-----------------------+-----------+-----------+
| key                   | dev       | int       |
+-----------------------+-----------+-----------+
| foo_bar_baz           | (null)    | 50        |

```

## `data-pull`

This script helps streamline common lookup tasks from production, and supports looking up in batches.

- It defaults to outputting a table, but can output as CSV (`--csv`) or JSON (`--json`) as well.
- It defaults to showing `[NOT FOUND]` when values aren't found, this can be omitted with `--no-include-missing`

It has multiple subtasks:

### `uuid-lookup`

Looks up the UUID associated with emails

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp uuid-lookup email1@example.com email2@example.com
+--------------------+--------------------------------------+
| email              | uuid                                 |
+--------------------+--------------------------------------+
| email1@example.com | [NOT FOUND]                          |
| email2@example.com | 370e3f27-7376-4438-9be8-805eff343f35 |
+--------------------+--------------------------------------+
```

### `email-lookup`

Looks up the emails associated with UUIDs and shows their confirmation time

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp email-lookup 370e3f27-7376-4438-9be8-805eff343f35
+--------------------------------------+-------------+-------------------------+
| uuid                                 | email       | confirmed_at            |
+--------------------------------------+-------------+-------------------------+
| 370e3f27-7376-4438-9be8-805eff343f35 | foo@bar.com | 2023-05-10 01:35:41 UTC |
+--------------------------------------+-------------+-------------------------+
```

### `uuid-convert`

Looks up the internal Login.gov UUID from a partner agency UUID

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp uuid-convert aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
+--------------------------------------+---------------+--------------------------------------+
| partner_uuid                         | source        | internal_uuid                        |
+--------------------------------------+---------------+--------------------------------------+
| aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa | partner app 1 | 11111111-1111-1111-1111-111111111111 |
| bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb | other app     | 22222222-2222-2222-2222-222222222222 |
+--------------------------------------+---------------+--------------------------------------+
```

### `events-summary`

Summarizes events per user (count per day).

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp events-summary aaaa

+------+------------+--------------+
| uuid | date       | events_count |
+------+------------+--------------+
| aaaa | 2023-10-12 | 1            |
| aaaa | 2023-09-28 | 2            |
| aaaa | 2023-09-18 | 3            |
| aaaa | 2023-09-12 | 1            |
| aaaa | 2023-08-16 | 2            |
| aaaa | 2023-08-07 | 1            |
+------+------------+--------------+
```

### `profile-summary`

Looks up the profiles associated with UUIDs and shows their summary

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp profile-summary aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb cccccccc-cccc-cccc-cccc-cccccccccccc dddddddd-dddd-dddd-dddddddddddd wrong-uuid
+--------------------------------------+------------------+----------+-------------------------+--------------------------------+------------------------------------+--------------------------------+---------------------------+
| uuid                                 | profile_id       | status   | activated_timestamp     | disabled_reason                | gpo_verification_pending_timestamp | fraud_review_pending_timestamp | fraud_rejection_timestamp |
+--------------------------------------+------------------+----------+-------------------------+--------------------------------+------------------------------------+--------------------------------+---------------------------+
| aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa | 111              | active   | 2023-05-11 16:23:50 UTC |                                |                                    |                                |                           |
| aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa | 222              | inactive |                         | in_person_verification_pending |                                    |                                |                           |
| bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb | 333              | inactive |                         |                                | 2023-05-04 00:00:00 UTC            |                                |                           |
| cccccccc-cccc-cccc-cccc-cccccccccccc | 444              | inactive |                         |                                |                                    |                                | 2023-05-05 00:00:00 UTC   |
| dddddddd-dddd-dddd-dddd-dddddddddddd | [HAS NO PROFILE] |          |                         |                                |                                    |                                |                           |
| wrong-uuid                           | [UUID NOT FOUND] |          |                         |                                |                                    |                                |                           |
+--------------------------------------+------------------+----------+-------------------------+--------------------------------+------------------------------------+--------------------------------+---------------------------+
```

### `uuid-export`

Looking up a login UUID and returning a partner UUID

- It defaults to all users and return their partner UUIDs for all apps
- With `--requesting-issuer=ISSUER` returns their partner UUIDs for just the provided app

```bash
aws-vault exec prod-power -- \
  ./bin/data-pull --any asg-prod-idp uuid-export 1720c17c-1f71-4c53-bbe9-b04e0a310502  87e4630e-7c4a-444d-92ac-8bb13572f809
+--------------------------------------+-------------+----------------------------+---------------+
| login_uuid                           | agency      | issuer                     | external_uuid |
+--------------------------------------+-------------+----------------------------+---------------+
| 1720c17c-1f71-4c53-bbe9-b04e0a310502 | ABC         | urn:gov:gsa:sp:sinatra     | 12343         |
| 1720c17c-1f71-4c53-bbe9-b04e0a310502 | CDE         | urn:gov:gsa:sp:secondapp   | 56789         |
| 87e4630e-7c4a-444d-92ac-8bb13572f809 | [NOT FOUND] | [NOT FOUND]                | [NOT FOUND]   |
+--------------------------------------+-------------+----------------------------+---------------+
```

## `action-account`

This script helps streamline common account action tasks from production.

- It defaults to outputting a table, but can output as CSV (`--csv`) or JSON (`--json`) as well.
- It defaults to showing `Error: Could not find user with that UUID` when values aren't found, this can be omitted with `--no-include-missing`

It has multiple subtasks:

### `suspend-user`

Suspend User.

```bash
aws-vault exec prod-power -- \
  ./bin/action-account --any asg-prod-idp suspend-user 5e4a60e0-356c-4c6c-9ae5-6ff282da29af 63509e59-3306-4027-8e9b-2b43f3af9d2a wrong-uuid
+--------------------------------------+-------------------------------------------+
| uuid                                 | status                                    |
+--------------------------------------+-------------------------------------------+
| 5e4a60e0-356c-4c6c-9ae5-6ff282da29af | User has already been suspended           |
| 63509e59-3306-4027-8e9b-2b43f3af9d2a | User has been suspended                   |
| wrong-uuid                           | Error: Could not find user with that UUID |
+--------------------------------------+-------------------------------------------+
```

### `reinstate-user`

Reinstate User and sends an email

```bash
aws-vault exec prod-power -- \
  ./bin/action-account --any asg-prod-idp reinstate-user 5e4a60e0-356c-4c6c-9ae5-6ff282da29af 63509e59-3306-4027-8e9b-2b43f3af9d2a wrong-uuid
+--------------------------------------+--------------------------------------------------------+
| uuid                                 | status                                                 |
+--------------------------------------+--------------------------------------------------------+
| 5e4a60e0-356c-4c6c-9ae5-6ff282da29af | User has been reinstated and the user has been emailed |
| 63509e59-3306-4027-8e9b-2b43f3af9d2a | User is not suspended                                  |
| wrong-uuid                           | Error: Could not find user with that UUID              |
+--------------------------------------+--------------------------------------------------------+
```

### `confirm-suspend-user`

Sends an email confirming the user was suspended

```bash
aws-vault exec prod-power -- \
  ./bin/action-account --any asg-prod-idp confirm-suspend-user aaa bbb ccc
+------+-------------------------------------------+
| uuid | status                                    |
+------+-------------------------------------------+
| aaa  | User has been emailed                     |
| bbb  | User is not suspended                     |
| ccc  | Error: Could not find user with that UUID |
+------+-------------------------------------------+
```

### `review-pass`

Activates a user that has a profile deactivated due to a pending ThreatMetrix review status. 
Requires the user UUID from the `uuid-lookup` task.

```bash
aws-vault exec prod-power -- \
  ./bin/action-account --any asg-prod-idp review-pass uuid-1 uuid-2 uuid-3 wrong-uuid
+----------------+------------------------------------------------------------------+
| uuid           | status                                                           |
+----------------+------------------------------------------------------------------+
| uuid-1         | There was an error activating the user profile. Please try again.|
| uuid-2         | User profile has been activated and the user has been emailed.   |
| uuid-3         | User is past the 30 day review eligibility.                      |
| wrong-uuid     | Error: Could not find user with that UUID                        |
+--------------------------------------+-------------------------------------------+
```

### `review-reject`
Deactivates a user that has a pending ThreatMetrix review status with the reason "ThreatMetrix review rejected". 
Requires the user UUID from the `uuid-lookup` task.

```bash
aws-vault exec prod-power -- \
  ./bin/action-account --any asg-prod-idp review-reject uuid-1 uuid-2 uuid-3 wrong-uuid
+----------------+------------------------------------------------------------------+
| uuid           | status                                                           |
+----------------+------------------------------------------------------------------+
| uuid-1         | Error: User does not have a pending fraud review                 |
| uuid-2         | User profile has been deactivated due to fraud rejection.        |
| uuid-3         | User is past the 30 day review eligibility.                      |
| wrong-uuid     | Error: Could not find user with that UUID                        |
+--------------------------------------+-------------------------------------------+
```

## `ls-servers`

Lists servers in an environment as a table

```bash
aws-vault exec sandbox-power --
    ./bin/ls-servers -e dev
```

{%- capture idp_script_alert -%}
**Note**: This script lives in the [identity-idp](https://github.com/18f/identity-idp)
repository.
{%- endcapture %}

## `oncall/download-piv-certs`

{% include alert.html content=idp_script_alert alert_class="usa-alert--info" %}

This script takes a user UUID and downloads the public PIV certs they have tried to use
over the last 2 weeks:

```bash
> aws-vault exec prod-power -- ./bin/oncall/download-piv-certs uuid1 --out /tmp/certs
Downloading cert to: /tmp/certs/uuid1/cert1.pem
```

## `oncall/email-deliveries`

{% include alert.html content=idp_script_alert alert_class="usa-alert--info" %}

This script checks for email deliveries (and bounces) for emails by user UUID.
It queries within the last week.

```bash
> aws-vault exec prod-power -- ./bin/oncall/email-deliveries dd23dd99-4903-4ae0-99ff-70f909d6bf98 2128afdb-8d75-40cc-95ec-6cb062353448 362b7d1c-fff0-450a-8f28-face28bcf0c0
[ Querying logs ] -=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=-- Time: 00:01:03
+--------------------------------------+-------------------------+--------------------------------------------------------------+----------------+
| user_id                              | timestamp               | message_id                                                   | events         |
+--------------------------------------+-------------------------+--------------------------------------------------------------+----------------+
| 362b7d1c-fff0-450a-8f28-face28bcf0c0 | 2023-06-28 22:47:54.381 | 01010189043119b5-4f4880b9-7cc7-48bd-929c-88d490621f1e-000000 | Send, Bounce   |
| 362b7d1c-fff0-450a-8f28-face28bcf0c0 | 2023-06-28 22:47:22.215 | 0101018904309cd1-52e87ec8-60a7-45ad-acf2-f50ed606dc65-000000 | Send, Bounce   |
| 362b7d1c-fff0-450a-8f28-face28bcf0c0 | 2023-06-28 22:46:48.396 | 0101018904301817-b56e94db-149e-4b14-aab6-a6b94000d21e-000000 | Send, Bounce   |
| dd23dd99-4903-4ae0-99ff-70f909d6bf98 | 2023-06-28 17:00:43.217 | 0101018902f33e15-4ea51412-a7ad-4ab8-aaff-9b9db9ebb1ae-000000 | Send, Delivery |
| dd23dd99-4903-4ae0-99ff-70f909d6bf98 | 2023-06-28 16:42:56.906 | 0101018902e2f8af-c7768a8b-20a8-43b7-a0ee-bea9ac61207c-000000 | Send, Delivery |
| 2128afdb-8d75-40cc-95ec-6cb062353448 | 2023-06-28 16:42:12.436 | 0101018902e24b07-c39bb395-1f0a-48de-8cea-a0ebd056c64c-000000 | Send, Delivery |
+--------------------------------------+-------------------------+--------------------------------------------------------------+----------------+
```

## `oncall/otp-deliveries`

{% include alert.html content=idp_script_alert alert_class="usa-alert--info" %}

This script looks up SMS and voice OTP delivieries within the last 72 hours, specifically to streamline
escalating delivery issues to AWS Pinpoint support (they require traces within 72 hours).

- Use `--csv` to format output for an easier file attachment
- Use `--filter=VOICE` or `--filter=SMS` to filter to only one type of OTP delivery

```bash
> aws-vault exec prod-power -- ./bin/oncall/otp-deliveries uuid1
[ Querying logs ] -=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=---=--- Time: 00:00:18
+----------+-------------------------+------------------------------------------+---------------------+--------------+
| user_id  | timestamp               | message_id                               | delivery_preference | country_code |
+----------+-------------------------+------------------------------------------+---------------------+--------------+
| uuid1    | 2023-08-18 14:39:04.364 | e575171vl9e5kc81r236l497davrougdhn5l2kg0 | sms                 | US           |
+----------+-------------------------+------------------------------------------+---------------------+--------------+
```


## `query-cloudwatch`

{%- capture alert_content -%}
**Note**: This script has moved to the [identity-idp](https://github.com/18f/identity-idp)
repository.
{%- endcapture %}
{% include alert.html content=alert_content alert_class="usa-alert--warning" %}

In the web UI, cloudwatch results are limited to:
- 15 minutes of time
- 10,000 results

So to get around that, we have a script that can help split up the query into
multiple slices of time and help combine the results, use the `--slice` to
specify different slice durations. Use the `--complete` flag to automatically
split up slices that have 10k responses (the limit) to ensure a complete
listing of results.

```bash
aws-vault exec sandbox-power --
    ./bin/query-cloudwatch \
  --app idp --env dev --log events.log \
  --from 10d --slice 1d --query "$QUERY"
```

There are many options! Run with `--help` to see them all.

- The script can output as new-line delimited JSON (`--json`) or as a CSV (`--csv`).
- The script can run a query on disjoint dates via the `--date` flag like `--date 2023-01-01,2023-02-02`

##  `copy-cloudwatch-dashboard`

Given an experimental dashboard named `my-sample-dashboard`, run the
following in the `identity-devops` repo to create `prod-my-sample-dashboard`, `staging-my-sample-dashboard`, etc.:

```bash
aws-vault exec prod-power -- bin/copy-cloudwatch-dashboard -i my-sample-dashboard
```
Run it with `--help` for more information on arguments.

See also [Cloudwatch Dashboards]({% link _articles/appdev-cloudwatch-dashboard-guide.md%})

## `salesforce-email-lookup`

Takes in Salesforce case numbers (escalated from our user support team), and returns
the emails associated with those cases. It will also pull the associated user UUIDs
for those uses

- **Note**: Will pop open a browser to log in to SecureAuth, you'll need to have
  Salesforce access.

```bash
> aws-vault exec prod-power -- \
    ./bin/salesforce-email-lookup 01234567
+-------------+-------------------+--------------------------------------+
| case_number | email             | uuid                                 |
+-------------+-------------------+--------------------------------------+
| 01234567    | email@example.com | aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa |
+-------------+-------------------+--------------------------------------+
```

- UUID loading can be a bit slower, this can be disabled with `--no-uuids`
- It can output CSV with `--csv`
- If sharing in Slack, consider using `--slack` (which is a shorthand for `--redact` to redact emails `--markdown` for Slack-compatible markdown formatting)

## `scp-s3`

Imitates `scp` by copying a file in and out of S3. Use the instance ID to refer to remote hosts
(see [`ls-servers`](#ls-servers) to find them).

```bash
aws-vault exec sandbox-power --
    ./bin/scp-s3 i-abcdef1234:/tmp/file.txt ./file.txt
```

## `sms-me`

`sms-me` sends a test SMS message from each production region to a test phone
number. It allows for quick testing in case of a full or partial SMS outage.
(Production access is required to use this tool.)

Replace `PHONE_NUMBER` with the number you would like to send to.
(Make sure this number is your own or somebody's that you have permission to use.)

```bash
aws-vault exec sms-prod-power -- ./bin/sms-me PHONE_NUMBER
```

The script returns message IDs that can be checked against the SMS
delivery logs.

## `ssm-instance`

`ssm-instance` opens an interactive session with a server (EC2 instance)
over HTTPS using the SSM Session service.  No SSH needed!

### `-h` - Listing Documents

Shows usage plus a list of the available SSM session documents for the
application environment.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance -h
```

### `rails-c`

Opens a Rails console (in read-only mode)

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document rails-c --any asg-dev-idp
```

### `rails-w`

Opens a Rails console (in read-write mode). **Be careful please**.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document rails-w --any asg-dev-idp
```

### `tail-cw`

Tails and streams cloudwatch logs, specifically `/var/log/cloud-init-output.log`. Useful for checking that a box spins up correctly, such as [during a deploy]({% link _articles/appdev-deploy.md %}#follow-the-process).

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document tail-cw --any asg-dev-idp
```

## `ssm-command`

`ssm-command` issues a set of commands (as defined in a "command document") on
one or more servers (EC2 instances) using the SSM Command service.

***HAZARD WARNING***

Running commands on a fleet of servers is inherently risky.  It will cut you.
There are mild guardrails in `ssm-command`:

* By default it runs against 25% of servers at a time (adjustable with the `-p` or `-c` flag)
* It stops when any single command fails (exits with a non-zero status)
* `ssm-command` has a hard time dealing with new instances coming online or shutting down in an autoscaling group

### `-h` - Listing Documents

Shows usage plus a list of the available SSM command documents for the
application environment.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-command -h
```

### `passenger-restart`

{%- capture alert_content -%}
**2022-03-15**: This script is **not safe for prod use** at this time, it drops live requests instead of rotating smoothly. See [identity-devops#5651](https://github.com/18F/identity-devops/issues/5651) for more information. Only use it in emergency cases, or in a lower environment where live traffic does not matter.
{%- endcapture -%}

{% include alert.html content=alert_content alert_class="usa-alert--error" %}

"Safely" restart the NGINX/Passenger service which reloads `application.yml` from
S3.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-command -d passenger-restart -r idp -e dev
```

If this fails it is recommended that you perform a recycle to ensure
all instances are running from the same configuration.

Check out [passenger-restart](https://github.com/18F/identity-devops/wiki/Troubleshooting-Quick-Reference#passenger-restart) for more information on what the command can do

### `worker-restart`

Safely restart GoodJob (idp-workers) service.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-command -d worker-restart -r worker -e dev
```

