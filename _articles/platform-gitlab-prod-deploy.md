---
title: "GitLab Production Deploys"
description: How to deploy changes to the production Gitlab system
layout: article
category: Platform
cSpell: ignore SAST
---

## Overview

If you need to deploy Gitlab Production, there are two ways to do it
(in order of preference):

* Gitlab Automatic Deployments
* Deploy by hand

Unfortunately, creating a HA gitlab instance with the omnibus package install
system that we are using is a HUGE pain to do, and for an org of our size, 
not recommended by Gitlab, so an upgrade will cause an outage of 8-15 minutes.
Sigh.  Someday we hope to move to the k8s version which will result in an outage
of seconds instead of minutes.

## Gitlab Automatic Deployments

Someday, we will make it so that when changes land on main, they will deploy to gitstaging,
and if they pass all the tests, then the prod pipeline will trigger a pipeline in
gitstaging that will automatically deploy to prod!

But we don't quite have that level of confidence in our tests (yet!), and we also have
downtime when we upgrade these instances, so for a while,
we will have a manual deploy approval step so that we can control when they roll out.

* **Make sure that the code you are pushing deployed cleanly to the gitstaging environment!!**.
* Check <https://gitlab.login.gov/admin/background_migrations> to see if there are any background
  migrations still going.  There should be none.  If there are, either wait until they are
  complete, or if they don't seem to be moving, 
  [contact gitlab support](https://github.com/18F/identity-devops/wiki/GitLab-Ultimate-Licensing-and-Support)
  and ask for help in getting the migrations unstuck.
* Notify people that you are going to do a deploy in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.  I usually give 10-30 minutes warning and ask folks
  to ping me if this is a problem.  Also, do it after 5pm eastern, and basically nobody ever
  complains.
* Merge the code you want deployed into the `stages/gitlabproduction` branch (probably the
  git SHA of the last successful push to gitstaging) and push it up.
* Go to the pipeline that successfully deployed the code to gitstaging and click on the start
  button for the `gitlabproduction_deploy` job.
* Go to https://gitlab.gitstaging.gitlab.login.gov/lg/identity-devops/-/pipelines and find
  the pipeline that was triggered.  After the SAST jobs run, you should be able to click on
  the `deploy_production` job.  It will say it needs approval, so go click on the link for
  that and approve it in the environments page under the `production` environment.
* The jobs should run to deploy the system and then the `test_production` job should run.
  Not sure why, but you may need to click on the play buttons for these post-deploy jobs,
  even though they aren't marked as manual jobs.
* **SPECIAL NOTE**:  If the gitlab server takes too long to come up for whatever reason,
  sometimes the test-pool and build-pool ASGs will give up on relaunching instances, and
  the deploy job will take >1h to run, which will cause it to fail.  I usually check the
  build/test runner pool ASGs around the 20 minute marks, and add one to their
  `Maximum capacity` to cause them to start trying to launch instances again and thus
  prevent the deploy job from timing out.
* The test job should indicate that everything went out OK, but
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
* Wait until the ASG instance refreshes have completed.
* Test the system to make sure it's happy: `cd terraform/gitlab/tests ; aws-vault exec tooling-prod-admin -- ./test.sh production gitlab.login.gov`
* The test.sh should indicate that everything went out OK, but
  it's never bad to check it out yourself and make sure that jobs are working and the UI
  is happy, etc.
* Notify people that the deploy is complete in `#login-team-mary`, `#login-team-radia`,
  `#login-devops`, and `#login-appdev`.

Have fun!
