---
title: "Deploying the Sample Apps"
description: "How to deploy oidc-sinatra and saml-sinatra to cloud.gov"
layout: article
category: "AppDev"
subcategory: "Deploying"
envs:
- dev
- int
- staging
- prod
---

## Apps

We deploy { two sample apps } &times; { four environments } in cloud.gov:

| | [OpenID Connect](https://github.com/18f/identity-oidc-sinatra/) | [SAML](https://github.com/18f/identity-oidc-saml/) |
|---|-----|
{% for env in page.envs -%}
| {{ env }} | <https://{{ env }}-identity-oidc-sinatra.app.cloud.gov> | <https://{{ env }}-identity-saml-sinatra.app.cloud.gov> |
{% endfor %}

## Deploying

The sample apps deploy automatically to both `dev` and `int` environments when changes are merged to the `main` branch.

Refer to each project's CircleCI configuration for details on the deployment workflow:

- [identity-oidc-sinatra/.circleci/config.yml](https://github.com/18F/identity-oidc-sinatra/blob/main/.circleci/config.yml)
- [identity-saml-sinatra/.circleci/config.yml](https://github.com/18F/identity-saml-sinatra/blob/main/.circleci/config.yml)
