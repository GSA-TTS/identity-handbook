---
title: GitHub
description: Team code repos
layout: article
category: Development
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

- [**18f/identity-charts**](https://github.com/18f/identity-charts) <br />
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

### Infrastructure

- [**18f/identity-devops**](https://github.com/18f/identity-devops)
  Chef and terraform

- [**18f/identity-devops-private**](https://github.com/18f/identity-devops-private)
  Additional terraform configurations

- [**18f/identity-terraform**](https://github.com/18f/identity-terraform)
  Additional terraform modules

- [**18f/identity-monitor**](https://github.com/18f/identity-monitor)
  Smoke tests and NewRelic scripts that test the site

- [**18f/identity-lambda-functions**](https://github.com/18f/identity-lambda-functions)
  AWS Lambda functions and the code to deploy them

### Design

- [**18f/identity-design-assets**](https://github.com/18f/identity-design-assets)
  A place for the Login.gov design team to version and store design assets (illustrations, sketch files, etc.)

### Static Sites

- [**18f/identity-site**](https://github.com/18f/identity-site)<br />
  [login.gov](https://login.gov)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  Public marketing page.

- [**18f/identity-style-guide**](https://github.com/18f/identity-style-guide)<br />
  [design.login.gov](https://design.login.gov)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  Walkthrough of Login.gov common styles. The respository also hosts the `identity-style-guide` npm package that contains the actual styles.

- [**18f/identity-dev-docs**](https://github.com/18f/identity-dev-docs)<br />
  [developers.login.gov](https://developers.login.gov)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  Developer documentation and integration guides for OpenID Connect and SAML.

- [**18f/connect.gov**](https://github.com/18F/connect.gov)<br />
  [connect.gov](https://connect.gov/)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  A site to disambiguate the Login.gov's predecessor `connect.gov` from Connecticut's ConnectCT `connect.ct.gov`

- [**18f/identity-partners-site**](https://github.com/18F/identity-partners-site/pull/1)<br />
  Eventually <https://partners.login.gov> but temporarily preview at <https://cg-23777731-2d5f-44ad-8cd2-5dc27ca6af07.app.cloud.gov/preview/18f/identity-partners-site/initial-content/> <br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  A site to present information for partners

- [**18f/identity-reporting**](https://github.com/18f/identity-reporting)<br />
  [login.gov](https://data.login.gov)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
  Public reporting dashboard.

- [**18f/identity-handbook**](https://github.com/18f/identity-handbook)<br />
  [handbook.login.gov](https://handbook.login.gov/)<br />
  Hosted on: [Federalist](https://federalistapp.18f.gov/)<br />
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
