---
title: Definition of Done
layout: article
redirect_from:
- /articles/definition_of_done.html
- /articles/definition_of_done
category: Product
---

All stories must comply with the current Definition of Done in order to be considered Complete and Accepted. Some items might not apply to all stories, and conscious exceptions are OK.

Expect this DoD to change over time.

### Engineering

- 0 errors 0 warnings in CodeClimate
- Tests have been written. New or modified features have feature coverage. Code coverage of the entire test suite is not reduced
- Ensure that our accessibility posture has been maintained or improved, preferably via automated `aXe` tests
- All code and tests have been merged to main in GitHub repo
- The `application.yml` configurations have been updated as needed in deployed environments
- Database indexes exist for any new queries
- The dashboard and sample SPs have been updated if necessary
- If multiple database migrations are necessary, the database migrations have been performed
- The story is deployed to Dev and/or INT environments
- Appropriate refactoring has been done as part of developing the story
  - Dead code has been pruned
  - The Login.gov design system is used in views
- New code must be free of medium and highlevel static and dynamic security vulnerabilities as reported by Snyk
- If the story will not be ready to be released to users or there is a serious possibility of failure then the changes are behind a feature flag
- Analytics logging has been updated and new events have been added if needed

### Design

- Interface and user journey changes are approved by the UX Team in order to release the story to production, or the story is controlled by a Feature Flag. Changes are approved by relevant SMEs to ensure consistency and quality of our product.
- If a usability test is needed, a Jira task to develop a usability testing plan has been created.
- Conforms to Section 508 standards by both manual and automated scanning methods.
- The new design uses components from the Login Design System (design.login.gov, Figma).
- Notify the Design System UX SME and Design System Manager when a new design component is not yet in the design system, so it can be considered. 
- Visual graphics and mockups are saved in the relevant Figma shared folder (example: Identity, Authentication). Research artifacts, content, translations, and sensitive artifacts are saved in [the shared Login.gov User Experience Google Drive folder](https://drive.google.com/drive/folders/12qRTGijG9oOU8FRvZfK30qAN4v8LCzHG).
- For UX Tasks: implementation and/or testing tickets should be created in Jira for the next step to complete the work or hand off to the next phase. 

### Content

- Content changes are written, reviewed and approved by the relevant UX and Product team members.
- French (Canada) and Spanish (Mexico) translations are included. See [Login.gov Translation Process](https://docs.google.com/document/d/1-wNXxyvxrsUeHkMOfhBpoSTCTZULOXNlCkBdNxiLa3c/edit?usp=sharing).

### Documentation

- If there is a potential security impact someone has told `@Mo` about it
- If we are affecting storage or transmission of PII somebody has told the privacy officer `@richard.speidel`
- The release management guide has been updated for changes to the deploy process
- The [Entity Relationship Diagrams](https://github.com/18F/identity-idp/blob/main/docs/ARCHITECTURE.md#entity-relationship-diagram) have been updated if the db schema has changed.
- The help content on the static site has been updated and new FAQ content has been created if necessary
- User journey/interface are connected to user personas and listed in the login handbook. 

### Comms

- A description of the change has been written for the release notes to be communicated to partners
- A description of the change has been communicated to the contact center
- In extreme cases, a description of the change has been written and communicated directly to users

### Acceptance

- PO accepts that user story and acceptance criteria have been fulfilled
- Design accepts feature for release to users if applicable
- Team asserts that all other applicable aspects of the DoD have been met
