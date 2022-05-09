---
title: Definition of Done
layout: article
redirect_from:
- /articles/definition_of_done.html
- /articles/definition_of_done
category: Product
description: Checklist for work to be done, and accepted via an Acceptance Thread
---

All stories must comply with the current Definition of Done in order to be considered Complete and Accepted. Some items might not apply to all stories, and conscious exceptions are OK.

Expect this DoD to change over time.

## Engineering

- 0 errors 0 warnings in CodeClimate
- Tests have been written. New or modified features have feature coverage. Code coverage of the entire test suite is not reduced
- Ensure that our accessibility posture has been maintained or improved, preferably via automated `aXe` tests
- All code and tests have been merged to main in GitHub repo
- The `application.yml` configurations have been updated as needed in deployed environments
- Database indexes exist for any new queries
- The dashboard and sample SPs have been updated if necessary
- If multiple database migrations are necessary, the database migrations have been performed
- If removing a previously populated billing or accounting related item from the database (changing `sp_costs`):
  - Drop a line in #login-ops noting the proposed change and ensure the data is not needed for billing/reporting
  - Add a note on the discussion to the PR
  - Add a member of #login-ops as an approver and get thier sign-off before proceeding
- The story is deployed to Dev and/or INT environments
- Appropriate refactoring has been done as part of developing the story
  - Dead code has been pruned
  - The Login.gov design system is used in views
- New code must be free of medium and highlevel static and dynamic security vulnerabilities as reported by Snyk
- If the story will not be ready to be released to users or there is a serious possibility of failure then the changes are behind a feature flag
- Analytics logging has been updated and new events have been added if needed

## Design

- Interface and user journey changes are approved by the UX Team in order to release the story to production, or the story is controlled by a Feature Flag. Changes are approved by relevant SMEs to ensure consistency and quality of our product.
- If a usability test is needed, a Jira task to develop a usability testing plan has been created.
- Conforms to Section 508 standards by both manual and automated scanning methods.
- The new design uses components from the Login Design System (design.login.gov, Figma).
- Notify the Design System UX SME and Design System Manager when a new design component is not yet in the design system, so it can be considered.
- Visual graphics and mockups are saved in the relevant Figma shared folder (example: Identity, Authentication). Research artifacts, content, translations, and sensitive artifacts are saved in [the shared Login.gov User Experience Google Drive folder](https://drive.google.com/drive/folders/12qRTGijG9oOU8FRvZfK30qAN4v8LCzHG).
- For UX Tasks: implementation and/or testing tickets should be created in Jira for the next step to complete the work or hand off to the next phase.

## Content

- Content changes are written, reviewed and approved by the relevant UX and Product team members.
- French (Canada) and Spanish (Mexico) translations are included. See [Login.gov Translation Process](https://docs.google.com/document/d/1-wNXxyvxrsUeHkMOfhBpoSTCTZULOXNlCkBdNxiLa3c/edit?usp=sharing).

## Documentation

- If there is a potential security impact someone has told `@Mo` about it
- If we are affecting storage or transmission of PII somebody has told the privacy officer `@richard.speidel`
- The release management guide has been updated for changes to the deploy process
- The [Entity Relationship Diagrams](https://github.com/18F/identity-idp/blob/main/docs/ARCHITECTURE.md#entity-relationship-diagram) have been updated if the db schema has changed.
- The help content on the static site has been updated and new FAQ content has been created if necessary
- User journey/interface are connected to user personas and listed in the login handbook.

## Comms

- A description of the change has been written for the release notes to be communicated to partners
- A description of the change has been communicated to the contact center
- In extreme cases, a description of the change has been written and communicated directly to users

## Acceptance

- PO accepts that user story and acceptance criteria have been fulfilled
- Design accepts feature for release to users if applicable
- Team asserts that all other applicable aspects of the DoD have been met

### Acceptance Threads

Only Product Owners and Scrum Masters have permission to mark JIRAs as completed. To help them review tickets, we create
Acceptance Threads in Slack.

[![screenshot of example thread with labelled key points][image]][image]
(to update this diagram, edit the [acceptance thread][figma] file in Figma and re-export it)

[image]: {{site.baseurl}}/images/acceptance-thread.jpg
[figma]: https://www.figma.com/file/osdrHegSpj9sRk9CCuAIQd/Untitled?node-id=0%3A1


Key items as part of an acceptance thread:

- In the main post:
  - The `:thread:` emoji and "Acceptance thread" indicate that this is an acceptance thread
  - Link to the JIRA ticket
  - Provide a brief description for context since JIRA numbers are not memorable
- In the thread:
  - Includes steps so that anyone can replicate and review.
  - Specify which environment changes were deployed to, and provide a link to that environmment
  - Provide screenshots if possible
  - Sometimes, for tickets that don't have UI changes, includes a description of what changed and links
     to a Pull Request
  - Tag the relevant people for review, usually the Product Manager, Scrum Master, and
    anybody tagged as a reviewer in the ticket. Include the ticket in the message to help provide
    context in the notification.
