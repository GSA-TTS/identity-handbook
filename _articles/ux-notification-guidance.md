---
title: "Notification Guidance"
description: "When to use email, SMS, or both for Login.gov notifications"
layout: article
category: UX
subcategory: Guides
---

Login.gov notifies users through two channels: email and SMS. This page provides
guidance for teams implementing new features or messaging, to ensure
notifications are handled consistently across the product.

Login.gov sends far more emails than are listed here. Rather, this guidance
focuses on where SMS, or a combination of SMS and email, is appropriate, and
gives clear rationale so teams can make consistent decisions for new
notification types.

**Reference resources:** A full list of [Action Mailer email
previews][mailer-previews] is available in the dev sandbox.

## Guiding principles

The following principles govern all decisions about when to use SMS, email, or
both.

1. Use SMS for time-sensitive, action-required communications — especially when
   tied to authentication.
1. Use email for record-keeping, detailed information, and asynchronous updates.
1. Use both SMS and email when an event is critical, time-sensitive, and
   benefits from redundancy.
1. Avoid duplication when SMS and email would provide the same value — pick one
   channel.
1. Reduce reliance on SMS as an MFA method over time, but retain phone numbers
   for security notifications.

## When to use each channel

Use the guide below as a quick reference when deciding which channel to use for
a new notification type.

### Email only

- Message is not urgent
- Content provides context or detail
- A permanent record is valuable
- User is already engaged in a flow
- Lower-risk or informational event

### SMS only

- Message is urgent or time-sensitive
- Immediate visibility is needed
- Content is short and actionable
- User action is required right now
- Mobile context expected (e.g. doc photo upload)

### Email + SMS

- High-impact, security-critical event
- Both immediacy and detail are needed
- Redundancy protects against misuse
- User may not be near their computer

## Decision guide by communication type

The following table covers a few example notification scenarios and the
recommended channel for each, with rationale.

| Communication type | Channel | Rationale |
| --- | --- | --- |
| Authentication OTPs | **SMS only** | Requires immediate user action; directly tied to the SMS MFA method. |
| Phone confirmation OTPs | **SMS only** | The user is verifying device ownership; SMS is the correct delivery mechanism. |
| Account deletion cancelled | **Email only** | Lower urgency; the threat has passed and the user is already engaged. |
| Account deletion confirmed | **Email only** | Final record of the action; best stored in the user's inbox for reference. |
| Account deletion initiated | **SMS + Email** | High-impact, irreversible action. Redundancy protects against accidental or malicious deletion. |
| Personal information verified on duplicate account | **SMS + Email** | High-impact fraud scenario; redundancy is essential. |
| Duplicate verified account signed in | **SMS + Email** | High-impact fraud scenario; redundancy is essential. |

This table is not exhaustive. For a complete inventory of all current Login.gov
notifications, refer to the [Action Mailer email previews][mailer-previews].

[mailer-previews]: https://idp.dev.identitysandbox.gov/rails/mailers/
