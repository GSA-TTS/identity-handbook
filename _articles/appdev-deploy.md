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
- Typically we do a full deploy twice weekly, on Tuesdays and Thursdays.

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
| **Full Deploy** |  The normal deploy, releases all changes on the `main`  branch to production. | Twice a week | [@login-deployer][deployer-rotation] |
| **Patch Deploy** | A deploy that cherry-picks particular changes to be deployed | For urgent bug fixes | The engineer handling the urgent issue |
| **Off-Cycle/Mid-Cycle Deploy** | Releases all changes on the `main` branch, sometime during the middle of a sprint | As needed, or if there are too many changes needed to cleanly cherry-pick as a patch | The engineer that needs the changes deployed |
| **Passenger Restart** | A "deploy" that just updates configurations without the need to scale up/down instances like the config recycle below, does not deploy any new code, see [passenger restart](#passenger-restart) | As needed | The engineer that needs the changes deployed |
| **Config Recycle** | A "deploy" that just updates configurations, and does not deploy any new code, see [config recycle](#config-recycle) | As needed | The engineer that needs the changes deployed |

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

Note: it is a good idea to make sure you have the latest pulled down from identity-devops - lots of good improvements all the time!

### Pre-deploy

#### Test the proofing flow in staging

Since identity proofing requires an actual person's PII, we don't have a good mechanism for automated testing of the live proofing flow.
As a work-around, we test by proofing in staging, then cutting a release from the code deployed to staging.

Before cutting a release, make sure to test in staging.
If there are specific commits that need to be deployed, make sure to recycle staging first to include those commits.

Once you've run through proofing in staging, the next step is to cut a release from the code that is deployed to staging.

#### Cut a release branch

The release branch should be cut from code tested in staging and it should be the date of the production release (ex `stages/rc-2023-06-17`):

For IdP:
```bash
cd identity-idp
git fetch
git checkout $(curl --silent https://idp.staging.login.gov/api/deploy.json | jq -r .git_sha)
git checkout -b stages/rc-2023-06-17 # CHANGE THIS DATE
git push -u origin HEAD
```
For pki:
```bash
cd identity-pki
git fetch
git checkout $(curl --silent https://checking-deploy.pivcac.staging.login.gov/api/deploy.json | jq -r .git_sha)
git checkout -b stages/rc-2023-06-17 # CHANGE THIS DATE
git push -u origin HEAD
```

#### Create pull request

A pull request should be created from that latest branch to production: **`stages/prod`**. When creating the pull request:

- Title it clearly with the RC number, ex **"Deploy RC 112 to Prod"**
   - If it's a full release of changes from the main branch, add one to the last release number
   - If it's a patch release, increment the fractional part, ex **"Deploy RC 112.1 to Prod"**
   - Unsure what the last release was? Check the [releases page](https://github.com/18F/identity-idp/releases/)
- Add the label **`status - promotion`** to the pull request that will be included in the release.
- Replace pull request template content with the release notes generated using the changelog script:
   - ```
     scripts/changelog_check.rb -b origin/stages/prod
     ```
   - Review the generated changelog to fix spelling and grammar issues, clarify or organize changes into correct categories, and assign invalid entries to a valid category.
- If there are merge conflicts, check out how to [resolve merge conflicts](#resolving-merge-conflicts).

Share the pull request in `#login-appdev` and [cross-post](https://slack.com/help/articles/203274767-Share-messages-in-Slack) to `#login-ux` and `#login-product-strategy` channels for awareness.

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
1. Notify in Slack (`#login-appdev` and `#login-devops` channels)
    - e.g. `:recycle:  Starting idp RC <RELEASE_NUMBER> deploy to Production`
1. In the `identity-devops` repo:
   ```bash
   cd identity-devops
   ```
1. Check current server status, and confirm that there aren't extra servers running. If there are, scale in old instances before deploying.
   ```bash
   aws-vault exec prod-power -- ./bin/ls-servers -e prod
   aws-vault exec prod-power -- ./bin/asg-size prod idp
   ```
1. Recycle the IDP instances to get the new code. It automatically creates a new migration instance first.
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
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL
    ```

1. Set a timer for one hour, then check NewRelic again for errors.

1. Manually test the app in production:
    - Sign in to an account
    - Sign up for an account
    - Test proofing (identity verification) on the new account

1. **PRODUCTION ONLY**: This step is required in production
    1. In the application repository, use your GPG key to tag the release.
        ```bash
        git checkout stages/prod && git pull
        export GPG_TTY=$(tty)
        bin/tag-release
        ```
    1. Add release notes in GitHub:
        1. Create a new release:
           - IdP: <https://github.com/18F/identity-idp/releases/new>
           - PKI: <https://github.com/18F/identity-pki/releases/new>
        1. Release title: `RC #{NUMBER}`
        1. In the "Choose a tag" dropdown, enter the tag output by the `bin/tag-release` script
        1. Copy the release notes Markdown from the promotion pull request
        1. Click "Publish release"

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
aws-vault exec prod-power -- ./bin/scale-remove-new-instances prod ALL
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

1. Schedule a [retrospective](#retrospective)

##### Retrospective

If you do end up rolling back a deploy, schedule a blameless retrospective afterwards. These help
us think about new checks, guardrails, or monitoring to help ensure smoother deploys in the future.

### Passenger restart

{%- capture alert_content -%}
**2022-03-15**: This script is **not safe for prod use** at this time, it drops live requests instead of rotating smoothly. See [identity-devops#5651](https://github.com/18F/identity-devops/issues/5651) for more information. Only use it in emergency cases, or in a lower environment where live traffic does not matter.
{%- endcapture -%}

{% include alert.html content=alert_content alert_class="usa-alert--error" %}

A passenger restart is a quicker way to pick up changes to configuration in S3 without the need
to scale up new instances. See [`passenger-restart` docs]({% link _articles/devops-scripts.md %}#passenger-restart).

1. Make the config changes

1. Run the passenger restart command for the environment from the identity-devops repository
   ```bash
   # Restart passenger on the IDP instances
   aws-vault exec prod-power -- bin/ssm-command -d passenger-restart -o -r idp -e prod
   ```


### Config Recycle

A config recycle is an abbreviated "deploy" that deploys the same code, but lets boxes pick up
new configurations (config from S3).

1. Make the config changes

1. Recycle the boxes

   ```bash
   aws-vault exec prod-power -- ./bin/asg-recycle prod idp
   ```

1. In production, it's important to remember to still scale out old IDP instances.

    ```bash
    aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL
    ```
