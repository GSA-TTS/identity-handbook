---
title: "GitLab Production Deploys"
description: How to deploy changes to the production Gitlab system
layout: article
category: Platform
---

## Overview

If you need to deploy Gitlab Production, there are three ways to do it
(in order of preference):

* Gitlab Automatic Deployments
* Deploy using auto-tf
* Deploy by hand

Unfortunately, creating a HA gitlab instance with the omnibus package install
system that we are using is a HUGE pain to do, and for an org of our size, 
not recommended by Gitlab, so an upgrade will cause an outage of 8-15 minutes.
Sigh.  Someday we hope to move to the k8s version which will result in an outage
of seconds instead of minutes.

## Gitlab Automatic Deployments

Someday, we will make it so that when changes land on main, they will deploy to gitstaging,
and if they pass all the tests, then the prod pipeline will trigger a pipeline in gitstaging that will automatically deploy to prod!

But we don't quite have that level of confidence in our tests (yet!), and we also have
downtime when we upgrade these instances, so for a while,
we will have a manual deploy approval step so that we can control when they roll out.

* **Make sure that the code you are pushing deployed cleanly to the gitstaging environment!!**.
* Notify people that you are going to do a deploy in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.  I usually give 10-30 minutes warning and ask folks
  to ping me if this is a problem.  Also, do it after 5pm eastern, and basically nobody ever
  complains.
* Merge the code you want deployed into the `stages/gitlabproduction` branch and push it up.
* Go to the pipeline that successfully deployed the code to gitstaging and click on the start
  button for the `gitlabproduction_deploy` job.
* Go to https://gitlab.gitstaging.gitlab.login.gov/lg/identity-devops/-/pipelines and find
  the pipeline that was triggered.  After the SAST jobs run, you should be able to click on
  the `deploy_production` job.  It will say it needs approval, so go click on the link for
  that and approve it in the environments page under the `production` environment.
* The jobs should run to deploy the system and then the `test_production` job should run.
  Not sure why, but you may need to click on the play buttons for these post-deploy jobs,
  even though they aren't marked as manual jobs.
* The test job should indicate that everything went out OK, but
  it's never bad to check it out yourself and make sure that jobs are working and the UI
  is happy, etc.
* Notify people that the deploy is complete in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.

## auto-tf

This process uses [auto-tf]({% link _articles/platform-auto-tf-runbook.md %}) to
automatically deploy gitlab.  Here is the process:

* **Make sure that the code you are pushing deployed cleanly to the gitstaging environment!!**.
* Notify people that you are going to do a deploy in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.  I usually give 10-30 minutes warning and ask folks
  to ping me if this is a problem.  Also, do it after 5pm eastern, and basically nobody ever
  complains.
* Merge the code you want deployed into the `stages/gitlabproduction` branch and push it up.
* Go to the [auto_terraform_gitlab_production_](https://us-west-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/auto_terraform_gitlab_production_/view?region=us-west-2) CodePipeline
  in the tooling-prod AWS account and enable the transition between the source and the
  plan jobs in the pipeline, let it launch the plan, and then disable the transition again.
  This prevents us accidentally deploying prod in an uncontrolled manner.
* Watch the pipeline execute, and if there are failures, check them out and see if they
  need fixing or whatever.
* The test at the end of the pipeline should indicate that everything went out OK, but
  it's never bad to check it out yourself and make sure that jobs are working and the UI
  is happy, etc.
* Notify people that the deploy is complete in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.

## Deploy by hand

Really, you should avoid doing this.  Automation should be doing this.  But
here it is just in case.

* **Make sure that the code you are pushing deployed cleanly to the gitstaging environment!!**.
* Notify people that you are going to do a deploy in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.  I usually give 10-30 minutes warning and ask folks
  to ping me if this is a problem.  Also, do it after 5pm eastern, and basically nobody ever
  complains.
* Merge the code you want deployed into the `stages/gitlabproduction` branch and push it up.
* Terraform the system:  `aws-vault exec tooling-prod-admin -- bin/tf-deploy gitlab/production apply`
* Relaunch all the regular instances: `aws-vault exec tooling-prod-admin -- terraform/gitlab/recycle.sh production`
* Relaunch all the env-runner instances: `export RECYCLE_ENV_RUNNERS_ONLY=true ; aws-vault exec tooling-prod-admin -- terraform/gitlab/recycle.sh production`
* Test the system to make sure it's happy: `cd terraform/gitlab/tests ; aws-vault exec tooling-prod-admin -- ./test.sh production gitlab.login.gov`
* The test.sh should indicate that everything went out OK, but
  it's never bad to check it out yourself and make sure that jobs are working and the UI
  is happy, etc.
* Notify people that the deploy is complete in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.

Have fun!
