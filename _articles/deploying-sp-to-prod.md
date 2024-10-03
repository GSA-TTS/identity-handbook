---
title: "Deploying a Partner Service Provider Config to Production"
layout: article
description: "Process and procedures when deploying a partner service provider config to production"
category: Partnerships
---

Here is a list of items that need to be completed to deploy the configuration for a partner SP (Service Provider) to Production.

1. Ensure that the IAA is signed and includes the application explicitly in the Description of Service or Statement of Work.

2. Ensure that the **Integration IAA or MOU Confirmed** is checked on the left-hand column of ZenDesk, along with **Integration Details Confirmed**.

3. Ensure that the production configuration has been provided by the partner (e.g. valid Dashboard URL in the ZenDesk ticket) and includes the following:
  * If the app does not have a logo, then the partner will need to upload one before it can be deployed. You can find the [logo guidelines here](https://developers.login.gov/design-guidelines/#agency-logo-guidelines).

4. Create a PR in the [identity-idp-config](https://github.com/18f/identity-idp-config) repo that follows the instructions outlined in [Partner Success Engineer Workflow](https://docs.google.com/document/d/1WnTCdR8fwt46Eca1EHGQzyjnxfqhGfPe4uFti3PhVbg/edit#heading=h.pawq0m2tiuo3).

5. The PR should be reviewed by another Integration Engineer or Partner Success Engineer and merged into `main`.

6. Let the partner know via ZenDesk that their application has now been deployed and in the bottom right-hand corner click the arrow and select **Submit as Solved**.

7. Generally speaking, we rely on the [recurring IdP deployment process]({% link _articles/appdev-deploy.md %}) to pull in configuration changes, especially new integration launches. If a manual deployment is required, follow the [manual configuration deployment instructions](#manual-configuration-deployment-instructions).


8. Notify the person who requested the launch / change that the configuration should be live in production and that they should test that everything looks good.


# Manual Configuration Deployment Instructions

  *Note to team: check the official deploy guide periodically to make sure these steps stay up to date. Steps last updated 10/28/2022*

**Prerequisites:**

Make sure you have prod-power access to run commands for aws-vault. You will have to go through steps listed in [identity-devops](https://gitlab.login.gov/lg/identity-devops/-/wikis/Setting-Up-AWS-Vault) repo for setting up your production access.

**Step 1:**
  - make sure you are in the root directory of the identity-devops repository.
  - run `git pull` to make sure you have the latest in identity-devops.

**Step 2:**
  - `aws-vault exec prod-power -- ./bin/ls-servers -e prod`

This lists the production servers, including workers. Check that the number of instances running are what you would expect (numbers should match what is in the config - [asg_idp_desired](https://github.com/18F/identity-devops-private/blob/db5cbb3e124fb18b0177271c5488a717f9caa6b6/vars/prod.tfvars#L88) and [asg_worker_desired](https://github.com/18F/identity-devops-private/blob/db5cbb3e124fb18b0177271c5488a717f9caa6b6/vars/prod.tfvars#L96)).

If everything looks normal, proceed.

**Step 3:**
Notify in *#[login-devops](https://gsa-tts.slack.com/archives/C16RSBG49)* and *#[login-appdev](https://gsa-tts.slack.com/archives/C0NGESUN5)* slack channels that you are going to begin recycling production. [Link to example message](https://gsa-tts.slack.com/archives/C0NGESUN5/p1664914296671609).

**Step 4:**

*If uploading new logos:*
  - `aws-vault exec prod-power -- ./bin/asg-recycle prod idp`

*If no new logos:*
  - `aws-vault exec prod-power -- ./bin/asg-recycle prod migration`
  - This will kick off recycling *without* needing to scale out old instances.

**Step 5:**

Tail the logs so you can follow the recycle process by shelling into an instance.
  - run `aws-vault exec prod-power -- ./bin/ssm-instance --document tail-cw --newest asg-prod-migration`

Migration instance needs at least a minute, maybe more before this command works.
Tailing the logs is just for visual confirmation that the recycle has finished.

**Step 6:**

*If you are tailing the logs*
  - look for “complete/finished/success” language in the logs, it appears slightly above the end when the recycle finishes (might have to scroll up).

*If you were unable/didn't ssm into the instance*
  - if you try to SSM in and receive this error, the migration has finished:
  `An error occurred (TargetNotConnected) when calling the StartSession operation`


**Step 7:**

This step is optional, but you can confirm the config was updated/added by running rails console.
You will need to specify the reason you are running the console.

  - provide justification, such as `Confirming partner configuration deployed`
  - `aws-vault exec prod-power -- ./bin/ssm-instance -d rails-c --any asg-prod-idp`
  - `sp = ServiceProvider.find_by(issuer: 'ISSUER_URN_HERE')`
  - `sp.attributes`
 

**Step 8:**

If config is updated as expected, and you needed to do a full recycle for a new/updated logo:
  - run step 2 again to see the new instances as they come online.
  - once they have been online for 15 minutes, move to Step 9.

**Step 9:**

Scale out old instances of prod-worker and prod-idp
  - `aws-vault exec prod-power -- ./bin/scale-remove-old-instances prod ALL`

**Step 10:**
  - confirm instances are scaling out by running step 2 again. You should see that old instances say “shutting down” under status.


