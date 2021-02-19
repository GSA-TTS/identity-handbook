---
title: "IDP Smoke Tests"
description: "Configuration and debugging for common issues"
layout: article
category: "AppDev"
---

## Overview

The smoke tests are a series of RSpec tests designed to run against deployed
environments (`dev`, `int`, `staging`, `prod`). We run then them about once per
hour per environment in CircleCI to make sure things are working.

The smoke tests are as "real" as we can make them, they:

- sign in via OpenID Connect and SAML through sample apps
- receive real emails to an example Gmail account
- receive real SMS messages to a Google Voice number

When the smoke tests pass, they give us some assurance that real users are able
to successfully perform common tasks in the IDP.

## Configuration

See the IDP's README for info on [how to set up and run the smoke tests][idpsmoke]

[idpsmoke]: https://github.com/18f/identity-idp#running-smoke-tests

## Debugging

### Common Steps

- Look at the error log in CircleCI
- Check the **Artifacts** tab, we now upload informatino about spec failures.
  Each failing spec will have a directory containing:
   - a `.txt` file with the spec filename, the error message
   - a `.png` screenshot and an `.html` snapshot of the page when the error
     occured, which can be used for visual inspection

### Failed to Find Email that Matched

```
     Failure/Error: raise "failed to find email that matched #{regex}"

     RuntimeError:
       failed to find email that matched (?-mix:(?<link>https?:.+reset_password_token=[\w\-]+))
```

This error occurs when we are expecting to find an email matching a given, regex.
It also can apply to SMS messages being delayed, since we configure our Google
Voice accounts to forward SMS messages to the email address.

In practice, this often means that emails or SMS may be delayed and
our tests are timing out before the emails arrive.

**What to do**: Go to the environment and try signing up for an account and
receiving and SMS to confirm deliverability of SMS and email.

### Link Not Found

```
  1) smoke test: SP initiated sign in OIDC redirects back to SP
     Failure/Error: click_link 'Sign In', href: '/Applicant/Profile/Dashboard'
```

A few of our tests use partner websites (such as USAJOBS in production) to test
signing in to login.gov. Occasionally those sites go down, and so the smoke tests
that use those sites fail.


<div class="usa-alert usa-alert--info usa-alert--no-icon" >
  <div class="usa-alert__body">
    <p class="usa-alert__text" markdown="1">
      **Note**: To have more control over these smoke tests, ideally we would
      host our own sample apps in production. Unfortunately, hosting an app
      in production requires including it in our ATO boundary, so to mimimize
      headaches, we choose to rely on partners like this.
    </p>
  </div>
</div>

**What to do**: Check the partner site manually, if it's down, try signing
in to login.gov through another partner site to make sure things are still up.

