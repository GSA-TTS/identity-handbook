---
title: "Secrets and Configuration"
description: >
  How to update IDP and Rails app configuration (feature flags) and secrets application.yml, and
  how to use the `app-s3-secret` script
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

The S3 buckets that contain secrets are versioned, so we can recover old versions
if needed.

[deploy-activate]: https://github.com/18F/identity-idp/blob/main/deploy/activate
[download-from-s3]: https://github.com/18F/identity-idp/blob/a95fd33d24c6761818993cfbc334a28986783034/lib/deploy/activate.rb#L93-L97

## Using `app-s3-secret`

The easiest way to interact with secrets is the `app-s3-secret` command in the `identity-devops` repo.
See [guide to app-s3-secret]({% link _articles/devops-scripts.md %}#app-s3-secret) for more information.

## Configuration in Rails Apps

To use a value in the `application.yml` in our Rails apps, follow these steps. The IDP, PKI,
and Dashboard apps all use this approach, with files named the same way.

1. Declare the configuration value in `lib/identity_config.rb`'s `#build_store` method.

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

This process can be used for any type of configuration value. To learn more about feature flags
specifically, refer to the [Feature Flags]({% link _articles/appdev-feature-flgs.md %}) for an
overview of how they are used used.
