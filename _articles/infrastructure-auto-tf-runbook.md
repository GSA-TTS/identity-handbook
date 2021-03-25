---
title: "Infrastructure auto-terraform Runbook"
description: How to use/manage/understand auto-terraform
layout: article
category: Infrastructure
---

## Overview

Login.gov needs automation.  We have gone through several prototypes and have some longer
term plans for CD systems, but it was decided that rather than letting best be the enemy of good, we
needed to get something going right away, to try to speed up our ability to iterate.  Thus,
we tried to use AWS CodePipeline and CodeBuild to automate our terraform runs.  This system
is being called "auto-terraform" or "auto-tf".

## Architecture

![auto-tf architecture diagram]({{site.baseurl}}/images/auto_terraform.png)

The auto-tf stuff runs in it's own VPC in the login-tooling account.
Codebuild notices changes in the branch you specify and thus will trigger
the pipeline for the tf dir specified.

Once a pipeline is triggered, it will run a terraform plan, then store the plan as an
artifact (for forensic purposes) in s3, and then it will use that plan to apply
the changes.  Once the apply is done, it will attempt to run tests for that target,
and then it will report the deployment status to slack.

The terraform stuff runs using a [terraform bundle](https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle)
so that we are using tooling that we have specified, and not something dynamically downloaded.
The terraform stuff is only allowed
to access `github.com`, amazon API endpoints, and probably a few more over time,
in an attempt to make this system really locked down,
since it will be the lever that can move anything in the login.gov system.

It also requires `iam_auto_terraform_enabled` to not be disabled in the account(s) you
are deploying to.  Right now, `terraform/all/prod/main.tf` and `terraform/all/sms-prod/main.tf`
are disabled, so we cannot to auto-terraform into those accounts until we get permission
to bring auto-terraform into our ATO boundary.

## Security!

This is a tremendously powerful tool.  Once fully deployed, this system will
be able to change/delete pretty much everything in the whole login.gov world.
As such, we need to be SUPER careful about the tools used here, how they are
used, etc.  This system should be as simple and self-contained as possible,
with as few permissions granted as we can make it.

For example, to try to reduce our dependency on external resources, we are
vendoring terratest go dependencies into this repo, and we are using a 
[terraform bundle](https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle)
to try to insulate us from supply chain attacks and from external services
being down.

Once this tool is working well and people trust it, we should be able to
start removing IAM permissions from most people, which will improve
our security posture.

### IAM

The IAM permissions for the role that is assumed when running terraform can be found
in `terraform/all/module/iam-role-terraform.tf`.  The role that contains the
permissions for the codepipeline and codebuild role can be found in
`terraform/tooling/module/codebuild.tf`.  These powers are pretty extensive already,
but try to not expand them unless you need it.

### GitHub Auth

