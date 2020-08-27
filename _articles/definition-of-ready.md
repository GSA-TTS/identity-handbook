---
title: Definition of Ready
description: Best practices for tracking issues in JIRA
layout: article
category: Product
---

A good JIRA ticket has all of the information and context for any team member
to pick it up and understand what's going on. We have a few different types of
JIRA tickets, and slightly different expectations for each.

## Stories

Stories are told from user perspectives (where users can't be the login.gov
team). They're written in the form *"as **X**, I want to **Y** so that **Z**."*
For example:

> As a user, I want to provide consent when an SP asks for how current my verified
> information is, so that I have full control of what login.gov is sharing about me.

Often stories list out **AC**s, or **Acceptance Criteria**, for example

- User is asked for consent when an SP asks for it for the first time only
  (either IAL1 or IAL2)
- Existing users who are already associated with an SP will be asked for consent
  for the freshness value


## Bugs

Bugs should clearly explain what is happening, and what should be happening
instead.

For example:

> The "Sign in" button is currently green, but per our style guide, it should be
> blue.

Additional context is always useful, such as:

- Clear steps to reproduce
- Browser and operating system version
- Links to more information (such as Salesforce ticket or Slack conversation links)

## Tasks

Tasks are JIRA tickets that track important work on our team. Specific examples include:
> * Enginering: Backfills, code refactors, etc.
> * UX: Writing research plans, designing a new layout, etc.

Differentiating between tasks and stories allows us to gauge whether the output of our efforts (all the work we do) has induced outcomes (tangible user impact). It provides indicators to the team to gauge whether we need to revisit our stories and tasks Examples: were there too many unknowns taking on a story, can some tasks be structured to be stories etc. 
