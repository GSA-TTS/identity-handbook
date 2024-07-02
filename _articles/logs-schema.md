---
title: "Data Warehouse Log Tables Schema"
description: "Schema definition for logs tables in the data warehouse"
layout: article
category: "Reporting"
subcategory: "Data Warehouse"
---

This is a guide to provide the schema definitions for the four log tables in our Data Warehouse:

- `logs.events`
- `logs.production`
- `logs.unextracted_events`
- `logs.unextracted_production`

## logs.production

The `logs.production` table contains the following fields:

- `cloudwatch_timestamp`
- `message`
- `uuid`
- `method`
- `path`
- `format`
- `controller`
- `action`
- `status`
- `duration`
- `git_sha`
- `git_branch`
- `timestamp`
- `pid`
- `user_agent`
- `ip`
- `host`
- `trace_id`

## logs.events

The `logs.events` table contains the following fields:

- `cloudwatch_timestamp`
- `message`
- `id`
- `name`
- `time`
- `visitor_id`
- `visit_id`
- `log_filename`
- `new_event`
- `path`
- `user_id`
- `locale`
- `user_ip`
- `hostname`
- `pid`
- `service_provider`
- `trace_id`
- `git_sha`
- `git_branch`
- `user_agent`
- `browser_name`
- `browser_version`
- `browser_platform_name`
- `browser_platform_version`
- `browser_device_name`
- `browser_mobile`
- `browser_bot`
- `success`

## logs.unextracted_events

The `logs.unextracted_events` table contains the following fields:

- `cloudwatch_timestamp`
- `message`

## logs.unextracted_production

The `logs.unextracted_production` table contains the following fields:

- `cloudwatch_timestamp`
- `message`

> **NOTE:** At present, we only allow valid JSON to land into the data warehouse tables. For example, the production logs containing Ruby hash will be ignored. 
>
> Below is an example of the logs that will NOT be ingested:
>
> `2024-06-10T17:10:15.234Z;"{:name=>""unused_identity_config_keys"", :keys=>[:ab_testing_idv_ten_digit_otp_enabled, :ab_testing_idv_ten_digit_otp_percent, :acuant_timeout, :disallow_all_web_crawlers, :doc_auth_exit_question_section_enabled, :doc_auth_selfie_capture_enabled, :platform_authentication_enabled, :phone_recaptcha_mock_validator]}"`
