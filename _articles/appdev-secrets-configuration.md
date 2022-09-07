---
title: "Secrets and Configuration"
description: "How to update IDP and Rails app configuration (feature flags) and secrets application.yml"
layout: article
category: "AppDev"
subcategory: Development
---

## Overview

Our applications use configuration values stored in a local YAML file. The defaults for these values
are defined in `config/application.yml.default`. Configuration and secrets can be tailored per
environment by merging default values with an environment-specific YAML file.

* In local development, this file lives at `config/application.yml` and is created during setup.
* In deployed environments, this file is downloaded from S3 when activating or deploying an instance
  (see [`deploy/activate`][deploy-activate] and the [`activate.rb`][download-from-s3]).

**Changing configuration for a deployed application [requires a recycle][recycle-config]**, since
this merge step only happens at activation.

The S3 buckets that contain secrets are versioned, so we can recover old versions
if needed.

At the end of the day, since these are just files in S3, you can use whatever workflow
you want to download, edit, and write them. Make sure you clean up files on your local
machine when done.

[deploy-activate]: https://github.com/18F/identity-idp/blob/main/deploy/activate
[download-from-s3]: https://github.com/18F/identity-idp/blob/a95fd33d24c6761818993cfbc334a28986783034/lib/deploy/activate.rb#L93-L97
[recycle-config]: {% link _articles/appdev-deploy.md %}#config-recycle

## Using `app-s3-secret`

The easiest way to edit secrets is the `app-s3-secret` command in the `identity-devops` repo.

These examples are for the IDP app in the `sandbox` AWS account and the `dev` environment:

### Viewing Secrets

```bash
cd identity-devops
aws-vault exec sandbox-power -- \
  ./bin/app-s3-secret --app idp --env dev
```

**Recommended**: `grep` for the keys you want to check

```bash
cd identity-devops
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
cd identity-devops
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

After updating, recycle the app so it creates new instances that will download
this updated config.

```bash
cd identity-devops
aws-vault exec sandbox-power -- \
  ./bin/asg-recycle dev idp
```

Once the recycle is complete, it is important to [scale out old IDP instances]({% link _articles/appdev-deploy.md %}#config-recycle)
## Configuration in Rails Apps

To use a value in the `application.yml` in our Rails apps, follow these steps. The IDP, PKI,
and Dashboard apps all use this approach, with files named the same way.

1. Declare the feature flag in `lib/identity_config.rb`'s `#build_store` method.

    Example:
    ```ruby
config.add(:my_feature_flag, type: :boolean)
```

    View in
    [IDP repo](https://github.com/18F/identity-idp/blob/main/lib/identity_config.rb),
    [PKI repo](https://github.com/18F/identity-pki/blob/main/lib/identity_config.rb),
    [Dashboard repo](https://github.com/18F/identity-dashboard/blob/main/lib/identity_config.rb)

2. Configure a default value in `config/application.yml.default` at the top level of the file.
   **If there is no value specified in S3 for this config, this default value will be used in production**.

    Example:
    ```yml
my_feature_flag: 'true'
```

    View in
    [IDP repo](https://github.com/18F/identity-idp/blob/main/config/application.yml.default),
    [PKI repo](https://github.com/18F/identity-pki/blob/main/config/application.yml.default),
    [Dashboard repo](https://github.com/18F/identity-dashboard/blob/main/config/application.yml.default)

3. To use the value in code, access it via as a property of `IdentityConfig.store`

    Example:
    ```ruby
IdentityConfig.store.my_feature_flag
```
