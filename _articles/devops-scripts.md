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

After updating, [restart_passenger][passenger-restart] so that passenger is restarted and will download
this updated config without needing to stand up new instances.

[passenger-restart]: {% link _articles/appdev-deploy.md %}#passenger-restart

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

## `ls-servers`

Lists servers in an environment as a table

```bash
aws-vault exec sandbox-power --
    ./bin/ls-servers -e dev
```

## `query-cloudwatch`

**Note**: This script lives in the [identity-idp](https://github.com/18f/identity-idp)
repository now.

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

The script can output as new-line delimited JSON (`--json`) or as a CSV (`--csv`).

## `salesforce-email-lookup`

Takes in Salesforce case numbers (escalated from our user support team), and returns
the emails associated with those cases

- **Note**: Will pop open a browser to log in to SecureAuth, you'll need to have
  Salesforce access.

```bash
> aws-vault exec prod-power -- \
    ./bin/salesforce-email-lookup 01234567
+-------------+-------------------+
| case_number | email             |
+-------------+-------------------+
| 01234567    | email@example.com |
+-------------+-------------------+
```

The script can output as CSV with `--csv`.

## `scp-s3`

Imitates `scp` by copying a file in and out of S3. Use the instance ID to refer to remote hosts
(see [`ls-servers`](#ls-servers) to find them). **You must be on the VPN for this script to work.**

```bash
aws-vault exec sandbox-power --
    ./bin/scp-s3 i-abcdef1234:/tmp/file.txt ./file.txt
```

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

### `uuid-lookup`

Looks up the UUID for a user by their email address.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document uuid-lookup --any asg-dev-idp
```

### `review-pass`

Activates a user that has a profile deactivated due to a pending ThreatMetrix review status. 
Requires the user UUID from the `uuid-lookup` task.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document review-pass --any asg-dev-idp
```

### `review-reject`
Deactivates a user that has a pending ThreatMetrix review status with the reason "ThreatMetrix review rejected". 
Requires the user UUID from the `uuid-lookup` task.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-instance --document review-reject --any asg-dev-idp
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

"Safely" restart the NGINX/Passenger service which reloads `application.yml` from
S3.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-command -d passenger-restart -r idp -e dev
```

If this fails it is recommended that you perform a recycle to ensure
all instances are running from the same configuration.

### `worker-restart`

Safely restart GoodJob (idp-workers) service.

```bash
aws-vault exec sandbox-power --
    ./bin/ssm-command -d worker-restart -r worker -e dev
```

