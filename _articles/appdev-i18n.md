---
title: "Internationalization (i18n)"
layout: article
description: "Process and guidelines for localization and string translation"
category: AppDev
---

Login.gov is currently available in English, Spanish, and French. This guide covers the tools available to translate the application, and the processes around introducing and translating new strings.

## Internationalization APIs

All strings shown to a user should be localized. This can be achieved for both server-rendered views, as well as front-end JavaScript code.

In both cases, strings are defined within the files of `config/locales`. Each folder should cover a domain area of the application, roughly aligning to controllers found in `app/controllers`. Translation files should always exist for all supported locales, and should always include the same YAML structure. In both Rails and JavaScript, a string will be referenced by a dot (`.`)-separated key representing the YAML nested dictionary path.

### Server-side

Login.gov uses [Rails' default internationalization (i18n) API](https://guides.rubyonrails.org/i18n.html).

Translate a string using the [`t` (`translate`) method](https://guides.rubyonrails.org/i18n.html#the-public-i18n-api):

```ruby
t('doc_auth.buttons.start_over')
```

### Front-end

Login.gov uses a custom JavaScript implementation providing basic support for a Rails-like `t` translation function.

For strings to be available to translate in the front end, you must first add the key to the array of keys found in [`config/js_locale_strings.yml`](https://github.com/18F/identity-idp/blob/master/config/js_locale_strings.yml).

The translated result of the key can be retrieved using the `window.LoginGov.I18n.t` method:

```js
const { t } = window.LoginGov.I18n;

console.log(t('doc_auth.buttons.start_over'));
```

## Updating strings

As new screens are added or existing views are updated, the set of localized strings should be kept in sync with what's used in the code. This includes the removal of strings which are no longer used, but more often than not, you will find yourself adding new strings.

### When should strings be added?

During the design process, the page copy may often change through iteration and feedback from the team and/or directly from the public. UX Team members will include layouts that display English, French and Spanish translations prior to handing off for Engineering to build. You can read more about that process here:  

NOTE:

- To avoid mistakenly leaving text as untranslated, it can help to introduce the string sooner rather than later.
- The naming of the string key should ideally be generalized enough to not be tightly coupled with the exact text, which can improve resilience to changes in copy.

### How should strings be added?

It's perfectly acceptable to manually create and arrange locale files and the strings within them.

You can also take advantage of some automated tooling to assist in this process:

- Running `make normalize_yaml` will format locale YAML files to alphabetize and normalize lines. This is also integrated into the testing pipeline, so it's important to note that if you do choose to manually edit files, you will need to run this command or at least make sure that the output would match.
  - [See documentation for "Managing translation files"](https://github.com/18f/identity-idp#managing-translation-files)
- Running `i18n-tasks add-missing` will generate placeholder values for all missing keys.
  - [See documentation for "`i18n-tasks add-missing`"](https://github.com/glebm/i18n-tasks#add-missing-keys)

### How to request translations

As mentioned earlier in this guide, the same YAML structure should exist for all supported locales, including the translated text values. Even if you are not a native speaker of the language, you should plan to include a translated value.

You can find specific guidance on how to request translations in the [Login.gov guidance document](https://docs.google.com/document/d/16RVO4Gr1bBTt8RV14Jsi1U77lKCBWRagowZbjdsXQ0w/edit).