There is an [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
which is in an s3 bucket which is used to auth with github.
If this gets deployed in a new place, that token will need to get copied over into
the `common/identity_devops_oauthkey` file in the secrets bucket.
Be aware that the token must be uploaded with `--content-type text/plain`.

### External Connectivity

Since Terraform requires a lot of AWS endpoints, we did as many as possible as VPC
endpoints that live in the public subnet in the auto-terraform VPC.  But not all
AWS services can be put in VPC endpoints, so we had to plug in a Network Firewall
too.  This network firewall limits us to accessing `github.com` and `*.amazonaws.com`
domains.  This list can be expanded if we need to, but try not to do this.  This is
another reason why we like terratest:  we can vendor all the go packages locally
so that we don't need to download them dynamically.  This system is going to be 
deploying important stuff, and the more we can vendor dependencies and limit
external access to prevent supply chain attacks, the better.

## Operations

### UI

You can find the pipelines if you go to <https://us-west-2.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-west-2>
in the tooling account.

### Re-running a pipeline

If you want to re-run a pipeline with the latest source, just go to the pipeline
or select it from the UI and select "Release change", which is usually a button
at the top of the UI.

This is useful if there was some sort of temporary failure and you want to
just re-do it from the top.  You can also go into the pipeline and retry
steps if they fail by clicking on the "Retry" button there, but that sometimes
fails if there have been changes to the infrastructure
since the terraform plan was generated.

### Logging

The easiest way to see what is going on is to click into the pipeline you are interested
in and then click into the particular stage.  You should be able to see the logs
of the particular step in a web UI.

Logs are also being streamed to CloudWatch under various `auto-terraform/*` log groups.
Each of the pipeline steps for each target stream to a different log group.
There are also logs for the networkfw that you can use for forensic purposes
under `auto-terraform/networkfw*` log groups.

### Common Tasks

#### Adding new targets

If you have more terraform directories you would like to auto-tf in identity-devops,
just go add them in like the other entries in <https://github.com/18F/identity-devops/blob/main/terraform/tooling/tooling/pipelines.tf>

So a plain terraform directory like you would deploy using `tf-deploy all/tooling apply` would
look like this:
```
# deploy the all/tooling target to the tooling account on the main branch
module "alltooling" {
  region = "us-west-2"
  source = "../module-pipeline"

  # This is the dir under the terraform dir to tf in identity-devops
  tf_dir = "all/tooling"
  # This is the gitref to check out in identity-devops
  gitref = "main"
  # This is the account to deploy tf_dir into
  account = "XXXXXXXXXXX"

  # pass in global config using module composition (https://www.terraform.io/docs/modules/composition.html)
  auto_tf_vpc_id            = module.main.auto_tf_vpc_id
  auto_tf_subnet_id         = module.main.auto_tf_subnet_id
  auto_tf_role_arn          = module.main.auto_tf_role_arn
  auto_tf_sg_id             = module.main.auto_tf_sg_id
  auto_tf_bucket_id         = module.main.auto_tf_bucket_id
  auto_tf_pipeline_role_arn = module.main.auto_tf_pipeline_role_arn
}
```

A personal environment that you would deploy using `tf-deploy app tspencer apply` would
look like this:
```
# deploy the tspencer environment to the sandbox account on the stages/tspencer branch!
module "tspencer" {
  region = "us-west-2"
  source = "../module-pipeline"

  # This is the dir under the terraform dir to tf in identity-devops
  tf_dir = "app"
  # This is the environment to deploy to
  env_name = "tspencer"
  # This is the gitref to check out in identity-devops
  gitref = "stages/tspencer"
  # This is the account to deploy tf_dir into
  account = "XXXXXXXXXXX"

  # pass in global config using module composition (https://www.terraform.io/docs/modules/composition.html)
  auto_tf_vpc_id            = module.main.auto_tf_vpc_id
  auto_tf_subnet_id         = module.main.auto_tf_subnet_id
  auto_tf_role_arn          = module.main.auto_tf_role_arn
  auto_tf_sg_id             = module.main.auto_tf_sg_id
  auto_tf_bucket_id         = module.main.auto_tf_bucket_id
  auto_tf_pipeline_role_arn = module.main.auto_tf_pipeline_role_arn
}
```

Be sure to get your branches and accounts right.  One thing to note is that
the personal environments use the `main` branch of https://github.com/18F/identity-devops-private/
to do the deploy, so if you make changes in there, it will automatically redeploy too.

#### Tests!

Tests are awesome!  Terratest is cool!  Let's use Terratest to test stuff!

If there is a `tests` dir in the directory that the auto-tf pipeline executes,
the pipeline will cd into it and run `./test.sh`.  So tests will automatically
be run after every deployment.

Technically, you can run any commands in `test.sh`, but that script should
probably mostly just be used to set up environment variables and give different
arguments to the main testing software, which is probably going to be
Terratest:  <https://terratest.gruntwork.io/>


##### Running tests locally

You can run tests locally with 
```
go test -v
```

If your tests rely on AWS creds, you can use aws-vault to run the tests.


##### Running tests in codepipeline

The default codepipeline will automatically run `./tests/test.sh` after
doing the terraform plan and apply, and will fail the pipeline run if the
tests fail.

The tests will run with the `auto-terraform` IAM role, so if your test
needs more perms, you will need to add that to the auto-terraform role,
or to create an IAM role that has the permissions it needs, and then
assume that role in the `test.sh` script before running terratest.

##### Updating dependencies

We want our tests to be fully contained and not require external resources
to build and run.  To that end, we are vendoring the golang dependencies
in the `tests` dir.

To update that, just say `go mod vendor`, and it should update the
stuff in vendor and let you check it in.  All of the normal go module
stuff should work as well, like `go get -u` and so on.

##### Terratest Resources

https://terratest.gruntwork.io/docs/

https://pkg.go.dev/github.com/gruntwork-io/terratest


#### Updating Terraform Bundle

We will undoubtably need to update the version of terraform and the
various plugins that it uses in the future.

You can update this bundle by editing `bin/terraform-bundle.sh` to update versions of plugins and tf
and then running `aws-vault exec tooling-admin -- bin/terraform-bundle.sh`,
which will upload the new bundle to the tooling auto-tf bucket.  You will then
need to update the `tfbundle` variable in the `module-pipeline/variables.tf` file.

#### Pausing Pipelines

If you are testing out changes and don't want everything to auto-deploy
for some reason, you can go into the pipelines that you want to not operate and
click on the "Disable transition" button either after the source or the plan
steps.  This will cause the latest change to get stuck there until you
enable the transition again.

**BE SURE TO RE-ENABLE THIS LATER ON**

Have fun!
