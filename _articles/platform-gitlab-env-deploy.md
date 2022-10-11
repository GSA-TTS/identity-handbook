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

    When your new image works and a build completes, your env_runner will be recycled,
    so it will return to it's locked-down state.  You can keep it around by commenting
    out the `post_deploy_<env>` job in `.gitlab-ci.yml` and keep cycling if you need to,
    but BE SURE TO REVERT THIS WHEN DONE.

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
1. Make sure that `identity-devops-private/vars/<env>.tfvars` has these variables:
   ~~~
   gitlab_enabled        = true
   gitlab_runner_enabled = true
   ~~~
   Make sure they are set to `true`.  You should have them by default, but if
   not, copy them from `vars/tspencer.tfvars`
1. Terraform your environment.  It should set all the privatelink stuff up and
   launch the env_runner.
1. Edit `identity-devops/.gitlab-ci.yml` and copy one of the sets of deploy
   jobs that are out there.  You will need _at least_ the deploy and the test
   jobs (`deploy_tspencer` and `test_tspencer`, for example), but there are
   others too.  You should copy them all.  Please be sure to rename them and
   edit all the fields that have env-specific stuff in them to your env, like
   change all `tspencer`s to `<yourenv>`.
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
We probably don't want to do that.

You can turn off the pipeline for a branch by checking in a
`.gitlab-ci.yml` file in that branch which has `when: manual`
in it for the jobs defined that would normally run in it or
some other change to make it not match when gitlab looks for
stuff that should run, like commenting it out or whatever.

#### Fine-tuning your deploys

If you are working on terraform-only changes, you might want to only
deploy the terraform half of the changes, and not recycle the environment.
Or you might want to only recycle one type of host instead of everything.
We can do that!

There are two variables you can set to change the behavior of gitlab
deploys in the deploy job for your env in the `.gitlab-ci.yml` file:
* `DEPLOY_TERRAFORM_ONLY`:  If you set this to anything, it will only terraform
  your env, and not recycle anything.  Tests and so on will still run.  Here
  is an example of how you would use it:
  ```
  deploy_tspencer:
    <<: *deploy_template
    variables:
      GIT_SUBMODULE_STRATEGY: normal
      DEPLOY_TERRAFORM_ONLY: "true"
    environment:
      name: tspencer
      on_stop: stop_tspencer
      url: https://idp.tspencer.identitysandbox.gov/
    resource_group: tspencer
    tags:
      - tspencer-env-runner
    only:
      - stages/tspencer
  ```
* `RECYCLE_ONLY_THESE_ASGS`:  This should be set to a space-separated list
  of the ASGs that you want to recycle after doing a terraform run.
  For example:
  ```
  deploy_tspencer:
    <<: *deploy_template
    variables:
      GIT_SUBMODULE_STRATEGY: normal
      RECYCLE_ONLY_THESE_ASGS: "tspencer-idp tspencer-worker"
    environment:
      name: tspencer
      on_stop: stop_tspencer
      url: https://idp.tspencer.identitysandbox.gov/
    resource_group: tspencer
    tags:
      - tspencer-env-runner
    only:
      - stages/tspencer
  ```

When you are done doing your targeted testing, it is recommended that
you delete the entire variables section so that if the variables in the
template are updated, you get the benefits of the templated variables.

#### Debugging env_runner issues

Environment runners are funny in that they are sort of not a part of gitlab,
but kinda are too because they need to register and talk with gitlab.  They
are also a bit of a (previously documented above) pain to use because they are
locked down with their own proxy and only allowing certain images to run.
Thus, they deserve some special discussion.

##### How to detect that your env_runner is not working

* Do a deploy to your environment using gitlab.  If the job is waiting forever
  and cannot run, the env_runner is probably not working.
* Take a look at the list of runners under the admin menu.  If there is no
  `<env>-env-runner` runner alive, then it did not come up after recycling.
* Look at the ASG in the AWS console.  If it keeps failing to launch, it's
  sad.

##### How to debug env_runner issues

The env runner has to be able to complete these tasks to come up properly:
* *Get the runner registration token from the `gitlab-config` s3 bucket.*  This
  requires the `gitlab_config_s3_bucket` tag on the instance to be properly
  set to the proper gitlab config bucket, network access to the
  s3 endpoint, and permissions to read objects from it.
* *Be able to talk to the proxy.*  It needs network access to the the proxy
  on the `http://obproxy-env-runner.login.gov.internal:3128` url.
* *Be able to query the gitlab endpoint through the proxy.*  The proxy must
  allow it in the `/etc/squid/domain-allowlist.conf` file, the endpoint needs
  to be set up and connected, and it needs network access to that endpoint.
  The gitlab endpoint is `login-gitlab-<env>`, which is _usually_ accessed
  over the https://gitlab.login.gov/ URL, if you haven't configured your
  cluster to go to bravo or one of the other envs.

So here's what you can do to debug those things:
* Look at the logs as it is booting.  The fastest way to do this is to ssm into
  the host and tail the `/var/log/cloud-init-output.log` file.  I use a command
  like this to get in so that I'm there early in the boot process before it fails:
  ```
  until aws-vault exec sandbox-admin -- bin/ssm-instance --newest asg-tspencer-gitlab-env-runner ; do sleep 2 ; done ; stty sane
  ```
  You can also probably get these logs through cloudwatch, but it takes a long time
  for them to show up there, so I never do that.
* If it hangs before chef gets going, then it's having problems getting to the proxy
  or maybe general network issues.
  Look at the network connectivity (security groups, routing, etc.)
  between the env_runner and the proxy.
* If it hangs near the start of the identity-devops chef run, then it's probably trying to get
  the runner token from s3, and it probably is timing out trying to get to the
  s3 endpoint.  Look at the network config or the s3 endpoint config.
  You can use `aws s3 ls` and other commands to diagnose this a bit.
* If it hangs when trying to register the runner, then it's probably having problems
  with network connectivity, either between the env_runner and the proxy.
* If it fails while registering, `^C` quickly and run
  ```
  cat /etc/gitlab-runner/runner-register.sh ; /etc/gitlab-runner/runner-register.sh`
  ```
  Look at the runner token in the registration command and make sure it's actually a real
  string, not empty.  If it is empty, then there's something wrong with the s3 bucket,
  like the env_runner doesn't have permissions to read the runner token, or maybe
  the file somehow got zeroed out.

  Also look at the gitlab url that it's trying to register to and make sure it's
  proper.

  *Be aware that the host will register it's failure shortly and thus the
    ASG will nuke the instance, leaving your ssm session hanging.  That's why you
    do the `^C` fast.  :-)*
* If the token is not empty, then look at what is going on when you run the registration script.
  If it's hanging or timing out, then look at the network config between the proxy and
  the gitlab VPC endpoint.  If it's giving back a 503, then look at the proxy and
  make sure it has the gitlab url allowed, and that it can connect to it from the
  proxy.
* If everything is set up properly, make sure that the VPC endpoint is working and
  wired up to the proper gitlab.  The easiest way to do that is through the AWS
  VPC console.  It should plug a magic hostname that redirects it to their VPC endpoint
  in the private dns zone for the cluster.  It should auto-register everything,
  but maybe there can be some problems?
* Or maybe the gitlab server is messed up!  Check it out and make sure it's happy.
  You can look at the logs in /var/log/gitlab and look for the register API call,
  and they might give you some indication of the problem, like using the wrong token
  or I am out of disk space or help I am reading Vogon poetry or whatever.
  The admin UI might be useful?
  I don't know because I've not had problems like this, but it could certainly happen.


Have fun!
