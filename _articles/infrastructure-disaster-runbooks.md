---
title: "Infrastructure Disaster Runbooks"
description: Recovering from really really bad stuff
layout: article
category: Infrastructure
---

## Overview

There are two items in the login.gov infrastructure that can not be replaced:

* RDS PostgreSQL Database - All the users' encrypted bundles live here.  Recovering from a backup will result
  in some users having to recreate accounts or reset passwords.  (See [Recovering RDS](#recovering-rds))
* KMS "Keymaker" - The AWS HSM backed KSM service for encryption and decryption.  KMS features a pending deletion
  feature to allow reconnecting if a KMS instance is accidentally marked for deletion. (See [Recovering KMS](#recovering-kms))

Other items may be slow to recover:

* DNS - Using .gov domains helps protect against some root level problems, but missing or incorrect DNS records mixed with long TTLs could cause
  a significant outage. (TBD)
* CDN - CloudFront operations often take up to 20 minutes to complete. (Unset `asset_host` in `application.yml` and recycle to disable
  CloudFront in the IdP)

## Recovering RDS

Restore from a snapshot.  (Details TBD)

## Recovering KMS

Each environment has at least one `keymaker` KMS instance with an alias of `ENVIRONMENT-login-dot-gov-keymaker`  The key and alias must be present and
the key must be enabled in order for the IdP to encrypt new user data and decrypt
saved user data.

If you have accidentally allowed `terraform` to delete the KMS key, follow these steps
to recover:

* Find the original key in the AWS Console - It will likely be listed with a status of "Deleting"   (The Description is listed in the details of each key)
* Use Key actions to cancel the deletion and then enable the key
* At this point the IdP should be working again.  Proceed to repair your state and correct the KMS alias
* Remove the state pointing to the new/bad key:
  ~~~
  tf-deploy ENVIRONMENT app state rm module.kms_keymaker_uw2.aws_kms_key.login-dot-gov-keymaker
  ~~~
* Remove the bad alias:
  ~~~
  tf-deploy ENVIRONMENT app destroy -target=module.kms_keymaker_uw2.aws_kms_alias.login-dot-gov-keymaker-alias
  ~~~
* Import the correct (old) key, replacing KEY_ID with the Key ID as shown in the console:
  ~~~
  tf-deploy ENVIRONMENT app import module.kms_keymaker_uw2.aws_kms_key.login-dot-gov-keymaker KEY_ID
  ~~~
* Run `tf-deploy ENVIRONMENT app plan` - Only one change should be listed: Recreating the KMS key alias resource `module.kms_keymaker_uw2.aws_kms_alias.login-dot-gov-keymaker-alias`
* Run a `tf-deploy ENVIRONMENT app apply` to update the alias
