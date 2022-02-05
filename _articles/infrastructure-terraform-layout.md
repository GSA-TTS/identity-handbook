---
title: "Terraform Layout and States"
description: "Terraform structural overview"
layout: article
category: Infrastructure
---

## Overview

Terraform is our primary Infrastructure as Code (IaC) tool.  Our IaC is laid
out in a series of repositories containing modules (reusable Terraform code)
and stacks (collections of code, including calls to modules, to define a given
"state").

## Current Stacks of Interest

Our current stacks all live in <https://github.com/18F/identity-devops/tree/main/terraform>

This lists some of the most notable stack directories which map to various
states we maintain.
~~~
terraform/
├── all                ## Per-account IAM roles, permissions, and guardrails
│   ├── master          # Human account
│   ├── prod            # Production application account
│   ├── sandbox         # Sandbox/test application account
│   ├── tooling         # Automation for non-production accounts / Dev GitLab
│   ├── tooling-prod    # Automation for production accounts / Prod GitLab
│   └── <other>         # Additional accounts
│
├── analytics          ## (Dormant) RedShift Analytics
│
├── app                ## Per-application environment - Variables loaded from `identity-devops-private/vars`
│
├── core               ## DNS and other account-wide application concerns
│   ├── prod            # Production, including login.gov DNS
│   └── sandbox         # Application sandbox, including identitysandbox.gov DNS
│
├── ecr                ## Elastic Container Registry - Managed image repos
│   └── tooling         # Automation container (docker) repos
│
├── gitlab             ## GitLab software factory
│   ├── alpha           # Test environment
│   ├── bravo           # Test environment
│   ├── charlie         # Test environment
│   └── prod            # Production - gitlab.login.gov
│
├── imagebuild         ## EC2 AMI image building
│   ├── prod            # Production images
│   ├── sandbox         # Sandbox images
│   ├── tooling         # Non-production automation images
│   └── tooling-prod    # Production automation images
│
├── master             ## User accounts and authorization
│   └── global          # Human user accounts
│
├── sms                ## PinPoint SMS
│   ├── prod            # us-west-2 PinPoint
│   ├── prod-east       # us-east-1 PinPoint
│   ├── sandbox         # us-west-1 PinPoint
│   └── sandbox-east    # us-east-1 PinPoint
│
├── tooling            ## Automation and AWS level CI/CD
│   └── tooling         # auto-tf Terraform CD
│
└── waf                ## Web Application Firewall
    ├── int             # WAFs for `int`
    ├── prod            # WAFs for `prod`
    ├── staging         # WAFs for `staging`
    └── <other>         # Other optional and test WAFs
~~~

## Terraform States

All states are stored in Amazon S3 with version tracking and restricted
permissions.  DynamoDB is used to provide locking.

Our `tf-deploy` utility handles setting up remote state and locking, setting
per-stack environment variables based on the relevant `env.sh` file, and adding
one or more `tfvars` arguments, depending on the type of stack.

There are two stack styles in use.

### DevOps Private Style

This style loads environment variables and tfvars from the
`identity-devops-private` repository.  Only `app` still uses this style.

Example usage:
~~~
./bin/td-deploy ENVIRONMENT app COMMAND

./bin/td-deploy dev app apply
~~~


### Module Style

This style uses `env.sh` and `main.tf` in the stack folder and loads
`../module` to define the stack.

Example usage:
~~~
./bin/tf-deploy STACKTYPE/ENVIRONMENT COMMAND

./bin/tf-deploy master/global plan

./bin/tf-deploy waf/dev apply
~~~

## Terraform Modules

Modules are concentrated in two places:

* `identity-devops/terraform/modules` - Login.gov specific or tightly coupled modules
* `identity-terraform/` - Open Terraform modules with potential use outside of Login.gov

The latter are public and we welcome use by anyone.

## More Information

Extensive information and instructions on using our Terraform can be found in
[Making Changes Via Terraform]({% link _articles/infrastructure-making-changes-via-terraform.md %})
