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

| | [OpenID Connect](https://gitlab.login.gov/lg/identity-oidc-sinatra) | [SAML](https://gitlab.login.gov/lg/identity-saml-sinatra) |
|---|-----|
{% for env in page.envs -%}
| {{ env }} | <https://{{ env }}-identity-oidc-sinatra.app.cloud.gov> | <https://{{ env }}-identity-saml-sinatra.app.cloud.gov> |
{% endfor %}

## Deploying

The sample apps deploy automatically when changes are merged to the `main` branch.

Refer to each project's GitLab CI/CD configuration for details on the deployment workflow:

- [identity-oidc-sinatra/.gitlab-ci.yml](https://gitlab.login.gov/lg/identity-oidc-sinatra/-/blob/main/.gitlab-ci.yml?ref_type=heads)
- [identity-saml-sinatra/.gitlab-ci.yml](https://gitlab.login.gov/lg/identity-saml-sinatra/-/blob/main/.gitlab-ci.yml?ref_type=heads)
