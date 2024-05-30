---
title: Feature flags
description: >
  Purpose and lifecycle of a feature flag, used when developing large new features.
layout: article
category: AppDev
subcategory: Development
---

## Overview

Our Rails applications use [configuration values][rails-configuration] to support per-environment configuration. This allows us to create new configuration values which control whether a specific application feature is enabled in an environment, so that we can incrementally iterate on a large feature over time before enabling it in sandbox and eventually production environments. These are referred to as "feature flags", and are nothing more than boolean configuration values which are used in code to gate user and logic pathways.

[rails-configuration]: {% link _articles/appdev-secrets-configuration.md %}#configuration-in-rails-apps

## Lifecycle of a feature flag

### Adding a new feature flag

Most code changes don't require a feature flag, since the code that's being merged is self-contained and should be expected to go live immediately for all users in all environments.

Feature flags are best suited for large features which are planned to be implemented across multiple pull requests over a longer period of time, usually anywhere from a few weeks to several months of development. They can also be used as a faster alternative to incremental deploys when [managing 50/50 state changes][managing-50-50-state].

Consider the following when adding a new feature flag:

- **Timing**:
  - A feature flag should be implemented as one of the very first code changes of a large feature development. It is not uncommon for the first pull request of a new large feature development to contain only code changes for adding the feature flag.
- **Naming**:
  - As with any configuration value, the name of a feature flag should be clear, and it should be obvious for someone outside the team implementing the feature to know which user flows it impacts. A verbose-but-clear feature flag name is better than a succinct-but-ambiguous name.
  - Feature flag names are typically suffixed with `_enabled`, indicating that it's a boolean controlling whether something is enabled or not.
- **Default Value**:
  - The simplest option is to enable a new feature flag by default, and disable it in production environments. The feature can then be enabled in specific deployed environments using [`app-s3-secret`][app-s3-secret].

  ```yaml
  # config/application.yml.default
  new_feature_enabled: true

  production:
    new_feature_enabled: false
  ```

    - **Pros:**
      - This helps ensure broad test coverage for your new feature in continuous integration (CI) builds.
      - Enabling your new feature by default may cause existing tests to fail where it breaks expectations of how a user proceeds through the application, but this is inevitable and easier to address earlier in the feature development than later.
    - **Cons:**
      - Enabling by default can introduce a risk that continuous integration will not be running tests against what users will experience in the production environment. This can be offset by ensuring branch test coverage for the disabled state in affected codes' specs (see [Test Coverage](#test-coverage))

[managing-50-50-state]: {% link _articles/manage-50-50-state.md %}
[app-s3-secret]: {% link _articles/devops-scripts.md %}#app-s3-secret
[rails-configuration]: {% link _articles/appdev-secrets-configuration.md %}#configuration-in-rails-apps

### Enabling a feature flag

A new feature flag is expected to be disabled by default in production. You can then enable it in specific deployed environments using [`app-s3-secret`][app-s3-secret].

Refer to [Environment Descriptions][environment-descriptions] to understand the purpose of each environment, and when it might make sense to enable a feature in that environment.

Typically, the `dev` environment is the first deployed environment where a feature is enabled, since this environment is used exclusively by internal team members for testing, which limits the impact and risk for unstable code behaving unexpectedly.

Before enabling a feature flag in the `prod` environment, make sure that the feature is enabled in continuous integration (CI) tests, to increase confidence that there are no bugs in the code.

[app-s3-secret]: {% link _articles/devops-scripts.md %}#app-s3-secret
[environment-descriptions]: {% link _articles/sandboxes-and-staging-environments.md %}

### Removing a feature flag

Most feature flags should be added with the expectation that they'll eventually be removed after the feature is live and stable in production.

The only reason to keep a feature flag after being enabled in production is to have the ability to quickly disable the feature if a problem is discovered. While this can lead to the temptation of keeping a feature flag forever so that it can be disabled if needed, this is almost always a bad idea:

- It increases maintenance burden and technical debt, because we need to support both the enabled and disabled versions of the code.
- Because of code drift and future assumptions that a feature is enabled in production, the disabled version of the code may behave unpredictably, or not work at all!

Consider removing a feature flag within a month of the feature being enabled in production.

## Developing with feature flags

Refer to ["Secrets and Configuration"][rails-configuration] for more information about adding a new configuration value.

### Using a feature flag in code

A feature flag is usually used to create a branching path in your code, with `if` and `else` handling the enabled and disabled states respectively.

```rb
def create
  if IdentityConfig.store.example_feature_enabled
    # Handle what happens when the feature is enabled
  else
    # Handle what happens when the feature is disabled
  end
end
```

### Test coverage

As with any `if` and `else` statement in code, you will want to have good branch coverage for your code to cover both the scenario where the feature is enabled or disabled.

You can [use RSpec to stub the response](https://rspec.info/features/3-12/rspec-mocks/configuring-responses/returning-a-value/) of the `IdentityConfig.store` object method. This is best used in a `before` block within an [RSpec `context` grouping](https://rspec.info/features/3-12/rspec-core/example-groups/basic-structure/):

```rb
it 'does something' do
  # Assert expected behaviors in the default state
end

context 'when example feature is disabled' do
  before do
    allow(IdentityConfig.store).to receive(:example_feature_enabled).and_return(false)
  end

  it 'does something different' do
    # Assert expected behaviors when the feature is the opposite of its default value
  end
end
```
