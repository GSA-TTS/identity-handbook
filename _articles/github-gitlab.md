---
title: GitHub & GitLab
description: Team code repos, permissions, notification strategies
layout: article
category: Development
subcategory: Code
cspell: ignore omniauth
redirect_from: /articles/github.html
---

## Repositories

View a [list of all repositories](https://github.com/topics/login-gov) tagged for Login.gov.

Some repositories in GitHub are mirrored from our self-hosted GitLab.

### Applications

- [**`18f/identity-idp`**](https://github.com/18f/identity-idp)<br />
  [secure.login.gov](https://secure.login.gov)<br />
  IDP (main application)

- [**`18f/identity-pki`**](https://github.com/18f/identity-pki)
  PIV/CAC application

- [**`18f/identity-idp-config`**](https://github.com/18f/identity-idp-config) Service Provider (`service_providers.yml`) and Agency (`agencies.yml`) configuration repo that can be updated and deployed independently of the IDP.

- [**`18f/identity-dashboard`**](https://github.com/18f/identity-dashboard)
  Partner Dashboard for viewing and editing service provider configurations (only in the INT environment).

- [**`18f/identity-charts`**](https://github.com/18f/identity-charts){: .deprecated-link} (Archived) <br />
  [login-charts-server.app.cloud.gov](https://login-charts-server.app.cloud.gov/)<br />
  Metrics dashboard for Login.gov

### Libraries

- [**`18f/identity-hostdata`**](https://github.com/18f/identity-hostdata)
  Gem that provides functionality for our Ruby applications on our EC2 infrastructure to download secrets and read configs.

- [**`18f/identity-logging`**](https://github.com/18f/identity-logging)
  Gem that sets up common log formatting and configuration for Rails applications

- [**`18F/omniauth_login_dot_gov`**](https://github.com/18F/omniauth_login_dot_gov)
  Provides an Omniauth strategy for Login.gov that helps other projects integrate with Login.gov more easily. Some use cases include the [identity-dashboard](https://github.com/18f/identity-dashboard) as well as Touchpoints, USMC and search.gov

- [**`18f/identity-validations`**](https://github.com/18f/identity-validations)
  Gem that provides shared validations for the ServiceProvider model across the IDP and dashboard

- [**`18f/identity-telephony`**](https://github.com/18f/identity-telephony){: .deprecated-link} (Archived)
  Gem that provides a common interface for voice and SMS features across multiple vendor backends. This code has been moved into the IDP codebase.

- [**`18f/identity-doc-auth`**](https://github.com/18f/identity-doc-auth){: .deprecated-link} (Archived)
  Provides a library for performing document authentication. This code has been moved into the IDP codebase.

- [**`18f/identity-proofer-gem`**](https://github.com/18f/identity-proofer-gem){: .deprecated-link} (Archived)
  Provides a generic interface around identity proofing (IDV, identity verification) that is implemented by other proofers. This code has been moved into the IDP codebase.

- [**`18f/identity-lexisnexis-api-client-gem`**](https://github.com/18f/identity-lexisnexis-api-client-gem){: .deprecated-link} (Archived)
  Implementation of the identity-proofer interface for LexisNexis. This code has been moved into the IDP codebase.

- [**`18f/identity-aamva-api-client-gem`**](https://github.com/18f/identity-aamva-api-client-gem){: .deprecated-link} (Archived)
  Implementation of the identity-proofer interface for AAMVA for drivers licenses. This code has been moved into the IDP codebase.

### Example Applications

- [**`18f/identity-oidc-sinatra`**](https://github.com/18F/identity-oidc-sinatra) Example service provider that uses OpenID connect and Sinatra.

- [**`18f/identity-saml-sinatra`**](https://github.com/18F/identity-saml-sinatra) Example service provider that uses SAML and Sinatra.

- [**`18f/identity-saml-rails`**](https://github.com/18F/identity-saml-rails){: .deprecated-link} (Archived)
  Example service provider that uses SAML and Rails.

### Platform and Infrastructure

- [**`lg/identity-devops`**](https://gitlab.login.gov/lg/identity-devops)
  Platform CLI tools, Terraform for infrastructure as code (IaC), Chef for instance (server) provisioning, and so much more!  (Too much more?)

- [**`lg/identity-devops-private`**](https://gitlab.login.gov/lg/identity-devops-private)
  Per-application environment additional Terraform and Chef configurations

- [**`lg/identity-terraform`**](https://gitlab.login.gov/lg/identity-terraform)
  Publicly shared Terraform modules

- [**`lg/identity-cookbooks`**](https://gitlab.login.gov/lg/identity-cookbooks)
  Publicly shared Chef cookbooks

- [**`lg/identity-base-image`**](https://gitlab.login.gov/lg/identity-base-image)
  AWS EC2 Image (AMI) definitions and build pipelines to match

- [**`18f/identity-monitor`**](https://github.com/18f/identity-monitor){: .deprecated-link} (Archived)
  Smoke tests and NewRelic scripts that test the site

- [**`18f/identity-lambda-functions`**](https://github.com/18f/identity-lambda-functions)
  AWS Lambda functions and the code to deploy them - Only used for KMS matching code at this time

### Design

- [**`18f/identity-design-assets`**](https://github.com/18f/identity-design-assets)
  A place for the Login.gov design team to version and store design assets (illustrations, sketch files, etc.)

### Static Sites

- [**`GSA-TTS/identity-site`**](https://github.com/GSA-TTS/identity-site)<br />
  [login.gov](https://login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Public marketing page.

- [**`18f/identity-design-system`**](https://github.com/18f/identity-design-system)<br />
  The Login.gov Design System, an extension of the U.S. Web Design System used on Login.gov sites to consistently identify the Login.gov brand.

- [**`GSA-TTS/identity-dev-docs`**](https://github.com/GSA-TTS/identity-dev-docs)<br />
  [developers.login.gov](https://developers.login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Developer documentation and integration guides for OpenID Connect and SAML.

- [**`18f/connect.gov`**](https://github.com/18F/connect.gov){: .deprecated-link} (Archived)<br />
  [connect.gov](https://connect.gov/)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  A site to disambiguate the Login.gov's predecessor `connect.gov` from Connecticut's ConnectCT `connect.ct.gov`

- [**`18f/identity-partners-site`**](https://github.com/18F/identity-partners-site){: .deprecated-link} (Archived)<br />
  [partners.login.gov](https://partners.login.gov) <br />
  A site to present information for partners, now exists as `/partners` in the `identity-site` repo.

- [**`GSA-TTS/identity-reporting`**](https://github.com/GSA-TTS/identity-reporting)<br />
  [data.login.gov](https://data.login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Public reporting dashboard.

- [**`GSA-TTS/identity-handbook`**](https://github.com/GSA-TTS/identity-handbook)<br />
  [handbook.login.gov](https://handbook.login.gov/)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  This handbook!

- [**`lg-public/identity-internal-handbook`**](https://gitlab.login.gov/lg-public/identity-internal-handbook/)<br />
  [lg-public.pages.production.gitlab.login.gov/identity-internal-handbook/](https://lg-public.pages.production.gitlab.login.gov/identity-internal-handbook/)<br />
  Hosted on: GitLab Pages (self-hosted)<br />
  Internal version of this handbook (Private to Login.gov team only)

- [**`18f/identity-handbook-private`**](https://github.com/18f/identity-handbook-private){: .deprecated-link} (Archived)<br />
  Old, private version of this handbook! (Private to Login.gov team only)

## Permissions

### Requesting Access

To request access to GitHub:

1. Set up GitHub account per [TTS GitHub guidelines](https://handbook.tts.gsa.gov/tools/github/#1-complete-your-profile)
1. Join the [#admins-github](https://gsa-tts.slack.com/archives/C02KXM98G) Slack channel
1. Tag `@github-admins-login` and request to add your GitHub username to the following teams/orgs:
   1. [`18f/identity-core`][18f-identity-core]
   2. [`GSA-TTS/identity-core`][gsa-tts-identity-core]

[18f-identity-core]: https://github.com/orgs/18f/teams/identity-core
[gsa-tts-identity-core]: https://github.com/orgs/gsa-tts/teams/identity-core

### Repository Permissions

All Login.gov repos should have the following permissions. They can be changed by a current admin under "Settings" > "Manage Access" in GitHub.

| Group Name | Role | Applicable Orgs |
| -----------|------| ---- |
| identity-admins | Admin | 18f, GSA-TTS |
| identity-core | Write | 18f, GSA-TTS |
| identity-partners | Read | 18f |
| identity-ro | Read | 18f |

We should not have any individual access, only team access.

![Repository Permissions Screenshot]({{site.baseurl}}/images/github-repo-permissions.png)

## Workflows

### Signed Commits

Repositories hosted in the [GSA-TTS org](https://github.com/GSA-TTS/) on GitHub (the mostly [static sites](#static-sites)) **require signed commits**. See GitHub's documentation on [configuring git to sign commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).

We strongly recommend that you configure git to autosign commits (so you don't have to add `-S` to every commit)
  - The default settings for GPG only prompt for a password once every 10 minutes
  - You can set this up globally or per-repo (locally)
  - To verify that the signing has been enabled, in either your `~/.gitconfig` (global) or the `.git/config` in each repository (local), check for these values:

    ```
    [commit]
            gpgsign = true
    [user]
            signingkey = <<YOUR ID HERE>>
    ```

### Email Notifications and Filters

Default settings for GitHub can generate a lot of email that can be tough to sift through. Here
are some strategies for helping manage these notifications:

1. Create Gmail filters to help highlight mentions:

    - A filter to get emails out of the Inbox

      **list:18F.github.com OR list:gsa-tts.github.com**<br />
      Skip Inbox, Apply label: github

    - A mentions/me filter to highlight Pull Requests you're participating in (such as being tagged
      as a reviewer)

      **from:notifications@github.com to:me**<br />
      Apply label: github-me

   Example:

   ![Gmail GitHub filters]({{site.baseurl}}/images/gmail-github-filters.png)

1. In GitHub, only have notifications on for repositories you care about (unwatch all others).
   The 18F org has many repos that do not affect Login.gov.
   For example, set up "All Activity" for `identity-` repos, and "Participating" for all others.

   | Key Repositories       | Other Repositories |
   | -----------------------|--------------------|
   | ![All Activity]({{site.baseurl}}/images/github-all-activity.png) | ![Participating]({{site.baseurl}}/images/github-participating.png) |

### Running CI Outside of a Pull Request

Engineers may want to run CI before submitting their code for review. For example, this can be a helpful way to check that all tests pass. To run CI on a branch without creating a pull request:

1. Push the up to date branch to GitHub
2. Navigate to <https://gitlab.login.gov/lg/identity-idp/-/pipelines/new>
3. In the drop-down below `Run for branch name or tag`, select the branch for which you'd like to run CI

### Sharing Work With Other Engineers

Engineers might want to share work with other engineers, such as before starting a pairing session. To share work without creating a PR, consider using GitHub's "compare" feature.

1. Push the up to date branch to GitHub
2. From the repo's home page, select the branch
3. Click "Contribute" and select the left button, "Compare"
   ![Screenshot highlighting "Compare Branch" button]({{site.baseurl}}/images/example-use-of-compare.png)
4. Share the resulting url, eg <https://github.com/18F/identity-idp/compare/branch-name-goes-here>, with your fellow engineer.

Additionally, you can use [a script like `git-cmp`](https://github.com/zachmargolis/margs-dev/blob/main/scripts/git-cmp) that allows you to generate github compare urls from local branches.

### Code Reviews

See [Pull Request Review]({% link _articles/pull-request-review.md %})
