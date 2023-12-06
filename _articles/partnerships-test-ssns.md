---
title: "Adding Test SSNs to the Sandbox for Partners"
layout: article
description: "The steps necessary to add a set of test SSNs for use in the sandbox that don't meet the default format requirements."
category: Partnerships
---

## Background

By default, the Login.gov sandbox only permits users going through the Identity Verification workflow to enter Social Security Numbers (SSNs) that begin with either `900` or `666` since they are guaranteed not to be valid[^1].

On rare occasions, a partner may require us to permit a validly-formatted SSN in the sandbox so that validations in downstream systems pass during testing. If this is the case, we can update the configuration of the IdP to permit specific SSNs.

## Requirements

1. Have the partner provide a list of specific SSNs that need to be permitted
2. Have the latest version of the [`18F/identity-devops`](https://github.com/18F/identity-devops) repo cloned
2. Have sandbox access in AWS and [AWS Vault set up](https://github.com/18F/identity-devops/wiki/Setting-Up-AWS-Vault)

## Update the IdP Configuration

From the devops repo, run the following command to edit the configuration file for the IdP in the sandbox (see the [Secrets and Configuration page]({% link _articles/appdev-secrets-configuration.md %}) for more details:

```sh
bin/awsv sandbox bin/app-s3-secret --app idp --env int --edit
```

This should open the `application.yml` file for the sandbox IdP in your text editor. Edit the `test_ssn_allowed_list` config value to add additional SSNs - the setting should be written as a comma-separated string of SSNs with no dashes or spaces, e.g.

```yaml
  test_ssn_allowed_list: '111223333,444556666,777889999'
```

Save and quit your text editor and confirm that the diff looks correct to save the file. The changes will take effect when the sandbox environment recycles, which happens automatically most weekdays. If the change needs to take effect immediately, you can recycle the sandbox environment with this command.

```sh
aws-vault exec sandbox-power -- ./bin/asg-recycle int idp
```

[^1]: See our [dev docs](https://developers.login.gov/testing/#personal-information-verification) for more information on this restriction.

