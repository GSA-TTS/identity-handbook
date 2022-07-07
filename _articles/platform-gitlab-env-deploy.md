---
title: "GitLab Environment Deploys"
description: How to use GitLab to deploy your sandbox IdP environments
layout: article
category: Platform
---

## Overview

Login.gov needs automation.  We finally have acquired GitLab and are
able to use it for deploying idp environments!  This document will tell
you how the environment deploy process works, how to set up your
environment so that it is deployed by gitlab (skip ahead to
["Adding new application sandbox environments"](#adding-new-sandbox-environments) if you are impatient
and just want to get it going), and give some
operational tips on how to debug issues.

## Architecture

As code gets merged into `main`, a pipeline will build `env_deploy` 
and `env_test` docker images, save them to ECR, and
tag them with `latest` and the git SHA of the code that was used to create
the image.  This image will be available for us to hardcode into our
environments for deploys/tests.

As you check
in code to your `stages/<environment>` branch, GitLab will notice and
kick off a pipeline.  It will run a deploy job that is tagged for
`<environment>-env-runner`.  The `env_deploy` image contains all of
the terraform binaries/providers/etc that it needs to do a self-contained
deployment, so we no longer need to rely on a terraform bundle like we
did with auto-tf, and so we do not require internet access to run our
tooling at runtime, which adds to security and reliability.

`<environment>-env-runner` is a special runner that runs inside of your
environment that is empowered with all the terraform powers that we use
for creating infrastructure.  It only can run a hardcoded `env_deploy`
image, which runs terraform on the code that gitlab supplies.  The runner
also is constrained from accessing outside resources through security
groups and a dedicated `env_runner` proxy.

For forensic purposes, the terraform plan and plan output are stored
as an artifact in S3, and can be retrieved through the gitlab UI or
directly in S3 if you know the build number.

After that, tests are run against your environment using the `env_test` image
on the env_runner. The test results are translated
to junit output and uploaded to gitlab as an artifact so that test
results are available in the pipeline.

### Future Architecture

We hope to tie these pipelines together so that when new code is introduced in 
certain branches, it will be deployed to a staging or CI environment or something,
tested, and if successful, go on to deploy to the final environment.

Ideally, if we merge code to main, it should automatically roll out after being
properly tested.  Right now, our tests are a bit too minimal for that to
happen, but as we add to them, our confidence will become high enough to
start doing this more and more.

## Security!

This is a tremendously powerful tool.  Once fully deployed, this system will
be able to change/delete pretty much everything in the whole Login.gov world.
As such, we need to be SUPER careful about the tools used here, how they are
used, etc.  This system should be as simple and self-contained as possible,
with as few permissions granted as we can make it.

Once this tool is working well and people trust it, we should be able to
start removing IAM permissions from most people, which will improve
our security posture.

### IAM

The IAM permissions and the role that is assumed when running terraform can be found
in `terraform/modules/gitlab_runner_pool/iam-role.tf`, though truthfully,
the most important ones are attached to the role are the AutoTerraform
policies, which can be found in `terraform/all/module/iam-role-terraform.tf`.
These powers are pretty extensive already, but try to not expand them unless you need it.

### External Connectivity

Since Terraform requires a lot of AWS endpoints, we did as many as possible as VPC
endpoints that we explicitly grant access to with security groups.  But not all
AWS services can be put in VPC endpoints, so we had to plug in an outbound proxy
which allows a limited set of services that the deploy process can access.
This list can be expanded if we need to, but try not to do this.  Other than these
explicit allows, the runner is denied access to everything with security groups.

To limit runtime external connectivity requirements, we build the image that runs
terraform to have all required tooling and plugins on it already.  This should
insulate us from supply chain attacks and from external services being down.

### Container security

We are hardcoding what exact container image the runner is able to
run, as well as disabling the ability for gitlab to override the
entrypoint of the container, so that somebody who compromises gitlab
will be unable to run arbitrary jobs on the env runners.  They will
only be able to run terraform in our constrained way.

We are also disabling services and root access for docker, as well
as following the standard docker hardening procedures.  There are also
checks to make sure that you aren't trying to be tricky and do a deploy
to the wrong environment.

## Operations

### UI

You can find the pipelines if you go to <https://gitlab.login.gov/lg/identity-devops/-/pipelines>.

It's pretty easy to look at these things and click on cancel/retry/etc,
but there are lots of docs on the [gitlab site](https://docs.gitlab.com/ee/ci/pipelines/)

### Logging

The easiest way to see what is going on is to click into the pipeline you are interested
in and then click into the particular stage.  You should be able to see the logs
of the particular step in a web UI.

### Common Tasks

#### Updating terraform binary

The terraform binary is configured in `identity-devops/dockerfiles/env_deploy.Dockerfile`.

Edit `TF_VERSION` and `TF_SHA256` to change what version it is.  You can find the versions
and SHA256es of these binaries by browsing around under <https://releases.hashicorp.com/terraform/>.

#### Updating env_deploy or env_test images

You will probably want to test your stuff out first, so make a branch and make your changes
to the Dockerfile(s) and `env_deploy.sh` scripts and so on in that branch, then add your
branch to the `only:` section for the `build_env_deploy` section in your `.github-ci.yml`
on your branch.  Once you check it in, your branch will build the image for your branch.

There are two ways to test this out in your environment:
1.  The quick-n-dirty way.  Log into your env_runner instance in your env and edit
    `/etc/gitlab-runner/config.toml`.  Comment out the `allowed_images` line.
    restart gitlab runner with `systemctl restart gitlab-runner`.  Your runner will
    now allow all images to run on it, which is not secure, but it'll increase your
    iteration speed because you don't need to recycle your env_runner for every new
    image you create.  

    After that, change your branch that your env deploys from so that it uses the new
    image in your `.gitlab-ci.yml` to get it to run a deploy and test the new
    functionality out.

    You should recycle your env_runner when you are done with this, so that it gets
    locked down again.

1.  The end-to-end way (slow).  This is the normal
    way that systems get set up, so you should probably do this before you do your final
    PR that has your image in it to make sure that it works end-to-end.  Copy
    `s3://login-gov.secrets.<account>-us-west-2/common/gitlab_env_runner_allowed_images` to
    either add or replace the image in that file with your new one.  You can get the proper
    digest from either looking at the image build log at the end, or by looking at the ECR
    console for the image that just got built.  Once you have the new image in there, copy
    that file up to `s3://login-gov.secrets.<account>-us-west-2/<env>/gitlab_env_runner_allowed_images`,
    where `<env>` is your environment.  Then, go to your environment and recycle the
    env_runner.  It should come up ready to let your new image run.

    After that, change your branch that your env deploys from so that it uses the new
    image in your `.gitlab-ci.yml` to get it to run a deploy and test the new
    functionality out.

Once you've verified it works, you should add the new image to the 
`s3://login-gov.secrets.<account>-us-west-2/common/gitlab_env_runner_allowed_images`
file and maybe remove some old ones, but not if they are being used by any of the
environments.  This will let other environments know that it is an approved image
once they relaunch their env_runners.  You might also want to remove your
`s3://login-gov.secrets.<account>-us-west-2/<env>/gitlab_env_runner_allowed_images`
file, so your env_runner gets it's stuff from the common secret again.

I know, this is a PITA, but this would be SO much easier if we
didn't have to lock down our
gitlab runners.  They have a crazy amount of power, so we have to make sure that
arbitrary jobs/code cannot be run on them.

#### Updating allowed images on env_runner

If you want to add more images to be allowed to run by the
env_runner, you can edit the file in:
* `s3://login-gov.secrets.<account>-us-west-2/<env>/gitlab_env_runner_allowed_images`
  if you want to override what images are allowed in your own environment.
* `s3://login-gov.secrets.<account>-us-west-2/common/gitlab_env_runner_allowed_images`
  for what everybody who does not have an env-specific file is allowed.

Then, recycle the env_runners that you want to pick the change up.
They should now only allow the images in the file to run on it, and
error out for anything else.

You can add plain `repo/name:tag` image names, but we strongly recommend
against that, since these might be subverted.  It would be much better to
use a specific image, like `repo/name@sha256:feedface42...`.  You can get the
sha256 digest from the build process or from looking at ECR.

You should probably remove old images over time too, but be careful when
editing the common list, because some branches may be using old images.

#### Updating allowed images or services on env_runner

Note:  You probably don't want to do this, as env_runners should
basically only be doing deploys and terratests.  They shouldn't
require postgres or other services like other CI jobs do.
But just in case, here is how.

New services can be added to the env_runner by editing
<https://github.com/18F/identity-devops/blob/main/kitchen/cookbooks/identity-gitlab/recipes/runner.rb>.

Look for where `node.run_state['allowed_services']` is set.  An empty
list (`[]`) means allow all services.  A list with an empty string
means allow nothing (`[""]`), which is what it ought to be set as.
You can add more images to that list.

#### Adding new sandbox environments

To enable your sandbox:

1. Create a new branch from main.  The convention is `stages/<env>`, even though
   it technically could be anything.
1. Edit `identity-devops/kitchen/environments/<env>.json` and add `gitlab_url`
   and `gitlab_config_s3_bucket` to `login_dot_gov`.  It should look 
   something like this:
   ~~~json
   {
     "name": "myenv",
     "description": "",
     "json_class": "Chef::Environment",
     "chef_type": "environment",
     "default_attributes": {
       "login_dot_gov": {
         "idp_run_migrations": true,
         "allow_unsafe_migrations": true,
         "idp_sync_static": true,
         "gitlab_url": "gitlab.login.gov",
         "gitlab_config_s3_bucket": "login-gov-production-gitlabconfig-<accountid>-<region>"
       }
     },
     "override_attributes": {
     
     }
   }
   ~~~
   This will tell chef how to configure the runner.  Truthfully, this could probably
   be done with the nifty tagging stuff that is being used, but I didn't think about
   that when writing it.  A fun thing to do in the future.
1. Edit  `identity-devops-private/vars/<env>.tfvars` to add in these variables:
   ~~~
   gitlab_servicename    = "com.amazonaws.vpce.us-west-2.vpce-svc-<something>"
   gitlab_hostname       = "gitlab.login.gov"
   gitlab_configbucket   = "login-gov-production-gitlabconfig-<env>-<region>"
   gitlab_enabled        = true
   gitlab_runner_enabled = true
   ~~~
   You can probably just copy these from `tspencer.tfvars`.
1. Terraform your environment.  It should set all the privatelink stuff up and
   launch the env_runner.
1. Edit `identity-devops/.gitlab-ci.yml` and copy one of the sets of deploy
   jobs that are out there.  `deploy_tspencer` and `test_tspencer` are probably
   good candidates.  Please be sure to rename them and edit all the fields
   that have env-specific stuff in them to your env.
1. Push changes to your branch to trigger gitlab to run your deploy pipeline
   to your env!

#### Migrating your sandbox to gitlab

Follow the steps in the "Adding new sandbox environments" section above, but
also create a PR off of master that removes your sandbox from auto-tf,
probably in `identity-devops/terraform/tooling/tooling/app_sandboxes.yml`.
Once that PR is merged to main, auto-tf should auto-tf itself and remove
your auto-tf pipeline.

#### Tests!

Tests are awesome!  Terratest is cool!  Let's use Terratest to test stuff!

If there is a `tests` dir in the identity-devops directory that the pipeline executes,
the pipeline will cd into it and run `./test.sh`.  So tests will automatically
be run after every deployment.

Technically, you can run any commands in `test.sh`, but that script should
probably mostly just be used to set up environment variables and give different
arguments to the main testing software, which is [Terratest](https://terratest.gruntwork.io/)


##### Running tests locally

You can run tests locally with 
```
go test -v
```
while you are in `identity-devops/tests`.

If your tests rely on AWS creds, you can use aws-vault to run the tests.

##### Updating dependencies

We want our tests to be fully contained and not require external resources
to build and run.  To that end, we are vendoring the golang dependencies
in the `tests` dir.

To update that, just say `go mod vendor`, and it should update the
stuff in vendor and let you check it in.  All of the normal go module
stuff should work as well, like `go get -u` and so on.

##### Terratest Resources

- <https://terratest.gruntwork.io/docs/>

- <https://pkg.go.dev/github.com/gruntwork-io/terratest>


#### Pausing Pipelines

You can turn off all pipelines in a repo with this:
<https://docs.gitlab.com/ee/ci/enable_or_disable_ci.html>

You can turn off the pipeline for a branch by checking in a
`.gitlab-ci.yml` file in that branch which has `when: manual`
in it for the jobs defined that would normally run in it or
some other change to make it not match when gitlab looks for
stuff that should run, like commenting it out or whatever.


Have fun!
