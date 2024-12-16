---
title: "Testing vendor APIs with live credentials"
description: "Best practices for testing with sensitive keys"
layout: article
category: "AppDev"
subcategory: "Development"
---

## Goals

Provide examples of how to use API credentials, to encourage good credential hygiene amongst Login.gov engineers.

See also: [TTS Handbook page on Sensitive Information][tts-handbook-sensitive-info]

[tts-handbook-sensitive-info]: https://handbook.tts.gsa.gov/general-information-and-resources/sensitive-information

## Approved places to put credentials

* Google Docs (with limited visibility/permissions)
* Google Sheets (with limited visibility/permissions)
* Google Chat (not persisted)
* S3 config YMLs
* AWS Secrets Manager

## Do's

* Only share credentials via [approved places to put credentials](#approved-places-to-put-credentials)
* Develop iteratively
* Reference only fragments of keys ("API key ending in `...xyz123`")

## Don'ts

* Do not share credentials in Slack (FOIA-able)
* Do not store credentials on developer laptops at all
* Do not commit credentials to source

## Example Workflow

**Goal:** test against a brand new partner API using live credentials for their test/sandbox/staging environment

{% component alert type=:warning %}
**Note**: Production credentials and sending production data should only happen in the production environment (`prod`, `staging`, `dm`)
{% endcomponent %}

1. Write code locally, read secrets from [`IdentityConfig.store.xyz`]({% link _articles/appdev-secrets-configuration.md %}#configuration-in-rails-apps)
1. Upload actual credentials to S3 YML in a sandbox env (for test credentials) or prod env (for live credentials), use [app-s3-secret]({% link _articles/devops-scripts.md %}#app-s3-secret)
1. Open a remote rails console, [ssm-instance rails-c]({% link _articles/devops-scripts.md %}#rails-c)
1. Manually paste in code to that Rails console (monkey patching)
1. Run the code in that Rails console
1. (repeat step 4-5 as needed to iterate)
