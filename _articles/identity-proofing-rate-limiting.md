# Introduction
This page lists the rate limits relating to IdV, and provides details
about each of them. 

The following IdV related rate limits exist:

- Document Capture (`:idv_doc_auth`)
- Verify Info (`:idv_resolution`)
- Hybrid Handoff (`:idv_send_link`)
- Phone OTP (`:phone_otp`)
- Phone Confirmation (`:phone_confirmation`)
- Address Confirmation (`:proof_address`)
- SSN (`:proof_ssn`)

In addition, there is a rate limit on GPO letters (verify by
mail).

# Rate Limit Details
## `:idv_doc_auth` - Document capture rate limiter
### Description
This is the rate-limit for the user's attempts to upload their ID
documents (from either their computer or phone). By default, the user
is allowed 5 attempts within 6 hours.
### Config Settings
- `doc_auth_max_attepts` - The maximum number of times the user can
attempt to upload their documents within the specified time window.

- `doc_auth_attempts_window_in_minutes` - The length of time to
  consider when determining whether a user is rate-limited.

### How to trigger
Repeatedly fail doc auth (5 times). This can be done by using a
suitable `.yml` file rather than an image file during image
upload. A suitable file is:

```
failed_alerts:
  - name: Document Classification
    result: Attention```
```

You will need to cancel out of doc auth and then restart it each time;
the UI won't let you use the same file again if you just retry.

### UI effects

After failing for the final time, the user will be redirected to the
IdV rate limited screen. Any attempt to re-enter IdV will also
redirect there.

[Rate Limited|]
[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg



## `:idv_resolution` - Verify info rate limiter
### Description
This is the rate-limit for the final step in IdV: when the user
attempts to submit everything and verify their identity. By default,
the user is allowed 5 attempts in 6 hours.

### Config Settings

- `idv_max_attempts` - The maximum number of times that a user can
attempt to verify their identity documents within the
specified window.

- `idv_attempt_window_in_hours` - The length of time to consider when
 determining whether a user is rate-limited.



### How to trigger
Repeatedly fail IdV. Use a mix of bogus SSNs and device failures, to
avoid triggering the SSN rate limiter.

### UI effects

After failing for the final time, the user will be redirected to the
IdV rate limited screen. Any attempt to re-enter IdV will also
redirect there.

[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg


[Rate Limited|]

## `:idv_send_link` - This is the rate limiter for user submission of their ID documents via their phone (hybrid handoff)
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
phone to take photos'). Cancel out of the next screen and return to
'How would you like to add your ID?'. Repeat until you become rate
limited.

### UI effects
The user will be presented with a flash error message every time they
attempt to enter hybrid handoff.

[screenshot]
[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg

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
Enter IdV. Proceed to the phone confirmation step, and then click the
'Send another code' button until you are rate limited.
### UI effects
After failing for the final time, the user will be redirected to the
IdV rate limited screen. Any attempt to re-enter IdV will also
redirect there.

[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg
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
Enter IdV. Proceed to the 'Enter your Social Security number'
screen. Repeatedly enter a bad SSN and click Continue until you are
rate limited.
### UI effects
After failing for the final time, the user will be redirected to the
IdV rate limited screen. Any attempt to re-enter IdV will also
redirect there.

[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg
## `GpoMail` - This is the rate limiter for GPO (USPS) letters
### Description
This is the rate limiter for a user's requests for GPO letters.  This
is a completely independent set of rate limiting code, which
implements two rate limits.

First, a user is not allowed more than a certain number of GPO letter
requests within a time window (this is similar to the other rate
limiters described here).

Second, there is a minimum wait period after requesting a GPO letter
before a user is allowed to request another.

By default, a user is allowed to request 4 GPO letters within 30 days,
and must wait 24 hours after requesting a GPO letter before they are
allowd to request another. (n.b. - in the test environment, users are
restricted to 2 GPO letters per 30 day window; the delay is still 24
hours.)

### Settings
`max_mail_events` - The maximum number of times that a user may
request a GPO letter within the specified time window.

`max_mail_events_window_in_days` - The length of time to consider when
determining whether the user has requested too many GPO letters
recently.

`minimum_wait_before_another_usps_letter_in_hours` - The minimum
amount of time that a user must wait, after requesting a GPO letter,
before requesting another letter.


### How to trigger
Enter IdV and select GPO letter address verification. Request a GPO
letter; you are now rate-limited.
### UI effects
On the 'Welcome Back' screen, the user is not presented with the
option to request another letter.
## `User` OTP verfication rate limiting
When the user is entering a one-time (SMS) password, rate limiting is
handled internally to the `PhoneConfirmationOtpVerificationForm`,
`UserOtpMethods` and `PhoneOtpRateLimitable` classes; the actual
rate-limiting counts are kept on `User`. This is strictly for attempts
to enter the one-time password.

(n.b. - This code is _also_ used for rate OTP entry during login.)
## Settings
`:login_otp_confirmation_max_attempts` - The maximum number of OTP
entry attempts that the user is allowed before their account is locked.

`:lockout_period_in_minutes` - The length of time that a use must wait
after being locked out for too many OTP failures before they are
allowed to try again.
