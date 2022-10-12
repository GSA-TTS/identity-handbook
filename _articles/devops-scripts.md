---
title: "Scripts"
description: "Overview of scripts used for interacting with deployed boxes"
layout: article
category: "Development"
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

After updating, [recycle the app][config-recycle] so it creates new instances that will download
this updated config.

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

## `ls-servers`

Lists servers in an environment as a table

```bash
aws-vault exec prod-power --
    ./bin/ls-servers -e prod
````

## `query-cloudwatch`

In the web UI, cloudwatch results are limited to:
- 15 minutes of time
- 10,000 results

So to get around that, we have a script that can help split up the query into
multiple slices of time and help combine the results, use the `--slice` to
specify different slice durations.

```bash
aws-vault exec prod-power --
    ./bin/query-cloudwatch \
  --app idp --env prod --log events.log \
  --from 10d --slice 1d --query "$QUERY"
```

The script can output as new-line delimited JSON (`--json`) or as a CSV (`--csv`).

## `scp-s3`

Imitates `scp` by copying a file in and out of S3. Use the instance ID to refer to remote hosts
(see [`ls-servers`](#ls-servers) to find them). **You must be on the VPN for this script to work**

```bash
aws-vault exec prod-power --
    ./bin/scp-s3 i-abcdef1234:/tmp/file.txt ./file.txt
````

## `ssm-instance`

### `uuid-lookup`

Looks up the UUID for a user by their email address.

```bash
aws-vault exec prod-power --
    ./bin/ssm-instance --document uuid-lookup --any asg-prod-idp
````

### `rails-c`

Opens a Rails console (in read-only mode)

```bash
aws-vault exec prod-power --
    ./bin/ssm-instance --document rails-c --any asg-prod-idp
````

### `rails-w`

Opens a Rails console (in read-write mode). **Be careful please**.

```bash
aws-vault exec prod-power --
    ./bin/ssm-instance --document rails-w --any asg-prod-idp
````

### `tail-cw`

Tails and streams cloudwatch logs, specifically `/var/log/cloud-init-output.log`. Useful for checking that a box spins up correctly, such as [during a deploy]({% link _articles/appdev-deploy.md %}#follow-the-process).

```bash
aws-vault exec prod-power --
    ./bin/ssm-instance --document tail-cw --any asg-prod-idp
````
