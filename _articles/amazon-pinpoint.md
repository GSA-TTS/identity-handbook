---
title: "Amazon Pinpoint"
description: "Mechanism for sending SMS/phone one-time codes for authentication"
layout: article
category: AppDev
subcategory: Architecture
---

## Introduction
In the `identity-idp` repo, we gather information about Amazon Pinpoint support for [voice](https://docs.aws.amazon.com/sms-voice/latest/userguide/phone-numbers-voice-support-by-country.html) and [SMS](https://docs.aws.amazon.com/sms-voice/latest/userguide/phone-numbers-sms-by-country.html) messaging. Support information is obtained using the `make update_pinpoint_supporting_countries` script. The script gathers and outputs supports into the following three files:

1. `pinpoint_supported_countries.yml` is the file that has programmatically generated information about Pinpoint supports. Information can be found on Pinpoint’s website.
2. `pinpoint_overrides.yml` is the file that we manually update when we have to make changes to supported countries.
3. `country_dialing_codes.yml` is the source of truth that combines the above files

All of the above documents are in the `config/` folder.

## Notes

The script has proven to be fragile when Amazon adds/deletes contents from the any of the source pages. Added footnotes are a common reason why script failures happen. Ways that script-related failures have been fixed in the past include:
- Make updates to the [SMS support script](https://github.com/18F/identity-idp/blob/3112ac7782f0e35073aed94407ced3134261dc29/lib/pinpoint_supported_countries.rb#L73).
- Making manual additions/deletions to to `pinpoint_overrides.yml`
- Re-running the GitLab pipeline.
