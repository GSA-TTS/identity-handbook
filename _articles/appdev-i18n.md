---
title: "Translation process"
layout: article
description: "Process and guidelines for localization and string translation (i18n)"
category: AppDev
subcategory: Tasks
---

Login.gov is currently available in English, Spanish, French, and Chinese. This guide covers the tools available to translate the application, and the processes around introducing and translating new strings.

## Translating content guidance

Content on [secure.login.gov](https://secure.login.gov) and [login.gov](https://login.gov) is offered in the following languages:

- English (U.S.)
- French (Canada)
- Spanish (Mexico)
- Chinese (Simplified)

Translations are requested when content is added or updated on secure.login.gov and login.gov. You can find specific guidance on how to request translations in the [Login.gov Standard operating procedure](https://docs.google.com/document/d/16MacAb1WKiQJJ634Cpjg8WkziiyMJMopA07rUpHP2Vs/edit?tab=t.0#heading=h.l6bljy4rjlyu).

**NOTE:** partners.login.gov and developers.login.gov are not expected to be translated.

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

Login.gov uses a [custom JavaScript implementation](https://github.com/18F/identity-idp/tree/main/app/javascript/packages/i18n) which provides basic support for a Rails-like `t` translation function.

The translated result of the key can be retrieved using the exported `t` function of the package:

```js
import { t } from '@18f/identity-i18n';

console.log(t('doc_auth.buttons.start_over'));
```

## Updating strings

As new screens are added or existing views are updated, the set of localized strings should be kept in sync with what's used in the code. This includes the removal of strings which are no longer used, but more often than not, you will find yourself adding new strings.

### When should strings be added?

Content will change through the process of design iteration and feedback. It is up to the team's discretion when to add strings to `config/locales`, as opposed to using temporary text in an in-progress implementation.

**Note**:

- To avoid mistakenly leaving text as untranslated, it can help to introduce the string sooner rather than later.
- The naming of the string key should ideally be generalized enough to not be tightly coupled with the exact text, which can improve resilience to changes in copy.

### How should strings be added?

It's perfectly acceptable to manually create and arrange locale files and the strings within them.

You can also take advantage of some automated tooling to assist in this process:

- Running `make normalize_yaml` will format locale YAML files to alphabetize and normalize lines. This is also integrated into the testing pipeline, so it's important to note that if you do choose to manually edit files, you will need to run this command or at least make sure that the output would match.
  - [See documentation for "Managing translation files"](https://github.com/18f/identity-idp#managing-translation-files)
- Running `i18n-tasks add-missing` will generate placeholder values for all missing keys.
  - [See documentation for "`i18n-tasks add-missing`"](https://github.com/glebm/i18n-tasks#add-missing-keys)

## Translation Integration Automation

Currently, we have two scripts to streamline workflows to ensure consistency and efficiency across multilingual content

1. Automate the process of integrating and updating translations
2. Automate the process of screenshots

### Translation Integration Script

#### What it does
This script automates the process of updating translations, streamlining what is currently a manual and cumbersome task. Instead of relying on error-prone copy-pasting between different formats, this script introduces a new workflow that eliminates the manual step altogether. This means faster and more accurate updates for new translations.

##### When will this script come in handy?
Content updates: When you are notified that a new or revised English content is ready to implement, the script can quickly add translations in seconds/minutes

##### Team workflow example

1. Translation Team Rep notifies an engineer that the translations have been returned from DoS and are ready to implement
2. Engineer downloads the translation sheet tab (e.g., Sprint XYZ) as a .csv file ([Video demo in Slack](https://gsa-tts.slack.com/archives/C0847VCD3RT/p1734030685203639))
3. Engineer runs the script
4. Engineer creates and shares a PR with UX/Product to review and approve (Alternatively, a screenshot of the change can be shared in an acceptance thread) 

#### Get started

1. Clone the [repository]( https://github.com/18F/hackathon-translations-import) to your local machine
2. Ensure you have the necessary dependencies installed
3. Download your team translation tracker spreadsheet as a `.csv` file (Ensure that you are in the correct tab)
    - Use this [sample copy](https://docs.google.com/spreadsheets/d/1RwV9JC7NL2Z7B8cdjKn3g8XwcUEKjONmZq98gZRHQfc/edit?gid=1723091228#gid=1723091228) to test beforehand, if you want twiddle without touching the real one
4. Run the script to test its functionality

##### How to provide feedback

Create an issue in the [repository](https://github.com/18F/hackathon-translations-import).

### Screenshot Automation Script

#### What it does

This script is an automated tool that helps capture screenshots for Login.gov. Right now, the manual process of taking screenshots is slow. The script makes it easier and faster to grab visuals, so we can share updates with those who need them  quickly and efficiently. It takes the hassle out of manual screenshotting, helping everyone stay on the same page.

##### When will this script come in handy?

- **Scenario 1:** When stakeholders (UX, Product, Partnerships, etc.) request screenshots of new user flows or multiple pages, especially for 5+ pages.
- **Scenario 2:** When an engineer has multiple screenshots to post in a PR or share in an acceptance thread.

##### Team workflow example

1. Stakeholder notifies an engineer that they need multiple screenshots from a user flow
2. Engineer receives the URL strings requested to screenshot
3. Engineer runs the script
    - Script generates a file package
4. Engineer downloads the file package
5. Engineer shares the file package with the stakeholder
6. Stakeholder opens the file package
    - Stakeholder receives the screenshot images
    - Stakeholder receives HTML files to view individual pages in their own web browser without needing to grab screenshots in the lower environment

#### Get started

1. Script is available in the `identity-idp` on a [branch](https://github.com/18F/identity-idp/tree/jmax/hackathon-dumping-screens-and-strings): 
2. Ensure that you have the necessary dependencies installed
3. Assign a few designated URL strings you’d like to capture [Video demo in Slack](https://gsa-tts.slack.com/archives/C0847VCD3RT/p1734032192838459)
3. Execute the `bin/ux-dump` script. The script takes the name of a scenario to execute. There are two sample scenarios currently, `ux-dumper/biometric_spec.rb` and `ux-dumper/mobile_flow_spec.rb`
4. Review the output directory for the captured screenshots
    - Feel free to test different user flows or scenarios to ensure the script works as expected in various situations

##### How to provide feedback

Unlike the first script, this script doesn’t have a dedicated repository. For now, please leave your feedback in the `login-appdev` channel.