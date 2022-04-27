---
title: "Acceptance Criteria for Infrastructure PRs/Issues"
description: "Detailed guide on how to file Issues and Pull Requests for the Login.gov Infrastructure Team."
layout: article
redirect_from:
category: Platform
---

## Overview

This document is used to define the ***acceptance criteria (AC)*** for GitHub Issues and Pull Requests concerning the Login.gov DevOps team. These primarily are created/filed within the `identity-devops` repo.

### Issue Readiness Requirements

It is important to understand that while an Issue or PR may define the ***solution*** to a problem (i.e. what specific change(s) need(s) to be made / are being made), said solution is only part of the task. In order for the DevOps team to acknowledge the Issue/PR and add it to our Sprint Backlog, we require that ***acceptance criteria (AC)*** be defined for every Issue/PR that is filed. This is part of our *Readiness Requirements*, defined as follows for Issues and PRs.

### Sanitizing Content

If the description within an Issue or PR contains the contents of file(s) and/or output of command(s), these contents ***must*** be vetted and sanitized as follows:

1. Contain all content within code blocks, using language syntax highlighting when possible
2. Remove all unnecessary sections of content, i.e. excess log messages, and replace with `[...]` indicators to show when such verbose logging has been removed.
3. Replace ***ANY/ALL*** sensitive strings with `<REDACTED>` strings. This includes tokens, keys, etc.

## Issues

