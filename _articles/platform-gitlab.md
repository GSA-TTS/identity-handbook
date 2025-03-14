---
title: "GitLab"
description: "GitLab Setup"
layout: article
category: Platform
redirect_from: /articles/gitlab.html
cSpell: ignore omniauth loadtest secops hostdata fraudops cloudlib
---

# Introduction

Login.gov's GitLab is an integrated Source Code Management (SCM) and Continuous Integration (CI)/Continuous Deployment (CD)
solution customized for our needs and built with FedRAMP moderate controls to provide low friction and
remove many of the roadblocks we faced when trying to piece together multiple tools with varying
authorization levels.

# User Guide

Notes below are Login.gov specific and aim to get engineers and others started
using https://gitlab.login.gov

See [Learning More About GitLab](#learning-more-about-gitlab) for a list of
documentation and training resources.

## Getting an Account

Accounts are provisioned in code by the Login.gov Platform Team.  In general
this will be done as part of on-boarding.

If you do not have an account or need to change your group membership in
GitLab ask for help in the `#login-platform-help` channel and `@login-devtools-oncall`

## Logging In

Prerequisites:
* You MUST use secure.login.gov with your official duty GSA email address to sign in
* If you don't yet have an account on secure.login.gov, go ahead and make one (or be
  ready to create it when you first login to GitLab)
* You must use a phishing resistant multi-factor option for MFA which is one of:
  * PIV or CAC
  * Security Key (WebAuthN with a hardware key)

To log in:
* Go to <https://gitlab.login.gov>
* Click "Log in Using Login.gov"
* Sign in with your official duty email address
* Multi-factor authenticate with a security key, face/touch unlock, or PIV

## Getting Support

Login.gov's Platform Teams support the GitLab service.  For help from an on-call
platform engineer you can Slack a question in `#login-devops` and `@login-devtools-oncall`

