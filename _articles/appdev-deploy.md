---
title: "Deploying new IDP and PKI code"
layout: article
description: "Release Manager's Guide"
category: AppDev
toc_h_max: 4
---

## General Information

A few notes on our deploy process.

### Cadence

**When to deploy:** ✅
- Typically we do a full deploy every week on Thursday.

**When _not_ to deploy:** ❌
- We try to avoid deploying on Fridays, to minimize the chances of introducing a
  bug and having to scramble to fix it before the weekend
- During New Years/winter break, or any other time when many team members are
  on vacation

### Types of Deploys

All deploys to production require a code reviewer to approve the changes to
the `stages/prod` branch.

| Type | What | When | Who |
| ---- | ---- | ---- | --- |
| **Full Deploy** |  The normal deploy, releases all changes on the `main`  branch to production. | Every week | [AppDev Primary Oncall][deployer-rotation] |
| **Patch Deploy** | A deploy that cherry-picks particular changes to be deployed | For urgent bug fixes | [AppDev Primary Oncall][deployer-rotation], or engineer handling the urgent issue |
| **Off-Cycle/Mid-Cycle Deploy** | Releases all changes on the `main` branch, sometime during the middle of a sprint | As needed, or if there are too many changes needed to cleanly cherry-pick as a patch | The engineer that needs the changes deployed |
| **Config Recyle** | A "deploy" that just updates configurations, and does not deploy any new code, see [config recycle](#config-recycle) | As needed | The engineer that needs the changes deployed |

[deployer-rotation]: https://login-gov.app.opsgenie.com/settings/schedule/detail/142b8527-8ef6-4d9d-b81e-24b45d0499ba

### Communications

Err on the side of overcommunication about deploys: make sure to post in the
steps in Slack as they are happening.

Especially overcommunicate about off-cycle/mid-cycle deploys: especially
as they are being planned or evaluated. Most people expect changes deployed
on a schedule so early releases can be surprising.

## Deploy Guide

This is a guide for the Release Manager, the engineer who shepherds code to production for a given release.

When deploying a new release, the release manager should make sure to deploy new code for the following:

- [18f/identity-idp](https://github.com/18f/identity-idp)
- [18f/identity-pki](https://github.com/18f/identity-pki)

This guide is written for the idp, but also applies to the pivcac (identity-pki) server.

This guide assumes that:
- You have a [GPG key set up with GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account) (for signing commits)
- You have [set up `aws-vault`]({% link _articles/infrastructure-setting-up-aws-vault.md %}), and have can SSH (via `ssm-instance`) in to our production environment

Note: it is a good idea to make sure you have the latest pulled down from identity-devops - lots of goood improvements all the time!

### Pre-deploy
Scheduled for every **Tuesday**

#### Test the proofing flow in staging

Since identity proofing requires an actual person's PII, we don't have a good mechanism for automated testing of the live proofing flow.
As a work-around, we test by proofing in staging, then cutting a release from the code deployed to staging.

Before cutting a release, make sure to test in staging.
If there are specific commits that need to be deployed, make sure to recycle staging first to include those commits.

Once you've run through proofing in staging, the next step is to cut a release from the code that is deployed to staging.

#### Cut a release branch

The release branch should be cut from code tested in staging and it should be the date of the production release (ex `stages/rc-2020-06-17`):

```bash
cd identity-$REPO
git fetch && git checkout $(curl --silent https://idp.staging.login.gov/api/deploy.json | jq -r .git_sha)
git checkout -b stages/rc-2020-06-17 # CHANGE THIS DATE
git push -u origin HEAD
```

#### Create pull request

A pull request should be created from that latest branch to production: **`stages/prod`**. When creating the pull request:

- Title it clearly with the RC number, ex **"Deploy RC 112 to Prod"**
   - If it's a full release of changes from the main branch, add one to the last release number
   - If it's a patch release, increment the fractional part, ex **"Deploy RC 112.1 to Prod"**
   - Unsure what the last release was? Check the [releases page](https://github.com/18F/identity-idp/releases/)
- Add the label **`status - promotion`** to the pull request that will be included in the release.
- If there are merge conflicts, check out how to [resolve merge conflicts](#resolving-merge-conflicts).

#### Resolving merge conflicts

A full release after a patch release often results in merge conflicts. To resolve these automatically, we
create a git commit with an explicit merge strategy to "true-up" with the `main` branch (replace all changes on
`stages/prod` with whatever is on `main`)

```bash
cd identity-$REPO
git checkout main && git fetch && git pull
git checkout -b stages/rc-2020-06-17 # CHANGE THIS DATE
git merge -s ours origin/stages/prod # custom merge strategy
git push -u origin HEAD
```

The last step may need a force push (add `-f`). Force-pushing to an RC branch is safe.

#### Prepare release notes

   1. The audience for the release notes are partner agencies and their developers. Notes should be written in [plain language](https://plainlanguage.gov/) and clearly demonstrate the impact on the end user or agency.
   1. Release manager writes a [draft release](https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository#creating-a-release) on GitHub.
       - Tag version: leave blank for now -- will fill in with the final tag on `stages/prod` from the last step
       - Release title: `RC #{NUMBER}`
       - *Save* the draft, do not publish as a pre-release
   1. Release manager shares the draft release on #login-appdev with `@login-ux-team` to review content for plain language.
   1. Release manager shares the draft release on #login-appdev with `@login-product-team` to ensure that no changes in the release are missing.
   1. Once approved, the release manager ensures all updates are saved in the release notes on GitHub.

#### Release notes templates

Below are a set of templates that Release Managers can use when writing various types of release notes for the [Login.gov Identity Provider (IdP) code base](https://github.com/18F/identity-idp).

##### Template: Official release candidate notes

``` markdown
# RC [Number]

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
##### Template: Patch release notes

``` markdown
# RC [Number].[x]
- [Category]: [Change] and [end user impact, if there is one]. [Pull request #___ ]

<!-- Example
Adding Emails: Patch release to include #3821, fixes a bug with adding emails to accounts after the links have expired
-->

```

### Staging

Staging used to be deployed by this process, but this was changed to deploy the `main` branch to the staging environment every day.

### Production
Scheduled for every Thursday

1. Merge the production promotion pull request (**NOT** a squashed merge, just a normal merge)
1. Notify in Slack (`#login-appdev` and `#login-devops` channels)
    - e.g. `:recycle:  Starting idp RC <RELEASE_NUMBER> deploy to Production`
1. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   ```
1. Recycle the IDP instances to get the new code, it automatically creates a new migration instance first.
   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp
   ```

   1. Follow the progress of the migrations, ensure that they are working properly <a id="follow-the-process" />
   ```bash
   # may need to wait a few seconds after the recycle
   aws-vault exec prod-power -- ./bin/ssm-instance --newest asg-prod-migration
   ```
   On the remote box
   ```bash
   sudo tail -f /var/log/cloud-init-output.log
   # OR
   sudo tail -f /var/log/syslog
   ```
   Check the log output to make sure that `db:migrate` runs cleanly. Check for `All done! provision.sh finished for identity-devops` which indicates everything has run

   1. Follow the progress of the IDP hosts spinning up

      ```bash
      aws-vault exec prod-power -- ./bin/ls-servers -e prod -r idp # check the load balance pool health
      ```

    1. Manual Inspection
      - Check [NewRelic (Production IDP)](https://rpm.newrelic.com/accounts/1376370/applications/52136858/traced_errors) for errors
      - If you notice any errors that make you worry, [roll back the deploy](#rolling-back)

1. **PRODUCTION ONLY**: This step is required in production

    Production boxes need to be manually marked as safe to remove (one more step that helps us prevent ourselves from accidentally taking production down)
    ```bash
    aws-vault exec prod-power -- ./bin/scale-in-old-instances prod idp
    aws-vault exec prod-power -- ./bin/scale-in-old-instances prod idpxtra
    aws-vault exec prod-power -- ./bin/scale-in-old-instances prod worker
    ```

1. Set a timer for one hour, then check NewRelic again for errors.

1. Manually test the app in production:
    - Sign in to an account
    - Sign up for an account
    - Test proofing (identity verification) on the new account

1. **PRODUCTION ONLY**: This step is required in production
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

#### Rolling Back

It's safer to roll back the IDP to a known good state than leave it up in a possibly bad one.

Some criteria for rolling back:
- Is the error visible for users?
- Is the error going to create bad data that could cause future errors?
- Is there a user-facing bug that could confuse users or produce a wrong result?
- Do you need more than 15 minutes to confirm how bad the error is?

If any of these are "yes", roll back. See more criteria at <https://outage.party/>.
Staging is a pretty good match for production, so you should be able to fix and verify
the bug in staging, where it won't affect end users.

##### Scaling Out

To quickly remove new servers and leave old servers up:

```bash
aws-vault exec prod-power -- ./bin/scale-in-new-instances prod idp
aws-vault exec prod-power -- ./bin/scale-in-new-instances prod idpxtra
aws-vault exec prod-power -- ./bin/scale-in-new-instances prod worker
```

##### Steps to roll back

1. Make a pull request to the `stages/prod` branch, to revert it back to the last deploy.

    ```bash
    git checkout stages/prod
    git pull # make sure you're at the most recent SHA
    git checkout -b revert-rc-123 # replace with the RC number
    git revert -m 1 HEAD # assumes that the top commit on stages/prod is a merge
    ```

1. Open a pull request against `stages/prod`, get it approved, and merged. If urgent, get
   ahold of somebody with admin merge permissions who can override waiting for CI to finish

1. Recycle the app to get the new code out there (follow the [Production Deploy steps](#production))

### Config Recycle

A config recycle is an abbreviated "deploy" that deploys the same code, but lets boxes pick up
new configurations (config from S3, or service provides from `identity-idp-config`).

1. Make the config changes

1. Recyle the boxes. It's OK to skip migration instances if we **know for certain** there are
   no migrations, which there shouldn't be if there is no new code merges to `stages/prod`:

   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp --skip-migration
   ```

1. In production, it's important to remember to still scale out old IDP and IDPxtra instances.

    ```bash
    aws-vault exec prod-power -- ./bin/scale-in-old-instances prod idp
    aws-vault exec prod-power -- ./bin/scale-in-old-instances prod idpxtra
    ```
