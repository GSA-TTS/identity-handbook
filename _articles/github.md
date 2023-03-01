---
title: GitHub
description: Team code repos, permissions, notification strategies
layout: article
category: Development
subcategory: Code
---

## Repositories

View a [list of all repositories](https://github.com/topics/login-gov) tagged for Login.gov

### Applications

- [**18f/identity-idp**](https://github.com/18f/identity-idp)<br />
  [secure.login.gov](https://secure.login.gov)<br />
  IDP (main application)

- [**18f/identity-pki**](https://github.com/18f/identity-pki)
  PIV/CAC application

- [**18f/identity-idp-config**](https://github.com/18f/identity-idp-config) Service Provider (`service_providers.yml`) and Agency (`agencies.yml`) configuration repo that can be updated and deployed independently of the IDP.

- [**18f/identity-dashboard**](https://github.com/18f/identity-dashboard)
  Partner Dashboard for viewing and editing service provider configurations (only in the INT environment).

- [**18f/identity-charts**](https://github.com/18f/identity-charts){: .deprecated-link} (Archived) <br />
  [login-charts-server.app.cloud.gov](https://login-charts-server.app.cloud.gov/)<br />
  Metrics dashboard for Login.gov

### Libraries

- [**18f/identity-hostdata**](https://github.com/18f/identity-hostdata)
  Gem that provides functionality for our Ruby applications on our EC2 infrastructure to download secrets and read configs.

- [**18F/omniauth_login_dot_gov**](https://github.com/18F/omniauth_login_dot_gov)
  Provides an Omniauth strategy for Login.gov that helps other projects integrate with Login.gov more easily. Some use cases include the [identity-dashboard](https://github.com/18f/identity-dashboard) as well as Touchpoints, USMC and search.gov

- [**18f/identity-validations**](https://github.com/18f/identity-validations)
  Gem that provides shared validations for the ServiceProvider model across the IDP and dashboard

- [**18f/identity-telephony**](https://github.com/18f/identity-telephony){: .deprecated-link} (Archived)
  Gem that provides a common interface for voice and SMS features across multiple vendor backends. This code has been moved into the IDP codebase.

- [**18f/identity-doc-auth**](https://github.com/18f/identity-doc-auth){: .deprecated-link} (Archived)
  Provides a library for performing document authentication. This code has been moved into the IDP codebase.

- [**18f/identity-proofer-gem**](https://github.com/18f/identity-proofer-gem){: .deprecated-link} (Archived)
  Provides a generic interface around identity proofing (IDV, identity verification) that is implemented by other proofers. This code has been moved into the IDP codebase.

- [**18f/identity-lexisnexis-api-client-gem**](https://github.com/18f/identity-lexisnexis-api-client-gem){: .deprecated-link} (Archived)
  Implementation of the identity-proofer interface for LexisNexis. This code has been moved into the IDP codebase.

- [**18f/identity-aamva-api-client-gem**](https://github.com/18f/identity-aamva-api-client-gem){: .deprecated-link} (Archived)
  Implementation of the identity-proofer interface for AAMVA for drivers licenses. This code has been moved into the IDP codebase.

### Example Applications

- [**18f/identity-oidc-sinatra**](https://github.com/18F/identity-oidc-sinatra) Example service provider that uses OpenID connect and Sinatra.

- [**18f/identity-saml-rails**](https://github.com/18F/identity-saml-rails) Example service provider that uses SAML and Rails.

### Platform and Infrastructure

- [**18f/identity-devops**](https://github.com/18f/identity-devops)
  Platform CLI tools, Terraform for infrastructure as code (IaC), Chef for instance (server) provisioning, and so much more!  (Too much more?)

- [**18f/identity-devops-private**](https://github.com/18f/identity-devops-private)
  Per-application environment additional Terraform and Chef configurations

- [**18f/identity-terraform**](https://github.com/18f/identity-terraform)
  Publicly shared Terraform modules

- [**18f/identity-cookbooks**](https://github.com/18f/identity-cookbooks)
  Publicly shared Chef cookbooks

- [**18f/identity-base-image**](https://github.com/18f/identity-base-image)
  AWS EC2 Image (AMI) definitions and build pipelines to match

- [**18f/identity-monitor**](https://github.com/18f/identity-monitor)
  Smoke tests and NewRelic scripts that test the site

- [**18f/identity-lambda-functions**](https://github.com/18f/identity-lambda-functions)
  AWS Lambda functions and the code to deploy them - Only used for KMS matching code at this time

### Design

- [**18f/identity-design-assets**](https://github.com/18f/identity-design-assets)
  A place for the Login.gov design team to version and store design assets (illustrations, sketch files, etc.)

### Static Sites

- [**18f/identity-site**](https://github.com/18f/identity-site)<br />
  [login.gov](https://login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Public marketing page.

- [**18f/identity-style-guide**](https://github.com/18f/identity-style-guide)<br />
  [design.login.gov](https://design.login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Walkthrough of Login.gov common styles. The respository also hosts the `identity-style-guide` npm package that contains the actual styles.

- [**18f/identity-dev-docs**](https://github.com/18f/identity-dev-docs)<br />
  [developers.login.gov](https://developers.login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Developer documentation and integration guides for OpenID Connect and SAML.

- [**18f/connect.gov**](https://github.com/18F/connect.gov)<br />
  [connect.gov](https://connect.gov/)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  A site to disambiguate the Login.gov's predecessor `connect.gov` from Connecticut's ConnectCT `connect.ct.gov`

- [**18f/identity-partners-site**](https://github.com/18F/identity-partners-site)<br />
  [partners.login.gov](https://partners.login.gov) <br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  A site to present information for partners

- [**18f/identity-reporting**](https://github.com/18f/identity-reporting)<br />
  [data.login.gov](https://data.login.gov)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  Public reporting dashboard.

- [**18f/identity-handbook**](https://github.com/18f/identity-handbook)<br />
  [handbook.login.gov](https://handbook.login.gov/)<br />
  Hosted on: [Cloud.gov Pages](https://pages.cloud.gov/)<br />
  This handbook!

- [**18f/identity-handbook-private**](https://github.com/18f/identity-handbook-private) <br />
  [login-handbook.app.cloud.gov](https://login-handbook.app.cloud.gov/)<br />
  Hosted on: [Cloud.gov](https://dashboard.fr.cloud.gov/)<br />
  Old, private version of this handbook! (Private to Login.gov team only)

## Permissions

All Login.gov repos should have the following permissions. They can be changed by a current admin under "Settings" > "Manage Access" in Github.

| Group Name | Role |
| -----------|------|
| identity-admins | Admin |
| identity-core | Write |
| identity-partners | Read |
| identity-ro | Read |

We should not have any individual access, only team access.

![Repository Permissions Screenshot]({{site.baseurl}}/images/github-repo-permissions.png)

## Email Notifications and Filters

Default settings for GitHub can generate a lot of email that can be tough to sift through. Here
are some strategies for helping manage these notifications:

1. Create Gmail filters to help highlight mentions:

    - A filter to get emails out of the Inbox

      **list:18F.github.com**<br />
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

## Running CI Outside of a Pull Request

Engineers may want to run CI before submitting their code for review. For example, this can be a helpful way to check that all tests pass. To run CI on a branch without creating a pull request:

1. Push the up to date branch to github
2. Navigate to https://gitlab.login.gov/lg/identity-idp/-/pipelines/new
3. In the drop-down below `Run for branch name or tag`, select the branch for which you'd like to run CI

## Sharing Work With Other Engineers

Engineers might want to share work with other engineers, such as before starting a pairing session. To share work without creating a PR, consider using github's "compare" feature.

1. Push the up to date branch to github
2. From the repo's home page, select the branch
3. Click "Contribute" and select the left button, "Compare"
   ![ExampleUseOfCompare]({{site.baseurl}}/images/example-use-of-compare.png)
4. Share the resulting url, eg https://github.com/18F/identity-idp/compare/branch-name-goes-here, with your fellow engineer.

## Code Reviews

See [Pull Request Review]({% link _articles/pull-request-review.md %})
