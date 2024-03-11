---
title: "Pull Request Process"
description: "How we do code reviews in pull requests"
layout: article
category: "Development"
subcategory: "Code"
---

## General Code Review Guidelines

See the overall [TTS Engineering Code Review guidelines](https://engineering.18f.gov/code-review/) for
generally applicable advice about creating a positive environment for code reviews.

## Reviewing and Merging

These conventions apply to [Login.gov `18f/identity-*` repositories in GitHub][github-repositories]
for contributions from the Login.gov team (anybody in the
[`18f/identity-core` group][github-permissions]. See
[external contributions](#external-contributions) for more information on
changes from outside.

[github-repositories]: {% link _articles/github.md %}#repositories

- **Who merges**: once there is at least one approving review, the author
  merges their own pull request.

  - In rare circumstances where a merge is time-sensitive and the pull request
    author is unavailable, it may be acceptable for another to merge on their
    behalf.

- **Who reviews**: in general, any single approving review from another
  [`18f/identity-core`][github-permissions] member is adequate.

  - However, in some repositories with default reviewer groups
    (such as [identity-dashboard](https://github.com/18f/identity-dashboard) or
    [identity-dev-docs](https://github.com/GSA-TTS/identity-dev-docs) with clear
    owners) it is preferred to wait for a reviewer from those groups before
    merging.

[github-permissions]: {% link _articles/github.md %}#permissions

## External Contributions

External contributions are welcome! For security reasons, our continuous
integration pipeline will not run on branches from outside contributors.
Since external contributors don't have write access, a Login.gov team
member will need to run the tests themselves and merge the code.

## ⛔️ "Changes Requested"

GitHub lets reviewers Approve, Comment, or Request Changes when submitting a review.
The *Request Changes* option will block merges until that specific reviewer approves the
Pull Request, or until that review is dismissed.

Since *Request Changes* is essentially blocking, as a Login.gov convention, we try to
minimize usages of it to absolutely critical changes needed.

## Using GitHub Functionality Without Submitting a Pull Request

The handbook's GitHub article includes information about other GitHub features, such as:

- [Running continuous integration outside of a pull request]({% link _articles/github.md %}#running-ci-outside-of-a-pull-request) or [sharing work with other engineers]({% link _articles/github.md %}#sharing-work-with-other-engineers)
