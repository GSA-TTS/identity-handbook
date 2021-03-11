---
title: "Deploying the Sample Apps"
description: "How to deploy oidc-sinatra and saml-sinatra to cloud.gov"
layout: article
category: "AppDev"
---

## Apps

We deploy { two sample apps } &times; { two environments } in cloud.gov:

| | [OpenID Connect](https://github.com/18f/identity-oidc-sinatra/) | [SAML](https://github.com/18f/identity-oidc-saml/) |
|---|-----|
| int | <https://int-identity-oidc-sinatra.app.cloud.gov> | <https://int-identity-saml-sinatra.app.cloud.gov> |
| dev | <https://dev-identity-oidc-sinatra.app.cloud.gov> | <https://dev-identity-saml-sinatra.app.cloud.gov>

## Deploying

The sample apps deploy automatically to both `dev` and `int` environments when changes are merged to the `main` branch.

Refer to each project's CircleCI configuration for details on the deployment workflow:

- [identity-oidc-sinatra/.circleci/config.yml](https://github.com/18F/identity-oidc-sinatra/blob/main/.circleci/config.yml)
- [identity-saml-sinatra/.circleci/config.yml](https://github.com/18F/identity-saml-sinatra/blob/main/.circleci/config.yml)
