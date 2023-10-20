---
title: "Identity Verification Rate Limiting"
description: "An overview of the rate limits which apply to identity verification"
layout: article
category: AppDev
subcategory: Architecture
cSpell: ignore Hubspot
---

This page lists the rate limits relating to identity verification, and provides details
about each of them. 

The following identity verification related rate limits exist:

- [Hybrid Handoff](#hybrid-handoff-rate-limiter)
- [Document Capture](#document-capture-rate-limiter)
- [Verify Info](#verify-info-rate-limiter)
- [Social Security Number](#social-security-number-verification-rate-limiter)
- [Address Verification](#address-verification-rate-limiter)
- [One time password entry](#one-time-password-entry-rate-limiter)
- [Verify by USPS mail](#verify-by-usps-mail-rate-limiter)

# Rate Limit Details
## Hybrid handoff rate limiter
### Description
This is the rate limiter for sending a link from Hybrid Handoff to enter the hybrid mobile flow, where we allow the user, where we allow the user
to upload their ID documents from their phone. It is referred to in code via
`:idv_send_link` and the `RateLimiter` class.

By default, the user is allowed 5 attempts in 10 minutes.

### Settings
`idv_send_link_max_attempts` - The maximum number of times that a user
can attempt to upload their ID documents from their phone within the
specified time window. Default: 5 attempts

`idv_send_link_attempt_window_in_minutes` - The length of time to
consider when determining whether a user is rate-limited. Default: 10
minutes

### How to trigger
Enter identity verification, and select hybrid handoff ('Use your
phone to take photos'). Click the `Back` link at the bottom of the next screen (Link Sent) and return to
'How would you like to add your ID?'. Click 'Send Link' again. Repeat until you become rate
limited.
### UI effects
The user will be presented with a flash error message every time they
attempt to enter hybrid handoff.

![Rate Limited Hybrid Handoff]({{site.baseurl}}/images/hybrid-handoff-limited.png)

## Document capture rate limiter
### Description
This is the rate-limit for the user's attempts to upload their ID
documents from either their computer or phone. It is referred to in
code via `:idv_doc_auth` and the `RateLimiter` class.

By default, the user is allowed 5 attempts within 6 hours.

Retrying with a different file after a failure and canceling out of
identity verification completely and then trying again both count
against this rate limiter. The user gets 5 attempts to upload
satisfactory images in 6 hours total, through any path.

### Config Settings
- `doc_auth_max_attempts` - The maximum number of times the user can
  attempt to upload their documents within the specified time
  window. Default: 5 tries

- `doc_auth_attempts_window_in_minutes` - The length of time to
  consider when determining whether a user is rate-limited. Default: 6
  hours.

### How to trigger
Repeatedly fail document auth (5 times). This can be done by using a
suitable `.yml` file rather than an image file during image
upload.

Use the same file for front and back images, but you must alternate
between two files on successive attempts. The UI will not let you try
twice in a row with the same file.

A pair of suitable files is:

```
image_metrics:
  back:
    HorizontalResolution: 100
```

```
failed_alerts:
  - name: Document Classification
    result: Attention
```

[More about Yaml files for testing and development](https://developers.login.gov/testing/#testing-identity-proofing)


### UI effects

After failing for the final time, the user will be redirected to a
rate limited screen. Any attempt to re-enter identity verification will also
redirect there.

![Failed and Rate Limited]({{site.baseurl}}/images/idv-doc-auth-limited.png)

## Verify info rate limiter
### Description
This is the rate-limit for verifying the user's information against
our external vendors. It is referred to in code via `:idv_resolution`
and the `RateLimiter` class.

By default, the user is allowed 5 attempts in 6 hours.

### Config Settings
- `idv_max_attempts` - The maximum number of times the user can
  attempt to upload their documents within the specified time
  window. Default: 5 tries

- `idv_attempt_window_in_hours` - The length of time to consider when
  determining whether a user is rate-limited. Default: 6 hours.

### How to trigger
Attempt verification with an SSN that does not begin with 900 or 666;
it will fail. Repeat until you are rate-limited.

### UI effects
After failing for the final time, the user will be redirected to a
rate limited screen. Any attempt to re-enter identity verification will also
redirect there.

![Failed and Rate Limited]({{site.baseurl}}/images/verify-info-rate-limited.png)

## Social security number verification rate limiter
### Description
This is the rate limiter for SSN verification. It is referred to in
code via `:proof_ssn` and the `RateLimiter` class.

By default, an SSN is allowed 10 attempts in 60 minutes, across any
number of users. The discriminator for this rate limiter is the SSN,
not the user id.

### Settings
- `proof_ssn_max_attempts` - The maximum number of times that a user
can attempt to verify their social security number within the
specified window. The default value for this is 10.

- `proof_ssn_max_attempt_window_in_minutes` - The length of time to
consider when determining whether a user is rate-limited. The default
value for this is 60 minutes.

### How to trigger
This rate limiter is checked at the verify info step. The limit for it
is set to double the resolution rate-limiter, so it takes three users
(with a common SSN) to trigger the SSN rate limit.

Choose an SSN that does not begin with 900 or 666.  Create
a new user, and attempt identity verification with the user. The
verify info step will fail with this SSN. Repeat until rate limited.
(At this point, you are rate limited by the resolution rate limiter,
not the SSN rate limiter.)

Create a second user, and repeat the process with the same SSN.

Create a third user, using the same SSN, and this time, you will see
the SSN rate limit at the verify info step.

The SSN rate limit error page can be distinguished from the resolution
rate limit error page by the fact that the SSN timeout is 1 hour,
whereas the resolution limiter has a timeout of 6 hours.

## Address verification rate limiter
### Description
This is the rate limiter for the address verification step. It is referred to in
code via `:proof_address` and the `RateLimiter` class.

By default, the user is allowed 5 attempts in 6 hours.

### Config Settings
- `proof_address_max_attempts` - The maximum number of times that a
user can attempt to verify their address within the specified
window. Default: 5 times

- `proof_address_max_attempt_window_in_minutes` - The length of time
to consider when determining whether a user is rate-limited. Default:
6 hours

### How to trigger

Enter identity verification. When you reach the phone number step, use
phone number 703-555-5555. Identity verification will fail. Retry,
using the same phone number, until you are rate-limited. Ignore the
message about using a different phone number.

### UI effects

The user will be redirected to a screen informing them that they are
rate-limited. Any further attempt to proof their address before the
rate limit expires will also be directed to this screen.

![Proof Address Rate Limited]({{site.baseurl}}/images/idv-proof-address-rate-limited.png)

## One time password entry rate limiter
### Description
During the phone confirmation step, the user must enter a one-time
code sent to their phone. This is the rate limiter for requesting
one-time codes.

When the user is entering a one-time code, rate limiting is
handled by code which is common to both OTP entry during
identity verification _and_ during user login.

The actual rate limit count is stored on the `User` class. Most of the
code is in the `UserOtpMethods` concern, with a small bit of it still
in `User`.

By default, the user is allowed to request 10 one-time passwords
within 10 minutes.

If the user requests more than 10, they are blocked from further
access, and must wait 10 minutes before we allow them to continue.

### Settings
`:login_otp_confirmation_max_attempts` - The maximum number of OTP
requests entry attempts that the user is allowed before their account
is temporarily locked. Default: 10 tries.

`:lockout_period_in_minutes` - The length of time that a use must wait
after being locked out for too many OTP requests before they are
allowed to try again. Default: 10 minutes.

### How to trigger
Enter identity verification and proceed through the 'Verify your phone
number' screen. After pressing the 'Send code' button, you will be on
the 'Enter your one-time code' screen. Press the 'Send another code
button' repeatedly, until you are rate limited.

### UI effects
On any attempt to access the site, the user will be redirected to a
rate-limited page, until the rate limit expires.

![Rate Limited]({{site.baseurl}}/images/otp-limited.png)
## Verify by USPS mail rate limiter
### Description
This is the rate limiter for a user's requests for USPS paper (also
sometimes called GPO) letters.  This is a completely independent set
of rate limiting code, in the `GpoMail` class, which implements two
rate limits.

- First, a user is not allowed more than a certain number of letter
  requests within a time window (this is similar to the other rate
  limiters described here).

- Second, there is a minimum wait period after requesting a letter
  before a user is allowed to request another.

  By default, a user is allowed to request 4 verify by mail letters
  within 30 days, and must wait 24 hours after requesting a letter
  before they are allowed to request another. 

  (n.b. - there is an override for this in `application.yml` if the
  RUBY_ENV environment variable is set to `test`. In that case, users
  are restricted to 2 letters per 30 day window; the delay is still 24
  hours. This setting is used by the automated test suite in CI and
  also for local development. It makes the tests simpler to have a
  lower rate-limiting threshold.)

### Settings
`max_mail_events` - The maximum number of times that a user may
request a Verify by Mail letter within the specified time window.

`max_mail_events_window_in_days` - The length of time to consider when
determining whether the user has requested too many Verify by Mail letters
recently.

`minimum_wait_before_another_usps_letter_in_hours` - The minimum
amount of time that a user must wait, after requesting a Verify by Mail letter,
before requesting another letter.

### How to trigger
Enter identity verification and select "Verify by Mail". Request a
letter; you are now rate-limited.
### UI effects
On the screen to enter their verification code, the user is not presented with the
option to request another letter.

[Rate limited]({{site.baseurl}}/images/gpo_letter_request_rate_limited.png)

