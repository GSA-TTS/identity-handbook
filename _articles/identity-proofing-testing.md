---
title: Identity Proofing Testing
description: >
  Tips and tricks for testing identity verification ("proofing")
category: "AppDev"
subcategory: "Development"
layout: article
---

## Choose your environment

We operate a number of different environments, and testing behavior is different in our lower environments (such as `int` or `dev`). 

You can use a [sample partner application]({% link _articles/appdev-cloud-gov-deploy.md %}) to start an identity-verified authentication.

Remember that `prod` and `staging` are typically hitting real vendors; but other environments typically use our "mock proofers" which simulate different experiences.

## Choose your verification level

At the sample application, you need to choose a "Level of Service" which simulates the different request types that a partner agency might send to Login.gov: 
* **Identity-verified** is our legacy identity proofing experience, which does not require a biometric comparison.
* **Biometric Comparison** is our new identity proofing experience, which either requires a **remote biometric** or requires that the user completes **in-person proofing**.

## Gmail Extra Emails Trick

Currently an account can only be verified once. When testing in lower environments, we
encourage creating new accounts to re-test the proofing flow using [this Gmail trick][gmail-trick].

Add `+` and some extra bits after your username to create a new email address that routes to your
same inbox. For example, if your GSA email is:

> first.last@gsa.gov

You can make extra accounts like:

> first.last**+1**@gsa.gov
>
> first.last**+2**@gsa.gov
>
> first.last**+abcdef**@gsa.gov

And as an easy way to keep track of the emails, consider date-stamping them:

> first.last**+20210704**@gsa.gov

[gmail-trick]: https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html

## Pass a YML for images (in `int` and `dev`)

Instead of uploading images of IDs (since we aren't supposed to have PII in sandbox environments),
you can upload a [specially-formatted YML file](https://developers.login.gov/testing/#data-testing).

## Sample SSN (in `int` and `dev`)

Our developer docs have [sample SSNs](https://developers.login.gov/testing/#personal-information-verification)
to get desired behavior.

## Simulate fraud tooling (in `int` and `dev`)

See [Device profiling and fraud detection]({% link _articles/device-profiling.md %}) for testing details.

## Sample Phone Numbers (in `int` and `dev`)

We also have [sample phone numbers](https://developers.login.gov/testing/#phone-number-verification)
to generate various proofing responses.
