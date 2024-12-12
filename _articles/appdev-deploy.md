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

- Most weeks, we plan to do a full deploy on Tuesday and Thursday.
- We are able to deploy at any time, but off-cycle deploys should be communicated with on-callers if possible
- We default to not deploying if we expect most of the team will be out on the day(s) following. Some examples are:
   - Fridays
   - Before a holiday
   - Before a large part of the team is expected to be on leave

### Types of Deploys

All deploys to production require a code reviewer to approve the changes to
the `stages/prod` branch.

| Type | What | When | Who |
| ---- | ---- | ---- | --- |
| **Full Deploy** |  The normal deploy, releases all changes on the `main`  branch to production. | Twice a week | [@login-deployer][deployer-rotation] |
| **Patch Deploy** | A deploy that cherry-picks particular changes to be deployed | For urgent bug fixes | The engineer handling the urgent issue |
| **Off-Cycle/Mid-Cycle Deploy** | Releases all changes on the `main` branch, sometime during the middle of a sprint | As needed, or if there are too many changes needed to cleanly cherry-pick as a patch | The engineer that needs the changes deployed |
| **Config Recycle** | A deploy that just updates configurations, and does not deploy any new code, see [config recycle](#config-recycle) | As needed | The engineer that needs the changes deployed |
| **No-Migration Recycle** | A deploy that skips migrations, see [no-migration recycle](#no-migration-recycle) | As needed | The engineer that needs the changes deployed |

[deployer-rotation]: {% link _articles/appdev-deploy-rotation.md %}

### Communications

Err on the side of overcommunication about planned/unplanned deploys–-make sure to post in the
steps in Slack as they are happening and coordinate with [@login-deployer][deployer-rotation].
Most people expect changes deployed on a schedule so early releases can be surprising.

## Deploy Guide

This is a guide for the Release Manager, the engineer who shepherds code to production for a given release.

When deploying a new release, the release manager should make sure to deploy new code for the following:

- [18f/identity-idp](https://github.com/18f/identity-idp)
- [18f/identity-pki](https://github.com/18f/identity-pki)

This guide is written for the idp, but also applies to the pivcac (identity-pki) server.

This guide assumes that:
- You have a [GPG key set up with GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account) (for signing commits)
- You have [set up `aws-vault`]({% link _articles/platform-setting-up-aws-vault.md %}), and have can SSH (via `ssm-instance`) in to our production environment

Note: it is a good idea to make sure you have the latest pulled down from identity-devops - lots of good improvements all the time!

### Pre-deploy

#### Test the proofing flow in staging

Since identity proofing requires an actual person's PII, we don't have a good mechanism for automated testing of the live proofing flow.
As a work-around, we test by proofing in staging, then cutting a release from the code deployed to staging.
If there are specific commits that need to be deployed, make sure to recycle staging first to include those commits.

Once you've run through proofing in staging, the next step is to cut a release from the code that is deployed to staging in `main`.

#### Cut a release branch

##### IDP

###### Prerequisites

The IdP includes a script to create deployment PRs. It relies on [`gh`](https://cli.github.com/), the GitHub command line interface. Install that first and authenticate it:

```
brew install gh
gh auth login
```

##### Creating Deploy PRs

Use `scripts/create-deploy-pr` to create a new deployment PR:

```shell
scripts/create-deploy-pr
```

If you want to create a patch release, specify `PATCH=1`:

```shell
PATCH=1 scripts/create-deploy-pr
```

This script will create a new RC branch and PR based on the SHA currently deployed to the staging environment. To override this and specify a different SHA or branch, use the `SOURCE` variable:

```shell
PATCH=1 SOURCE=main scripts/create-deploy-pr
```

`create-deploy-pr` will print out a link to the new PR located in `tmp/.rc-changelog.md`. **Be sure to verify the generated changelog after creating the PR.**

##### PKI

For pki:
```bash
cd identity-pki
git fetch
git checkout $(curl --silent https://checking-deploy.pivcac.staging.login.gov/api/deploy.json | jq -r .git_sha)
git checkout -b stages/rc-2024-01-09 # CHANGE THIS DATE
git push -u origin HEAD
```
A pull request should be created from that latest branch to production: **`stages/prod`**. When creating the pull request:

#### Pull request release
Naming and labeling releases are automatically done in `identity-idp` after running `scripts/create-deploy-pr`

In the `identity-pki` repo:
- Title the pull request clearly with the RC number, ex **"Deploy RC 112 to Prod"**
   - If it's a full release of changes from the main branch, add one to the last release number
   - If it's a patch release, increment the fractional part, ex **"Deploy RC 112.1 to Prod"**
   - Unsure what the last `identity-pki` release was? Check the [releases page](https://github.com/18F/identity-pki/releases/)
- Add the label **`status - promotion`** to the pull request that will be included in the release.

- If there are merge conflicts, check out how to [resolve merge conflicts](#resolving-merge-conflicts).

#### Share the pull request in `#login-appdev`
Use the `/Announce pending Login.gov release PR` workflow in `#login-appdev` to announce the start of the deployment
- Choose whether the PR is for `Identity provider (identity-idp)` or `PIV/CAC (identity-pki)`
- Enter the the PR link
- The workflow will send a notification to the `#login-appdev` channel and [cross-post](https://slack.com/help/articles/203274767-Share-messages-in-Slack) to the `#login-delivery` channel for awareness.

![Announce release PR workflow]({{ site.baseurl }}/images/announce-release-pr-workflow.png)

#### Resolving merge conflicts

A full release after a patch release often results in merge conflicts. To resolve these automatically, we
create a git commit with an explicit merge strategy to "true-up" with the `main` branch (replace all changes on
`stages/prod` with whatever is on `main`)

```bash
cd identity-$REPO
git checkout stages/rc-2020-06-17 # CHANGE THIS DATE
git merge -s ours origin/stages/prod # custom merge strategy
git push -u origin HEAD
```

The last step may need a force push (add `-f`). Force-pushing to an RC branch is safe.

### Staging

Staging used to be deployed by this process, but this was changed to deploy the `main` branch to the staging environment every day. See [daily deploy schedule]({% link _articles/daily-deploy-schedule.md %}) for more details.

### Production

1. Merge the production promotion pull request (**NOT** a squashed merge, just a normal merge)
2. Use the `/Announce a recycle` workflow in `#login-appdev` to announce the start of the deployment
    - Enter the RC number that will be deployed
    - When necessary, create a separate announcement for `identity-pki`
    - The workflow will send a notification to the `#login-appdev` and `#login-devops` channels

    ![Announce recycle workflow]({{ site.baseurl }}/images/announce-recycle-workflow.png)
3. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   ```
4. Check current server status, and confirm that there aren't extra servers running. If there are, scale in old instances before deploying.
   ```bash
   aws-vault exec prod-power -- ./bin/ls-servers -e prod
   aws-vault exec prod-power -- ./bin/asg-size prod idp
   ```
5. Recycle the IDP instances to get the new code. It automatically creates a new migration instance first.
   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp
   ```

   1. Follow the progress of the migrations, ensure that they are working properly <a id="follow-the-process" />
   ```bash
   # may need to wait a few minutes after the recycle
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

   2. Follow the progress of the IDP hosts spinning up

      ```bash
      aws-vault exec prod-power -- ./bin/ls-servers -e prod -r idp # check the load balance pool health
      ```

    3. Manual Inspection
      - Check [NewRelic (prod.login.gov)](https://one.newrelic.com/nr1-core/errors-ui/overview/MTM3NjM3MHxBUE18QVBQTElDQVRJT058NTIxMzY4NTg) for errors
      - Optionally, use the deploy monitoring script to compare error rates and success rates for critical flows
        ```bash
        aws-vault exec prod-power -- ./bin/monitor-deploy prod idp
        ```
      - If you notice any errors that make you worry, [roll back the deploy](#rolling-back)

6. **PRODUCTION ONLY**: This step is required in production

    Production boxes need to be manually marked as safe to remove by scaling down the old instances while scaling in the instances (one more step that helps us prevent ourselves from accidentally taking production down). You must wait until after the original scale-down delay before running these commands (15 minutes after recycle).
    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL
    ```

7. Set a timer for one hour, then check NewRelic again for errors.

8. Manually test the app in production:
    - Sign in to an account
    - Sign up for an account
    - Test proofing (identity verification) on the new account

9. If everything looks good, the deploy is complete.

#### Creating a Release (Production only)

##### IDP

The IDP includes a script to create a release based on a merged pull request.  It relies on [`gh`](https://cli.github.com/), the Github cli. Install that first (`brew install gh`) and get it connected to the identity-idp repo. Then, run the script to create a release:

```shell
scripts/create-release <PR_NUMBER>
```

Where `<PR_NUMBER>` is the number of the _merged_ PR.

##### PKI

1. In the application repository, use your GPG key to tag the release.
   ```bash
   git checkout stages/prod && git pull
   bin/tag-release
   ```
2. Add release notes in GitHub:
   1. Create a new release: <https://github.com/18F/identity-pki/releases/new>
   2. Release title: `RC #{NUMBER}`
   3. In the "Choose a tag" dropdown, enter the tag output by the `bin/tag-release` script
   4. Copy the release notes Markdown from the promotion pull request
   5. Click "Publish release"

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
aws-vault exec prod-power -- ./bin/scale-remove-new-instances prod ALL
```

**Important:**

As soon as possible, ensure that the deploy is rolled back by reverting the `stages/prod` branch in GitHub by following the [steps to roll back](#steps-to-roll-back) below. This is important because new instances can start at any time to accommodate increased traffic, and in response to other recycle operations like configuration changes.

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

1. Schedule a [retrospective](#retrospective)

##### Retrospective

If you do end up rolling back a deploy, schedule a blameless retrospective afterwards. These help
us think about new checks, guardrails, or monitoring to help ensure smoother deploys in the future.

### Config Recycle

A config recycle is an abbreviated "deploy" that deploys the same code, but lets boxes pick up
new configurations (config from S3).

1. Make the config changes

1. Announce the configuration change in `#login-appdev`
    - Share the diff as a thread comment, omitting any sensitive information

1. Recycle the boxes

   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp
   ```

1. In production, it's important to remember to still scale out old IDP instances.

    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL
    ```

### No-Migration Recycle
When responding to a production incident with a config change, or otherwise in a hurry, you might want to recycle without waiting for a migration instance.
1. Recycle the boxes without a migration instance
```bash
aws-vault exec prod-power -- ./bin/asg-recycle prod idp --skip-migration
```

1. In production, remove old IDP instances afterward
```bash
aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL
```

#### Risks with No-Migrations Recycle
For environments other than prod, note that if a migration has been introduced on `main`, new instances will fail to start until migrations are run.

Additionally, migration instances are responsible for compiling assets.  If assets have changed since the last migration, we recommend against running a no-migration recycle.  Otherwise, the new servers will look for fingerprinted asset files that don't exist, because the migration instances never created them.

To tell if assets have changed since the last migration, inspect the [Environments status page](https://dashboard.int.identitysandbox.gov/env).  Click "pending changes" and determine if any files changed in `app/assets/stylesheets` or `app/javascript`.
