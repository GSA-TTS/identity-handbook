---
title: "Deploying the IDP"
layout: article
description: "Release Manager's Guide"
category: AppDev
---

This is a guide for the Release Manager, the engineer who shepherds code to staging and production for a given release.

This guide assumes that:
- You have a [GPG key set up with GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account) (for signing commits)
- You have [set up `aws-vault`]({{site.baseurl}}/articles/devops-setting-up-aws-vault.html), and have can SSH (via `ssm-instance`) in to our production environment

## Pre-deploy
Every other Tuesday

### Cut a release branch

The release branch should be cut from latest and it should be the date of the production release (ex `stages/rc-2020-06-17`):

  ```bash
  cd identity-idp
  git checkout master && git pull
  git checkout -b stages/rc-2020-06-17 # CHANGE THIS DATE
  git push -u origin HEAD
  ```

### Create pull requests

A pull request should be created from that latest branch to staging and production:

   1. Staging: `stages/staging`
   2. Production: `stages/prod`

   When creating the pull requests:

   - Title them clearly with the RC number (sprint number), ex **"Deploy RC 112 to Staging"**
       - Unsure what the sprint number is? [Check JIRA for the active sprint](https://cm-jira.usa.gov/secure/RapidBoard.jspa?rapidView=1953&projectKey=LG), or look a the last release and add one.
   - Add the label **`status - promotion`** to each pull request that will be included in the release.

### Prepare release notes

   1. The audience for the release notes are partner agencies and their developers. Notes should be written in [plain language](https://plainlanguage.gov/) and clearly demonstrate the impact on the end user or agency.
   1. Release manager writes a [draft release](https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository#creating-a-release) on GitHub.
       - Tag version: leave blank for now -- will fill in with the final tag on `stages/prod` from the last step
       - Release title: `RC #{SPRINT-NUMBER}`
       - *Save* the draft, do not publish as a pre-release
   1. Release manager shares the draft release on #login-product with `@login-ux-team` to review content for plain language.
   1. Release manager shares the draft release on #login-product with `@login-product-team` to ensure that no changes in the release are missing.
   1. Once approved, the release manager ensures all updates are saved in the release notes on GitHub.

### Release notes templates

Below are a set of templates that Release Managers can use when writing various types of release notes for the [Login.gov Identity Provider (IdP) code base](https://github.com/18F/identity-idp).

#### Template: Official release candidate notes

``` markdown
# RC [Sprint Number]

## Improvements/Changes
- [Category]: [Change] and [end user impact]. [Pull request #___ ]
<!-- Example
- Phishing prevention: A new banner on Login lets users know they are on a legitimate government website (now on secure.login.gov and login.gov). We help users better identify phishing sites when we teach them how to spot legitimate government sites. (Lg 2939) (#3751)
-->

## Accessibility
- [Category]: [Change] and [end user impact]. [Pull request #___ ]
<!-- Example
- Images: Decorative images are hidden from screen readers to prevent confusion and redundancy for users. This is an accessibility best practice we're excited to incorporate. (#3824)
-->

## Bug Fixes Users Might Notice
- [Category]: [Change] and [end user impact]. [Pull request #___ ]
<!-- Example
- Unconfirmed email addresses: Users who don't confirm an email address, can re-add the email at a later time. ( #3821)
-->

## Behind the scenes bug fixes users probably won't notice
- [Category]: [Change] . [Pull request #___ ]
<!-- Example
- Multi-region KMS: Support for multi-region KMS, allows us to keep login.gov up and working with encrypted data if one Amazon Web Services region goes down (#3812, #3816)
-->

```
#### Template: Patch release notes

``` markdown
# RC [Sprint Number].[x]
- [Category]: [Change] and [end user impact, if there is one]. [Pull request #___ ]

<!-- Example
Adding Emails: Patch release to include #3821, fixes a bug with adding emails to accounts after the links have expired
-->

```

## Staging
Every other Wednesday

1. Merge the staging promotion pull request (**NOT** a squashed merge, just a normal merge)
1. Notify in Slack (`#login-product` and `#login-devops` channels)
    - e.g. `:recycle:  Starting idp RC <RELEASE_NUMBER> deploy to Staging`
1. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   aws-vault exec production-poweruser -- /bin/zsh
   ```
1. Create a migration instance, and tail the logs to make sure things run cleanly
    ```bash
    ./bin/ls-servers -e staging # make sure there are no existing migration instances
    ./bin/asg-size staging migration 1 # create one migration instance
    # wait a few seconds
    ./bin/ssm-instance --newest asg-staging-migration
    ```
    On the remote box
    ```bash
    /bin/bash # they start in a plain shell, you probably want bash
    sudo tail -f /var/log/cloud-init-output.log
         #   OR
    sudo tail -f /var/log/syslog
    ```
    Check the log output to make sure that `db:migrate` runs cleanly. Check for `All done! provision.sh finished for identity-devops` which indicates everything has run. Then spin down the migration instance.
    ```bash
    ./bin/asg-size staging migration 0
    ```
1. Recycle the IDP instances to get the new code
    ```bash
    ./bin/asg-recycle staging idp
    ./bin/ls-servers -e staging -r idp # check the load balance pool health
    ```
    - Check [NewRelic (Staging IDP)](https://rpm.newrelic.com/accounts/1376370/applications/52446986/filterable_errors#/table?top_facet=transactionUiName&barchart=barchart) for errors
    - Set a timer for one hour, then check NewRelic again for errors.

## Production
Every other Thursday

1. Merge the production promotion pull request
1. Notify in Slack (`#login-product` and `#login-devops` channels)
    - e.g. `:recycle:  Starting idp RC <RELEASE_NUMBER> deploy to Production`
1. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   aws-vault exec production-poweruser -- /bin/zsh
   ```
1. Create a migration instance, and tail the logs to make sure things run cleanly
    ```bash
    ./bin/ls-servers -e prod # make sure there are no existing migration instances
    ./bin/asg-size prod migration 1 # create one migration instance
    # wait a few seconds
    ./bin/ssm-instance --newest asg-prod-migration
    ```
    On the remote box
    ```bash
    /bin/bash # they start in a plain shell, you probably want bash
    sudo tail -f /var/log/cloud-init-output.log
         #   OR
    sudo tail -f /var/log/syslog
    ```
    Check the log output to make sure that `db:migrate` runs cleanly. Check for `All done! provision.sh finished for identity-devops` which indicates everything has run. Then spin down the migration instance.
    ```bash
    ./bin/asg-size prod migration 0
    ```
1. Recycle the IDP instances to get the new code
    ```bash
    ./bin/asg-recycle prod idp
    ./bin/ls-servers -e prod -r idp # check the load balance pool health
    ```

    - Check [NewRelic (Production IDP)](https://rpm.newrelic.com/accounts/1376370/applications/52136858/traced_errors) for errors
    - Set a timer for one hour, then check NewRelic again for errors.

1. **PRODUCTION ONLY**: This step is required in production (but not staging)

    Production boxes need to be manually marked as safe to remove (one more step that helps us prevent ourselves from accidentally taking production down)
    ```
    ./bin/scale-in-old-instances prod idp
    ```

1. **PRODUCTION ONLY**: This step is required in production (but not staging)
    1. In the `identity-idp` repo, use your GPG key to tag the release.
        ```bash
        cd identity-idp
        git checkout stages/prod && git pull
        export GPG_TTY=$(tty)
        bin/tag-release
        ```
    1. Add release notes in GitHub:
        1. Visit <https://github.com/18f/identity-idp/releases>
        1. Edit the Draft Release Notes started at the beginning of this process
        1. Enter the latest git tag corresponding to the code you just deployed
        1. Copy in the cleaned up release notes and publish them in GitHub
