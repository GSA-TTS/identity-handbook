---
title: "Deploying new IDP and PKI code"
layout: article
description: "Release Manager's Guide for Production"
category: AppDev
subcategory: "Deploying"
toc_h_max: 4
---

## General Information

A few notes on our deploy process.

### Cadence

**When to deploy:** ✅
- Typically we do a full deploy twice weekly, on Mondays and Thursdays.

**When _not_ to deploy:** ❌
- We try to avoid deploying on Fridays, to minimize the chances of introducing a
  bug and having to scramble to fix it before the weekend
- When the deploy falls on a holiday, or any other time when many team members are on vacation, such
  as New Years / end of year.

### Types of Deploys

All deploys to production require a code reviewer to approve the changes to
the `stages/prod` branch.

| Type | What | When | Who |
| ---- | ---- | ---- | --- |
| **Full Deploy** |  The normal deploy, releases all changes on the `main`  branch to production. | Every week | [@login-deployer][deployer-rotation] |
| **Patch Deploy** | A deploy that cherry-picks particular changes to be deployed | For urgent bug fixes | [@login-deployer][deployer-rotation], or engineer handling the urgent issue |
| **Off-Cycle/Mid-Cycle Deploy** | Releases all changes on the `main` branch, sometime during the middle of a sprint | As needed, or if there are too many changes needed to cleanly cherry-pick as a patch | The engineer that needs the changes deployed |
| **Config Recyle** | A "deploy" that just updates configurations, and does not deploy any new code, see [config recycle](#config-recycle) | As needed | The engineer that needs the changes deployed |

[deployer-rotation]: {% link _articles/appdev-deploy-rotation.md %}

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
- You have [set up `aws-vault`]({% link _articles/platform-setting-up-aws-vault.md %}), and have can SSH (via `ssm-instance`) in to our production environment

Note: it is a good idea to make sure you have the latest pulled down from identity-devops - lots of goood improvements all the time!

### Pre-deploy

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
git checkout main
git pull
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
       - Generate the changelog using the IdP's changelog script:
         ```
         scripts/changelog_check.rb -b origin/stages/prod
         ```
       - *Review* the generated changelog to fix spelling and grammar issues, clarify or organize changes into correct categories, and assign invalid entries to a valid category.
   1. Write a [draft release](https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository#creating-a-release) on GitHub.
       - Tag version: leave blank for now -- will fill in with the final tag on `stages/prod` from the last step
       - Release title: `RC #{NUMBER}`
       - *Save* the draft, do not publish as a pre-release
   1. Share the draft release notes in `#login-appdev` and [cross-post](https://slack.com/help/articles/203274767-Share-messages-in-Slack) to `#login-ux` and `#login-product-strategy` channels for awareness.
   1. Apply any requested updates to the release notes on GitHub.

### Staging

Staging used to be deployed by this process, but this was changed to deploy the `main` branch to the staging environment every day. See [daily deploy schedule]({% link _articles/daily-deploy-schedule.md %}) for more details.

### Production

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
   aws-vault exec prod-power -- ./bin/ssm-instance --document tail-cw --newest asg-prod-migration
   ```

   <details markdown="1">
     <summary>
      View multi-step manual instructions to tail logs
     </summary>

   ```bash
   aws-vault exec prod-power -- ./bin/ssm-instance --newest asg-prod-migration
   ```
   On the remote box
   ```bash
   tail -f /var/log/cloud-init-output.log
   # OR
   tail -f /var/log/syslog
   ```
   </details>

   Check the log output to make sure that `db:migrate` runs cleanly. Check for `All done! provision.sh finished for identity-devops` which indicates everything has run

   1. Follow the progress of the IDP hosts spinning up

      ```bash
      aws-vault exec prod-power -- ./bin/ls-servers -e prod -r idp # check the load balance pool health
      ```

    1. Manual Inspection
      - Check [NewRelic (prod.login.gov)](https://one.newrelic.com/nr1-core/errors-ui/overview/MTM3NjM3MHxBUE18QVBQTElDQVRJT058NTIxMzY4NTg) for errors
      - Optionally, use the deploy monitoring script to compare error rates and success rates for critical flows
        ```bash
        aws-vault exec prod-power -- ./bin/monitor-deploy prod idp
        ```
      - If you notice any errors that make you worry, [roll back the deploy](#rolling-back)

1. **PRODUCTION ONLY**: This step is required in production

    Production boxes need to be manually marked as safe to remove (one more step that helps us prevent ourselves from accidentally taking production down). You must wait until after the original scale-down delay before running these commands (15 minutes after recycle).
    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod idp
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod worker
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

1. If everything looks good, the deploy is complete!

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
aws-vault exec prod-power -- ./bin/scale-remove-new-instances prod idp
aws-vault exec prod-power -- ./bin/scale-remove-new-instances prod worker
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
   ahold of [somebody with admin merge permissions](https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.dm83ewdwp8o) who can override waiting for CI to finish

1. Recycle the app to get the new code out there (follow the [Production Deploy steps](#production))

### Config Recycle

A config recycle is an abbreviated "deploy" that deploys the same code, but lets boxes pick up
new configurations (config from S3).

**Note:** currently, all `identity-idp-config` changes require a migration.

1. Make the config changes

1. Recyle the boxes. It's OK to skip migration instances if we **know for certain** there are
   no migrations, which there shouldn't be if there is no new code merges to `stages/prod`:

   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp --skip-migration
   ```

1. In production, it's important to remember to still scale out old IDP instances.

    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod idp
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod worker
    ```
