---
title: "A/B Testing Process"
layout: article
description: "Basic documentation on how Login.gov does A/B testing"
category: AppDev
subcategory: "Development"
---

## A/B Test Development
### Terminology
- Bucket: Sets percentage of users, and in some cases, disables and enables tests
- Discriminator: Additional information about the user journey that the test will capture

### Process
All new tests are created in `config/initializers/ab_tests.rb` as a new `AbTest` object.

Naming convention: Test names are written in `SCREAMING_TEXT`, e.g. `SOCURE_IDV_SHADOW_MODE`
Required settings:
- `experiment_name (String)`: Friendly name of the A/B test
- `should_log (Array)`: Name of test in `app/services/analytics.rb` that corresponds to the metrics that will be measured when logging
- `buckets (Hash)`: Can set the percentage of users who will experience the A/B test experience vs. the present default experience, as well as if the test is enabled. 

#### Unit Testing
The team **strongly encourages** that all A/B tests have a corresponding unit test in `spec/config/initializers/ab_test_spec.rb`. Your test should demonstrate that:
- Your buckets are configured correctly
- Bucket values are set as valid integers
- Returns the correct bucket when your A/B test is enabled

#### Configuration
Configurations related to testing percentages are added in `lib/identity_config.rb`. A common practice in the config values sis that the name has some kind of indicator that it is related to a specific test. Some examples in the application include:
- `config.add(:idv_acuant_sdk_upgrade_a_b_testing_percent, type: :integer)`
- `config.add(:recommend_webauthn_platform_for_sms_ab_test_account_creation_percent, type: :integer)`

## Logging
A/B tests now live as a key on the `properties.event_properties` hash. Below is an example of how to write a query based on a specific test

`properties.event_properties.ab_tests: { ACUANT_SDK: { bucket: ‘use_alternate_sdk’ }`