For general GitLab support you can also directly use GitLab support.
See [GitLab Licensing and Support](https://gitlab.login.gov/lg/identity-devops/-/wikis/GitLab-Ultimate-Licensing-and-Support)


Note - If `secure.login.gov` is not available, existing Personal Access Tokens
continue to function.  We also have break-glass procedures if needed.
See [Runbook: GitLab Access Contingency Plan](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Gitlab-Access-When-IDP-is-Down)

## GitLab Migration
We are in the process of moving our repos to using GitLab as their primary source of truth.  Most repos will continue to mirror back to GitHub, in order to allow us to maintain public visibility.  Once we have migrated a repository, merging from any branch other than GitLab will be blocked, and all pull requests will need to be submitted via GitLab.  Our current timeline for migration is below:


| Repo Name                            | Planned Move Date | Status    |
| ------------------------------------ | ----------------- | --------- |
| identity-devops                      | 4/30/24           | moved     |
| identity-devops-private              | 4/30/24           | moved     |
| identity-terraform                   | 4/30/24           | moved     |
| identity-cookbooks                   | 4/30/24           | moved     |
| identity-base-image                  | 4/30/24           | moved     |
| identity-reporting-rails             | 4/30/24           | moved     |
| identity-dashboard                   | 5/15/24           | moved     |
| identity-design-system               | 6/6/24            | moved     |
| identity-oidc-sinatra                | 6/6/24            | moved     |
| identity-saml-sinatra                | 6/6/24            | moved     |
| identity-pki                         | 6/13/24           | moved     |
| identity-loadtest                    | 6/20/24           | moved     |
| identity-hostdata                    | 7/11/24           | moved     |
| identity-fake-server                 | 7/18/24           | moved     |
| identity-validations                 | 7/25/24           | moved     |
| identity-reporting                   | 7/25/24           | moved     |
| identity-handbook-private            | 8/28/24           | planned   |
| identity-idp                         | tbd               | on hold   |
| identity-idp-config                  | tbd               | on hold   |
| identity-handbook                    |                   | unplanned |
| identity-site                        |                   | unplanned |


## Personal Access Tokens

## Cloning A Repository

## Creating A New Repository

## Working With Jobs

## Learning More About GitLab

GitLab has robust documentation, all available at [docs.gitlab.com](https://docs.gitlab.com/)

Login.gov will be providing opportunities for in depth GitLab training.

# Platform Guide

This section is for Platform Engineers and others supporting the underlying
GitLab infrastructure.  Non-public details are omitted.

## Troubleshooting GitLab

Login.gov currently uses the GitLab Omnibus installation which is comprised of
a multitude of installed packages.  Here are some troubleshooting resources:

* [Omnibus Maintenance Commands](https://docs.gitlab.com/omnibus/maintenance/#maintenance-commands) includes notes on tools like:
  * `gitlab-ctl` - GitLab server control tool.  Check service status with `sudo gitlab-ctl status` or restart all services with `sudo gitlab-ctl restart`
  * `gitlab-psql` - Superuser SQL access
* [Omnibus Troubleshooting](https://docs.gitlab.com/omnibus/troubleshooting.html) - Common Omnibus issues
* [Starting a Rails Console](https://docs.gitlab.com/ee/administration/operations/rails_console.html#starting-a-rails-console-session) - Remember that GitLab is but a humble Rails app.  Use `sudo gitlab-rails console` to open a console.
* [GitLab Rails Console Cheat Sheet](https://comp.umsl.edu/gitlab/help/administration/troubleshooting/gitlab_rails_cheat_sheet.md) - More tricks from the GitLab support team
* [GitLab Runner Troubleshooting](https://docs.gitlab.com/runner/faq/#troubleshooting-gitlab-runner) - Some basic help, particularly for runners that are unable to register.

### Login.gov GitLab Runbooks

* [GitLab Access when Login.gov Is Down](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Gitlab-Access-When-IDP-is-Down)
* [GitLab CI Troubleshooting](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Gitlab-CI-Troubleshooting)
* [GitLab Backup and Disaster Recovery](https://gitlab.login.gov/lg/identity-devops/-/wikis/Disaster-Recovery:-Gitlab-Backup-and-Restore)

## Getting Support from GitLab

See [GitLab Licensing and Support](https://gitlab.login.gov/lg/identity-devops/-/wikis/GitLab-Ultimate-Licensing-and-Support)

## GitLab Staging Environment

We have a staging environment which is used to test out deploys destined for production.  It
can be found at <https://gitlab.gitstaging.gitlab.login.gov/>.  Right now, whenever the `stages/gitstaging` branch
changes, the gitlab prod environment will deploy it to gitstaging and run tests against it.

The root of the module that deploys it that
has it's config parameters set is in <https://github.com/18F/identity-devops/tree/main/terraform/gitlab/gitstaging>.

You can find it's deployment status in <https://gitlab.login.gov/lg/identity-devops/-/environments/4>.

## Authentication Setup

GitLab leverages Omniauth to allow users to sign in using a variety of services, including Login.gov (via SAML). To configure this:

1. Generate a cert and private key by following the instructions at <https://developers.login.gov/testing/#creating-a-public-certificate>:
```
openssl req -nodes -x509 -days 365 -newkey rsa:2048 -keyout private.pem -out public.crt
```

1. Grab the IdP sandbox signing certificate from <https://developers.login.gov/saml/> and get its fingerprint (use secure.login.gov instead of idp.int.identitysandbox.gov if you are doing this for gitlab prod/staging):
```
curl -s https://idp.int.identitysandbox.gov/api/saml/metadata{{ site.time | date: '%Y' }}
 \
| xml sel -N x="http://www.w3.org/2000/09/xmldsig#" -t -v '(//x:X509Certificate)[1]' \
| sed '1i\
-----BEGIN CERTIFICATE-----
' \
| sed '$a\
\
-----END CERTIFICATE-----
' \
| fold -w 64 \
| openssl x509 -noout -fingerprint \
| sed -E 's/.*=//'
```

1. Copy the IdP cert fingerprint, generated certificate, and generated private key to the per-environment S3 secrets bucket. Name them `saml_idp_cert_fingerprint`, `saml_certificate` and `saml_private_key`, respectively:
```
aws s3 cp - "s3://${SECRET_BUCKET}/alpha/saml_private_key" --no-guess-mime-type --content-type="text/plain" --metadata-directive="REPLACE"
    [...]
```

1. With the public cert generated above, and replacing `$ENVIRONMENT`, configure a test integration at https://dashboard.int.identitysandbox.gov with the following parameters:
  - Issuer: `urn:gov:gsa:openidconnect.profiles:sp:sso:login_gov:gitlab_$ENVIRONMENT`
  - Return to App URL: `'https://gitlab.$ENVIRONMENT.gitlab.identitysandbox.gov'`
  - Level of Service:  `Authentication Only` (*Formerly labeled `IAL1`)
  - Default Authentication Assurance Level (AAL): `AAL2 + Phishing-Resistant MFA`
  - Attribute_bundle: `email`
  - Identity Protocol: `saml`
  - Assertion Consumer Service URL: `'https://gitlab.$ENVIRONMENT.gitlab.identitysandbox.gov/users/auth/saml/callback'`
  - SAML Assertion Encryption: `'aes256-cbc'`
