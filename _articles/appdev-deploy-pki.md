---
title: "Deploying new PKI code"
layout: article
description: "Deployer's Guide for Production"
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

[appdev-oncall-guide]: {% link _articles/appdev-oncall-guide.md %}

[deployer-rotation]: {% link _articles/appdev-deploy-rotation.md %}

### Communications

Err on the side of overcommunication about planned/unplanned deploys–-make sure to post in the
steps in Slack as they are happening and coordinate with [@login-appdev-oncall][appdev-oncall-guide] and [@login-deployer][deployer-rotation].
Most people expect changes deployed on a schedule so early releases can be surprising.

## Deploy Guide

This is a guide for the Team Katherine engineer who shepherds code to production for a given release.

When deploying a new release, the engineer should make sure to deploy new code for the following:

- [gitlab/identity-pki](https://gitlab.login.gov/lg/identity-pki)

### Pre-deploy

#### Cut a release branch

```bash
cd identity-pki
git fetch
git checkout $(curl --silent https://checking-deploy.pivcac.staging.login.gov/api/deploy.json | jq -r .git_sha)
git checkout -b stages/rc-2024-01-09 # CHANGE THIS DATE
git push -u origin HEAD
```
A pull request should be created from that latest branch to production: **`stages/prod`**. When creating the pull request:

#### Pull request release

- Title the pull request clearly with the RC number, ex **"Deploy RC 112 to Prod"**
   - If it's a full release of changes from the `main` branch, add one to the last release number
   - If it's a patch release, increment the fractional part, ex **"Deploy RC 112.1 to Prod"**
   - Unsure what the last `identity-pki` release was? Check the [releases page](https://gitlab.login.gov/lg/identity-pki/-/releases/)
- Add the label **`status - promotion`** to the pull request that will be included in the release.

- If there are merge conflicts, check out how to [resolve merge conflicts](#resolving-merge-conflicts).

#### Share the pull request in `#login-appdev`
Use the `/Announce pending Login.gov release PR` workflow in `#login-appdev` to announce the start of the deployment
- Choose `PIV/CAC (identity-pki)` for the application
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
    - The workflow will send a notification to the `#login-appdev` and `#login-devops` channels

    ![Announce recycle workflow]({{ site.baseurl }}/images/announce-recycle-workflow.png)
3. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   ```
4. Ensure you have the latest code with a `git pull`.
5. Check current server status, and confirm that there aren't extra servers running. If there are, scale in old instances before deploying.
   ```bash
   aws-vault exec prod-power -- ./bin/ls-servers -e prod
   aws-vault exec prod-power -- ./bin/asg-size prod pivcac
   ```
6. Recycle the PKI instances to get the new code. It automatically creates a new migration instance first.
   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod pivcac
   ```

   1. Follow the progress of the PKI hosts spinning up

      ```bash
      aws-vault exec prod-power -- ./bin/ls-servers -e prod -r pivcac # check the load balance pool health
      ```
7. **PRODUCTION ONLY**: This step is required in production

    Production boxes need to be manually marked as safe to remove by scaling down the old instances (one more step that helps us prevent ourselves from accidentally taking production down). You must wait until after the original scale-down delay before running these commands (15 minutes after recycle).

    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod pivcac
    ```

7. Set a timer for one hour, then check NewRelic again for errors.

8. If everything looks good, the deploy is complete.

#### Creating a Release (Production only)

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

It's safer to roll back PKI to a known good state than leave it up in a possibly bad one.

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
aws-vault exec prod-power -- ./bin/scale-remove-new-instances prod pivcac
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

