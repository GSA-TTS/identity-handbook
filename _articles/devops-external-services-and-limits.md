---
title: "DevOps External Services and Limits"
description: Notes on rate and cost limited external services used by IdP and out platform
layout: article
category: DevOps
---

## Overview

Login.gov utilizes many external services from many providers in order to provide our
services.  Many of these external services have usage rate limits or cost limits that,
if hit, will degrade our service.

Specific limits are documented here: <https://docs.google.com/spreadsheets/d/1gFBZrMPxFcpuDt8gBKBBI0jiwpF5TE95kVQuSXX3qXA>

This page provides supplemental information on how to view limits, change soft limits,
and request limit increases.

## Messaging Services

### AWS SES SMTP

TBC

### AWS Pinpoint SMS

Due to contractural reasons our `login-sms-prod` account is under a different vendor.

SMS billing limits are set in two places:

__Account Level__ - This is shown below. ("with a max limit of $250,000") You must contact support to change this limit and it covers ALL REGIONS in the account.
![Pinpoint SMS - Account Limit]({{site.baseurl}}/images/pinpoint-sms-account-limit.png)

__Application/Project Level__ - This is in the application "Account limit details" above and also below.  (Note the incorrect labeling.)
![Pinpoint SMS - Application Limit]({{site.baseurl}}/images/pinpoint-sms-application-limit.png)

The default limit is $1/month per application.   You can change the _Application Limit_ by editing the SMS settings as shown below:
![Pinpoint SMS - Application Limit Edit]({{site.baseurl}}/images/pinpoint-sms-application-limit-edit.png)

Since Pinpoint Applications are confined to a region, don't forget to adjust the application limit for each application in each
used region!

## Proofing Services

TBC
