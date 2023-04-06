---
title: "GitLab"
description: "GitLab Image Signing"
layout: article
category: Platform
---

# Introduction

Login.gov's GitLab uses docker images to run various CI/CD jobs.  Some of the runners
are empowered to do Terrible Things with terraform, and thus, we need to lock down
what images can be run on those runners.  We are currently doing this by using the
gitlab runner's allowed_images feature.  Info on how to manage that can be found in
the [env_deploy documentation]({% link _articles/platform-gitlab-prod-deploy.md %}).

But down the road, we believe that image signing is a better process.  We are using
[Cosign](https://docs.sigstore.dev/cosign/overview/) to sign images in ECR and validate
them on the runners.

Unfortunately, cosign is not supported natively by dockerd, and Docker Content Trust is
not supported by ECR, so rather than just letting dockerd say "nope!", we have an
image killer process that runs every minute to check the signatures of the running images.
If they fail, then the image killer will kill the container and log messages to syslog
for us to alert on if we so desire.

There are a couple of other signing systems out there, but none are as simple and
supported by ECR as Cosign, so we are rolling with that.  Cosign is also really well
supported by various admission controllers in the k8s world, so this process should
just become simpler and better once we containerize.

# Implementation

A cosign signing key is set up by an admin using the `identity-devops/bin/create_image_signing_key.sh`
script.  It creates an asymmetric KMS key, stores the key ID in S3, and pulls the public key out and
stores it in S3 as well.  The key is only usable by FullAdmins.

Administrators then can sign images with `identity-devops/bin/sign_image.sh`, which pulls the
key ID down and uses the KMS key to sign the specified image.

If the gitlab environment has `node['identity_gitlab']['image_signing_verification']` set to
`true`, a cron job will run on env_runners that will check the signatures of the images
that are running and kill those that fail.  It uses the public key stored in
the S3 secrets bucket.

There are various options that can be configured to change the key used in the environment,
or whether the key is common or env-specific.

# Common Operational Tasks

## Create Cosign Signing Key

This creates an asymmetric KMS signing key and puts `<keyname>.keyid` and `<keyname>.pub`
in the common secrets bucket.

```
bin/create_image_signing_key.sh <keyname>
```

The default keyname used by the env_runners is `image_signing`.  These keys
are already created in the tooling-sandbox and tooling-prod accounts.

## Sign Image

Once an image is built and you want to use it, you will look at the
image to see whether it meets our standards for security (look at ECR
scan results, etc).  If you approve, then run sign_image.sh, and then you can
specified the approved image to be used by gitlab in the `.gitlab-ci.yml` file.

```
bin/sign_image.sh image_signing <accountid>.dkr.ecr.us-west-2.amazonaws.com/cd/terraform_plan:@sha256:<SHA>
```

Notice that we are signing a particular sha256, not an image tag.  Tags can change for an image,
but not the image SHA, so that's what we want to use.

Also notice that we are using the default `image_signing` key to sign it in the example.
You may change that if you have your own key for your env.