All work being done by the DevOps team is captured in GitHub Issues. These primarily live in [the `identity-devops` repo](https://github.com/18F/identity-devops/issues), allowing easier association between Issues and the related Pull Requests that address them. Templates for the main types of Issues are contained within the `.github/ISSUE_TEMPLATE` directory in `identity-devops`.

### Readiness Requirement: Assign to the Project Board

In addition to the issue formatting defined below, *all Issues for the DevOps team **must** be assigned to the [**Login.gov Infrastructure** GitHub Project](https://github.com/orgs/18F/projects/5) when they are opened.* Since this board is available across the 18F GitHub Organization, Issues added to `identity-devops` are *not* automatically added to it. Be sure to follow this step when opening an Issue, or it may take longer to be added to a Sprint cycle!

### User Story Issues

**User Story Issues** filed to the DevOps team must contain the following, in order to satisfy the *Readiness Requirements*:

1. A **Problem**, used to define the value and impact of the Issue, prepared in *user story format*, i.e. "As a `USER`, I want to `DESIRED_ACTIVITY`, so that I can `VALUE_PROVIDED`."
2. One or more **Solutions**, which define the work to be done and/or the component(s) that need to be addressed. This may include specific configuration changes, indications of areas to investigate, tests to satisfy, etc.
3. **Acceptance Criteria** which explicitly defines ***all*** desired outcomes from the work done in the Issue. An Issue may only be marked as Completed when all of its AC has been satisfied.
4. In general, AC is tied to release to `dev` to prevent excessively long feedback loops.  AC can be tested against higher environments if warranted and should be noted in the AC.

An example:

> *Problem:*
> 
> As a **Service Provider**,<br>I want to **be able to successfully upload images via a web form**,<br>so that I can **attach a logo to my web application**.
> 
> *Solution(s):*
> 
> - Verify policy/permissions on S3 bucket
> - test API actions involved in uploading to said bucket via the web app
> - troubleshoot potential Issues with web app itself
> - etc.
> 
> *Acceptance Criteria:*
> 
> 1. Users *are* able to upload files to the bucket via the web form in `prod`
> 2. Bucket policy/permissions fall within specifications for compliance/security, while still providing access for #1
> 3. Web application is working properly and passing health checks in `prod`

In this Issue:
1. The audience, their needs, and the impact/value resulting from this Issue being completed, are all clearly defined
2. Suggested / requested tasks are detailed, outlining the general scope of work to be performed
3. All desired outcomes are clearly defined; it is understood that, upon satisfying all of the criteria defined here, the audience/Issuer will *accept* the work as having been completed.

### Bug Reports

**Bug Reports** filed to the DevOps team must contain the following, in order to satisfy the *Readiness Requirements*:

1. A **Description** providing a basic summary of the problematic behavior this report is describing.
2. **Detail** about how the Issue was discovered, including:
   - **Steps To Reproduce**, which should be precise but succinct
   - **Expected Behavior** indicating what should happen as a result of the Steps To Reproduce
   - **Actual Behavior**, indicating the difference from Expected Behavior and/or more details of the behavior covered in the Description
3. **Suggested Actions** to help define the work to be done, similar to **Solutions** in User Story Issues
4. **Acceptance Criteria** explicitly defining what, *including* the Expected Behavior, is expected in order for the bug to be accepted as completed.  (AC is tested against `dev` unless otherwise specified.)

It is possible for the AC to *only* include the Expected Behavior. However, if there are additional verification steps necessary in order to declare the bug as having been completely fixed, those should all be included within the AC.

### Issue Acceptance Lifecycle

The full process of accepting, working on, and completing an Issue is as follows:

1. Issue is opened and assigned to the [**Login.gov Infrastructure** GitHub Project](https://github.com/orgs/18F/projects/5), which will automatically place it in the **Backlog** column.
2. Before adding an Issue to the **To Do (This Sprint)** column -- to be worked on during the current sprint cycle -- a DevOps engineer verifies that Acceptance Criteria exists on the Issue, and that its objectives are clearly detailed. Issues *cannot* leave the backlog unless they satisfy this criteria -- the *Readiness Requirements*.
3. Once the Issue is in **To Do**, the assigned engineer follows through on the story to meet the defined AC.
4. Once the solution for an Issue has reached the specified AC environment **(`prod` by default)** the assigned engineer adds notes in the Issue with **evidence** (test steps, output, screenshots) to prove AC is met, and moves the Issue to the **Done** column.

An Issue is only **Done** when ACs are met and **evidence** is recorded to prove that the value described in the story has been delivered.  What is **evidence**?   It can be any of:
* A link to a functional test that proves the feature/function is working (This is the preferred choice!)
* A screenshot showing the feature/function working
* Shell output showing commands and output to validate the intended functionality

__Remember: We are here to deliver value, not lines of code, or Terraform plans, or reams of documents!  Evidence must focus on the value and not the work done.__

The Product Owner and Scrum Master will review items in **Done** and provide feedback.

## Pull Requests

Pull requests -- whether opened in `identity-devops` or in other repos -- ***must*** satisfy the following *Readiness Requirements*:

1. A generalized description of what is being changed/fixed by the PR.
2. Command-line outputs demonstrating that the changes can be implemented without errors (more information below).
3. Any corresponding Issue(s) that this PR *addresses* (as, generally, a PR will only address part of an Issue's AC)
4. Information regarding any breaking changes that may/will result once the change is implemented, along with steps detailing how to mitigate/roll back these changes in case of an error

Templates for the three main types of PRs are all contained within the `.github/PULL_REQUEST_TEMPLATE` directory in `identity-devops`.

Aside from the command-line outputs as detailed below, all PRs ***must*** indicate:

1. Which ***environment(s)*** these changes have been verified to work in. Most of the time, this will be a personal sandbox environment, and can be tested there without Issue. If the changes impact an account, such as those within Terraform directories `core` or `all`, it is acceptable to *test, then roll back,* the changes in the code within a `sandbox`/`dev` account, as long as the DevOps team is notified (within Slack) when the testing is about to take place.
2. Any ***breaking changes*** that will occur as a result of this PR being merged, whether just to `main` or when a particular `stages/` branch is fast-forwarded to a new release. The author of the PR *must* inform any/all individuals whose work may be impacted by the change, and tag the PR with the `BREAKING` label. Most of the time, this will be the On Call engineer who deploys a release containing this PR's changes.
3. Steps detailing, if they are necessary, any ***additional operations*** required in order to fully implement the change(s). These primarily will include changes to resources within the Terraform `state`, such as `state rm`/`mv`, `import`, etc. which must be performed *manually* before/after the plan is applied.
4. Similarly -- if necessary -- steps detailing any ***mitigation steps***, which fall *outside* of normal mitigation steps, that will need to be taken/recognized in case the plan needs to be rolled back. These will almost always need to be listed if there are any breaking changes, as defined in #2 above.

### Protip: Organizing Large Output with `<details>` Dropdown Blocks

If the command-line output demonstrating the PR's changes is particularly large in size (i.e. 30+ lines), it can be wrapped within a `<details>` HTML block, which will output a clickable, dropdown text link when the description is submitted:

   ```
   <details><summary> <tt>terraform plan</tt> output </summary>

	`` ``` ``

	`` ``` ``

	</details>
   ```
   
* The HTML for this block is included within the `terraform_pr.md` and `chef_pr.md` templates.
* Text within the `<tt>` tags will be marked as `code`; these tags can be removed if desired
* The line breaks between the `<details>` tags, and the actual code block, ***must*** remain in order for the code block formatting to render correctly.

### Terraform PRs

All PRs containing Terraform changes ***must*** include the output of a `terraform plan` command, which specifically shows which part(s) of the infrastructure will be changed when `terraform apply` is run on an environment.

The output of `plan` should be formatted in a way that allows for efficient readability. Unless surrounding context is necessary, only include the lines of the plan containing the *actual* changes meant to take place. These lines can be easily extracted if the `plan` output is piped through the following commands:

   ~~~sh
   tf-deploy <DEPLOYMENT_TYPE_AND_ENVIRONMENT> plan |
                  sed $'s,\x1b\\[[0-9;]*[a-zA-Z],,g' |
     grep --color=auto -E '(^\s+[-\#\+\~\>]|\s->)\s' |
               sed -E 's/(user_data += ").*"/\1\*"/'
   ~~~

This will also strip all color command codes, and replace any large `user_data` block(s) with `*` marks in the output.

If the desired outcome of the PR is that the resultant Terraform plan contains *no changes*, include (within the dropdown block defined in #2) the *entire* output of `terraform plan`, including the `No changes. Terraform is up to date.` block at the very bottom.

### Chef Cookbook/Recipe PRs

All PRs containing changes to Chef cookbooks/recipes ***must*** include one or more of the following, depending on the scope of the change:

1. Output of tests performed by the `kitchen verify` command, run from the appropriate directory within `nodes/` against a running TestKitchen instance. The output ***must*** indicate that all tests are successfully passed; additional commits may be added to the PR, if necessary, to ensure that all tests pass.
2. Output of the Chef Client logs containing the relevant resource(s) created/changed/executed/etc. by the change(s) in the recipe(s)/cookbook(s). These can be captured from the output of `kitchen test` / `kitchen converge`, or from `/var/log/cloud-init-output.log` on an instance in a sandbox environment.

For most Chef PRs, the output of `kitchen verify` should provide sufficient indication that the implemented changes will satisfy the AC of any Issue(s) connected to the PR. However, as `kitchen`'s build process operates somewhat differently than the way that `provision.sh` bootstraps hosts, it IS important to include Chef output logs that explicitly show changes occurring on a host that the `kitchen` test outputs do *not* explicitly indicate.

### Miscellaneous PRs

While the majority of PRs will fall into either Terraform or Chef changes, others may cause changes to aspects of the codebase such as the file structure, scripts/utilities used locally and/or on hosts, or changes to specific development environments. Since the PR itself will contain the diff that specifies changes made to the code, it will only need to include command-line output that ***proves*** successful implementation of the changes.

An example PR is [https://github.com/18F/identity-devops/pull/2381](https://github.com/18F/identity-devops/pull/2381), which contains a reorganization of the Terraform directory structure:

1. None of the variables/configs in any of the Terraform modules are, themselves, changed, so diffs showing the output of new AND old `terraform plan` operations are included to reflect this.
2. A description for how the diffs were generated is included.
3. Information regarding the use of `tf-deploy` after this change is implemented is provided. This was also communicated within the `#login-devops` Slack channel in advance of the release containing this PR.

These PRs will constantly vary in what their descriptions contain, but ***must*** address all points of the *Readiness Requirements* for PRs, as defined above (with as much as can be done for #2 when possible).
