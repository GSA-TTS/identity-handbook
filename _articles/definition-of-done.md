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
  - Modified slim files are converted to HTML-ERB
  - Dead code has been pruned
  - The login.gov design system is used in views
- New code must be free of medium and highlevel static and dynamic security vulnerabilities as reported by Snyk
- If the story will not be ready to be released to users or there is a serious possibility of failure then the changes are behind a feature flag
- Analytics logging has been updated and new events have been added if needed

### Design

- Interface / user journey changes are approved by design folks in order to release the story to production, or the story is controlled by a Feature Flag
- If a usability test is necessary, a usability test plan has been developed or there is a Jira issue for it
- Conforms to Section 508 standards by both manual and automated scanning methods
- The new design uses components from the design system
- Notify the design team when a new design component is not yet in the design system, so it can be added and the team can be notified. 
- New components that aren’t a part of the design system are added if they’re used frequently
- Graphics and mockups are saved in [design repository](https://github.com/18f/identity-design-assets). If private mockup/design, save in login drive / design folder
- User journey/interface are connected to user personas and listed in the login handbook. 

### Content

- Content changes are written, reviewed and approved.
- Content changes are complete for the contact center email templates and knowledge articles.

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
