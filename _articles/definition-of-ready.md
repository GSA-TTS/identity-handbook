---
title: Definition of Ready
description: Best practices for tracking issues in JIRA
layout: article
category: Product
---

A good Jira ticket has all of the information and context for any team member
to pick it up and understand what's going on. We have a few different types of
Jira tickets, and slightly different expectations for each.

If a product design, user research, or content design ticket will be primarily assigned to someone on the UX Team, then include “UX” in the Component field in Jira. If a ticket is also assigned to a Scrum team, then also include the team name (example: “UX” and “Ada”). If a ticket requires UX review only, do not include the “UX” component.

## Stories

Stories are told from user perspectives. Users cannot be a member of the Login.gov
team or others that may have an influence over or, bias of, our product (e.g. other TTS employees who have pre-existing knowledge of our service). Stories are written in the form *"as **X**, I want to **Y** so that **Z**."*
For example:

> As a user, I want to provide consent when an agency partner (sometimes referred to as a service provider or SP) asks how my  information is shared, so that I have full control of what information Login.gov is sharing about me.

Often stories list out **AC**s, or **Acceptance Criteria**. Acceptance Criteria are a set of predefined requirements that must be met for the story to be complete, and describe the change that we will deliver to the user in more detail. For example:

> - User is asked for consent when an SP asks for it for the first time only
  (either IAL1 or IAL2)
> - Existing users who are already associated with an SP will be asked for consent
  for the freshness value


## Bugs

Bugs should clearly explain what is happening, and what should be happening
instead.

For example:

> The "Sign in" button is currently green, but per our style guide, it should be
> blue.

Additional context is always useful, such as:

- Clear steps to reproduce
- Potential impact to users
- Browser and operating system version
- Links to more information (such as other Jira tickets, customer support inquiries, and/or links to Slack conversation)

## Tasks

Tasks are JIRA tickets that track units of work on our team that contribute to accomplishing a story. Specific examples include:
* Engineering: Backfills, code refactors, etc.
* UX (design, research, content): Writing research plans, designing a new layout, updating content guidance.

Differentiating between tasks and stories allows us to gauge whether the output of our efforts has produced measurable outcomes, both qualitative and quantitative. It provides indicators to the team to gauge whether we need to revisit our stories and tasks. Example: were there too many unknowns taking on a story, can some tasks be structured to be stories.

UX work can be split into multiple tasks if the tasks will take more than one sprint to complete. For example, a usability testing study could be split into tasks to “Prep”, “Run”, and “Analyze” the tests.

If a task requires follow-up work, then consider adding an AC to create ticket(s) for the follow-up work. For example, a task that proposes a design change or new content should include an AC to create the story ticket to implement the change.
