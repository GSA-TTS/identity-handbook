---
title: "Pull Request Process"
description: "How we do code reviews in pull requests"
layout: article
category: "Development"
---

## General Code Review Guidelines

See the overall [TTS Engineering Code Review guidelines](https://engineering.18f.gov/code-review/) for
generally applicable advice about creating a positive environment for code reviews.

## Working with Pull Requests

Engineers implement ticket requirements by making code changes which are submitted for review in pull requests (PRs) on GitHub. These PRs can be reviewed by various disciplines, most commonly by engineers and designers. When a PR makes changes to the look or feel of the application it is typical to ask for review by one or more designers.

## Reviewing and Merging

These conventions apply to [Login.gov `18f/identity-*` repositories in GitHub][github-repositories]
for contributions from the Login.gov team (anybody in the
[`18f/identity-core` group][github-permissions]. See
[external contributions](#external-contributions) for more information on
changes from outside.

[github-repositories]: {% link _articles/github.md %}#repositories

- **Who merges**: once there is an approval, the author merges their own Pull
  Request.

- **Who reviews**: in general, any single approving review from another
  [`18f/identity-core`][github-permissions] member is adequate.

  - However, in some repositories with default reviewer groups
    (such as [identity-dashboard](https://github.com/18f/identity-dashboard) or
    [identity-dev-docs](https://github.com/18f/identity-dev-docs) with clear
    owners) it is preferred to wait for a revewer from thsoe groups before
    merging.

[github-permissions]: {% link _articles/github.md %}#permissions

- **Leaving general design feedback**: It’s best to leave feedback on PRs as conversations rather than comments on the overall PR. Conversations allow for a more focused discussion, reduce the amount of email notifications, and can be [marked as resolved][resolving-pr-convo] when concerns/questions have been addressed.
  
  For general design feedback please [begin a conversation][creating-pr-convo] on the first line of the first changed file, and note that you’re starting a thread there with general design feedback. You do this by opening the PR link, going to the ‘Files changed’ tab, and starting a thread on the top line of the first file.

[resolving-pr-convo]: {{site.baseurl}}/images/resolving-pull-request-conversation.gif
[creating-pr-convo]: {{site.baseurl}}/images/creating-pull-request-conversation.gif

## External Contributions

External contributions are welcome! For security reasons, our CI will not run on
branches from outside contributors. Since external contributors don't have write
access, a Login.gov team member will need to run the tests themselves and
merge the code.

## ⛔️ "Changes Requested"

GitHub lets reviewers Approve, Comment, or Request Changes when submitting a review.
The *Request Changes* option will block merges until that specific reviewer approves the
Pull Request, or until that review is dismissed.

Since *Request Changes* is essentially blocking, as a Login.gov convention, we try to
minimize usages of it to absolutely critical changes needed.
