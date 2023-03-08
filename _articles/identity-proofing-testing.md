---
title: Identity Proofing Testing
description: >
  Tips and tricks for testing identity proofing (IAL2 accounts) including
  example fake phone numbers and example PII
category: "AppDev"
subcategory: "Development"
layout: article
---

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

## Pass a YML for images

Instead of uploading images of IDs (since we aren't supposed to have PII in sandbox environments),
you can upload a [specially-formatted YML file](https://developers.login.gov/testing/#data-testing).

## Sample SSN

Our developer docs have [sample SSNs](https://developers.login.gov/testing/#personal-information-verification)
to get desired behavior.

## Sample Phone Numbers

We also have [sample phone numbers](https://developers.login.gov/testing/#phone-number-verification)
to generate various proofing responses.
