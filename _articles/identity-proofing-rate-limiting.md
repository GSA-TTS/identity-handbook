---
title: "Identity Verification Rate Limiting"
description: "An overview of the rate limits which apply to Identity Verification"
layout: article
category: AppDev
subcategory: Architecture
cSpell: ignore Hubspot
---

This page lists the rate limits relating to Identity Verification, and provides details
about each of them. 

The following Identity Verification related rate limits exist:

- Document Capture (`:idv_doc_auth`)
- Verify Info (`:idv_resolution`)
- Hybrid Handoff (`:idv_send_link`)
- Phone Confirmation (`:proof_address`)
- SSN (`:proof_ssn`)
- Verify by Mail (verify by USPS mail) letters
- One-time (SMS) password entry

# Rate Limit Details
## `:idv_doc_auth` - Document capture rate limiter
### Description
This is the rate-limit for the user's attempts to upload their ID
documents from either their computer or phone. By default, the user
is allowed 5 attempts within 6 hours.

Retrying with a different file after a failure and cancelling out of
Identity Verification completely and then trying again both count
against this rate limiter. The user gets 5 attempts to upload
satisfactory images in 6 hours total, through any path.

### Config Settings
- `doc_auth_max_attepts` - The maximum number of times the user can
attempt to upload their documents within the specified time window.

- `doc_auth_attempts_window_in_minutes` - The length of time to
  consider when determining whether a user is rate-limited.

### How to trigger
Repeatedly fail doc auth (5 times). This can be done by using a
suitable `.yml` file rather than an image file during image
upload.

Use the same file for front and back images, but you must alternate
between two files on succesive attempts. The UI will not let you try
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
    result: Attention```
```

[More about Yaml files for testing and development](https://developers.login.gov/testing/#testing-identity-proofing)


### UI effects

After failing for the final time, the user will be redirected to a
rate limited screen. Any attempt to re-enter Identity Verification will also
redirect there.

![Failed and Rate Limited]({{site.baseurl}}/images/idv-doc-auth-limited.png)

## `:idv_resolution` - Verify info rate limiter
### Description
This is the rate-limit for the step after document upload: When we
check the information from their documents against our external
vendors. The user is allowed 5 attempts in 6 hours.

### Config Settings

- `idv_max_attempts` - The maximum number of times that a user can
attempt to verify their identity documents within the
specified window.

- `idv_attempt_window_in_hours` - The length of time to consider when
 determining whether a user is rate-limited.

### How to trigger
Repeatedly fail Identity Verification. Use a mix of bogus SSNs and device failures, to
avoid triggering the SSN rate limiter.

### UI effects

After failing for the final time, the user will be redirected to a
rate limited screen. Any attempt to re-enter Identity Verification will also
redirect there.

![Rate Limited]({{site.baseurl}}/images/idv-doc-auth-limited.png)

## `:idv_send_link` - User phone submission of their ID documents (hybrid handoff) rate limiter
### Description
This is the rate limiter for hybrid handoff, where we allow the user
to upload their ID documents from their phone. By default, the user is
allowed 10 attempts in 5 minutes.

### Settings
`idv_send_link_max_attempts` - The maximum number of times that a user can
attempt to upload their ID documents from their phone within the
specified time window.

`idv_send_link_attempt_window_in_minutes` - The length of time to
consider when determining whether a user is rate-limited.

### How to trigger
Enter identity verification, and select hybrid handoff ('Use your
phone to take photos'). Click `Back` on the next screen and return to
'How would you like to add your ID?'. Repeat until you become rate
limited.

### UI effects
The user will be presented with a flash error message every time they
attempt to enter hybrid handoff.

[Rate Limited Hybrid Handoff]({{site.baseurl}}/images/hybrid-handoff-limited.png)

## `:proof_address` - Phone verification rate limiter
### Description
This is the rate limiter for phone verification, despite the name. By
default, the user is allowed 5 attempts in 6 hours.

### Config Settings
- `proof_address_max_attempts` - The maximum number of times that a
user can attempt to verify their phone number within the specified
window.

- `proof_address_max_attempt_window_in_minutes` - The length of time
to consider when determining whether a user is rate-limited.

### How to trigger

Repeatedly fail Identity Verification. Use a mix of bad information (bad SSN, wrong one
time code, etc.), to avoid triggering the other rate limiters.

### UI effects
After failing for the final time, the user will logged out, and their
account will be locked until the login.gov team takes manual action to
re-enable it.

[Rate limited by address]({{site.baseurl}}/images/idv-address-rate-limited.png)

## `:proof_ssn` - Social Security Number verification rate limiter
### Description
This is the rate limiter for SSN verification. By default, the user is
allowed 10 attempts in 60 minutes.

### Settings
- `proof_ssn_max_attempts` - The maximum number of times that a user
can attempt to verify their social security number within the
specified window.

- `proof_ssn_max_attempt_window_in_minutes` -  The length of time
to consider when determining whether a user is rate-limited.

### How to trigger
Enter Identity Verification. Proceed to the 'Enter your Social Security number'
screen. Repeatedly enter a bad SSN and click Continue until you are
rate limited.
### UI effects
After failing for the final time, the user will be redirected to the
Identity Verification rate limited screen. Any attempt to re-enter Identity Verification will also
redirect there.

[Rate Limited]({{site.baseurl}}/images/idv-ssn-rate-limited.png)
## `GpoMail` - Verify by Mail (USPS) letters rate limiter
### Description
This is the rate limiter for a user's requests for verify by mail
(also sometimes called GPO) letters.  This is a completely independent
set of rate limiting code, which implements two rate limits.

- First, a user is not allowed more than a certain number of letter
  requests within a time window (this is similar to the other rate
  limiters described here).

- Second, there is a minimum wait period after requesting a letter
  before a user is allowed to request another.

  By default, a user is allowed to request 4 verify by mail letters
  within 30 days, and must wait 24 hours after requesting a letter
  before they are allowed to request another. 

  (n.b. - there is an override for this in `application.yml` if the
  RUBY_ENV variable is set to `test`. In that case, users are
  restricted to 2 letters per 30 day window; the delay is still 24
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
Enter Identity Verification and select Verify by Mail letter address verification. Request a Verify by Mail
letter; you are now rate-limited.
### UI effects
On the screen to enter their verification code, the user is not presented with the
option to request another letter.

[Rate limited]({{site.baseurl}}/images/gpo_letter_request_rate_limited.png)

## `User` OTP verification rate limiter
When the user is entering a one-time (SMS) password, rate limiting is
handled by a custom set of code. The actual rate limits are stored on
`User`. This is strictly for attempts to enter the one-time password.--------

If the user fails all of their attempts, they are logged out and must
wait a while before we allow them to log in again.

By default, the user is allowed 10 attempts. If they are locked out,
they must wait 10 minutes before we allow them to log back in.

(n.b. - This code is _also_ used for rate-limiting OTP entry during
login.)
### Settings
`:login_otp_confirmation_max_attempts` - The maximum number of OTP
entry attempts that the user is allowed before their account is locked.

`:lockout_period_in_minutes` - The length of time that a use must wait
after being locked out for too many OTP failures before they are
allowed to try again.

### UI effects
On any attempt to access the site, the user will be redirected to a
rate-limited page, until the rate limit expires.

[Rate Limited]({{site.baseurl}}/images/otp-limited.png)
