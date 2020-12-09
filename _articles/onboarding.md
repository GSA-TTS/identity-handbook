---
title: Onboarding
layout: article
category: Team
---

## TTS Onboarding

TTS Talent has [their own onboarding checklist in Google Drive](https://docs.google.com/spreadsheets/d/1w0WSTUT0l7q19mAI6c2QCIpCFs0Cei4eukaiiRBTbRA/edit#gid=1775743049) that they share with new employees. The login.gov tab on that document has one item, a link to this page in our handbook.

## For new login.gov team members to complete themselves

- Familiarize yourself with the [login.gov Handbook]({{site.baseurl}})
- Watch a [login.gov authentication overview](https://drive.google.com/file/d/1UFq0OAHgbLdPUXXj6FAIgSxtLyAfYxSa/view)
- Watch a [login.gov identity verification overview](https://drive.google.com/file/d/1GanUUpkAcJCopQAPac4DSe10LREdSGZw/view)
- Review the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
- Review the [login.gov Design System](https://design.login.gov/)
- Complete [GSA OLU](https://insite.gsa.gov/topics/training-and-development/online-university-olu?term=olu) IT Security Awareness Training, including accepting the GSA IT Rules of Behavior, which is required before we can give you access to any login.gov systems. If you joined GSA more than two months ago, you’ve already completed this task. (Detailees must complete similar organization driven training and provide as proof to login.gov team members)
- Schedule virtual tea/coffee meetings with your team lead, other members of your team, and anyone else!  Tea is just a short (~20 min) one-on-one video meeting with the purpose of getting to know each other.
- Once you've been added to Slack:
  - Make sure your account is set up [like this](https://handbook.tts.gsa.gov/slack/).
  - Make sure to join `#login`, the main announcement channel for our team
  - Contractors with full Slack access should add the word "contractor" to their Slack profile for the benefit of the wider TTS audience.
- Make sure your GitHub account is set up [like this](https://handbook.tts.gsa.gov/github/#setup).
- Add the following email address to your Google Calendar to see the Login.gov Shared Calendar: `gsa.gov_6ovul6pcsmgd40o8pqn7qmge5g@group.calendar.google.com`
- Add yourself to the [`team.yml`](https://github.com/18F/identity-private/blob/master/team/team.yml) file
- Request access to relevant Google Groups, [the handbook has a list of active groups](https://login-handbook.app.cloud.gov/articles/email.html#internal-team-lists)
- Add a signature to your GSA email account like this:
  > **Human Person**<br>
  > Login.gov Chief of Kittens<br>
  > Technology Transformation Services<br>
  > U.S. General Services Administration
- (Optional) [Add your gpg key to github](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)

## For the on-boarding buddy to complete

As an on-boarding buddy you'll be a new employee's main point of contact and login.gov guide for a couple weeks.
Look at this work as a power multiplier, you are helping someone gain a firm foundation to work upon, you are starting up a new engine.

- Add a new JIRA Issue to the [People-Ops board](https://cm-jira.usa.gov/secure/RapidBoard.jspa?projectKey=LPO&rapidView=2861) to track completion of onboarding tasks.
  - `Create Bulk Sub Tasks` on the new issue and use the `Login.gov Onboarding Buddy Tasks` template.
- Request that the new user to be invited to [the 18F org on GitHub](https://github.com/orgs/18F) in #admins-github on Slack. Cc `@github-admins-slack` on your request.
  - *For members needing **push commit** access*: Also add to the [identity-core](https://github.com/orgs/18F/teams/identity-core/members) team (contact [team maintainers](https://github.com/orgs/18F/teams/identity-core/members?utf8=%E2%9C%93&query=%20role%3Amaintainer) for this)
  - *For members NOT needing **push** access*: Also add to the [identity-team-yml](https://github.com/orgs/18F/teams/identity-team-yml/members) team, which grants read-only access. (contact [team maintainers](https://github.com/orgs/18F/teams/identity-team-yml/members?utf8=%E2%9C%93&query=+role%3Amaintainer) for this)
- [Create a new issue in the `identity-devops` Github repository using the onboarding template](https://github.com/18F/identity-devops/issues/new?labels=administration&template=onboarding-devops.md&title=Onboarding+for+%5Binsert+new+team+member%27s+name%5D) and ping `@login-devops-oncall` in Slack to alert them to the new onboarding issue.
- Schedule a daily pairing session in GCal for an hour or two. Use the time to walk through project details, cooperate on environment setup, work on a ticket, etc. Taper off in a way that makes sense to you and your buddy.
- Give intro to weekly ceremonies and team workflow
- Request Slack access [with this form](https://goo.gl/forms/4Mz21nvALvITj9Os1)
  - Federal employees are added as full Slack members by default.
  - Contractors who are working on TTS projects most or full-time can be added as full Slack members.
  - Other collaborators should be added as multi-channel guests.
  - Full Slack access for Contractors is at the discretion of login.gov's Contracting Officer. Please see [TTS Handbook guidance](https://handbook.tts.gsa.gov/slack-admin/) for more info.
- Add to appropriate [login.gov Slack groups]({% link _articles/slack.md %}) like `login-feds` or `login-appdev-team`.
- Add them to the [Login.gov Shared Calendar](https://calendar.google.com/calendar/embed?src=gsa.gov_6ovul6pcsmgd40o8pqn7qmge5g%40group.calendar.google.com)
  - Non-GSA.gov email address: `See all event details` permission
  - With GSA.gov email address: `Make changes AND manage sharing`
- [Using the JIRA Portal](https://cm-jira.usa.gov/servicedesk/customer/portal/11), choose `Application Access` and request a new JIRA account. Under `Access Details` ask that they be added to the login.gov project.
- Approve their PR to update [`team.yml`](https://github.com/18F/identity-private/blob/master/team/team.yml) with their info
- Verify their membership in all appropriate Google Groups. This will grant them permission to see the login.gov Team Drive and other Google Docs
- Update the [login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
- Verify they have been added to all team events like
  - Sprint ceremonies
  - All-hands / Demo-day
  - Retros / IRLs
- [Add user to Figma](https://www.figma.com/files/team/893580939040886405/Login.gov/members) if appropriate (e.g. on UX team or implementing interfaces)
- Help your buddy double check that they have a Performance Plan in HRLinks

## For UX team members

- Familiarize yourself with the [Login.gov Design System](https://design.login.gov/)
- Familiarize yourself with the [Login.gov UX Drive Folders](https://drive.google.com/drive/folders/12qRTGijG9oOU8FRvZfK30qAN4v8LCzHG)

## For Partnerhsips team members

- Check out the [Partnerships Area of the handbook]({{site.baseurl}}/#partnerships)
- Be sure to join the main Slack channels for our team, `#login` and `#login-partnerships`.
- Add the following email address to your Google Calendar to see the Login.gov Partnerships Team Calendar: `gsa.gov_6ovul6pcsmgd40o8pqn7qmge5g@group.calendar.google.com`
- Add the user to [Hubspot](https://app.hubspot.com/settings/5531666/users)


## For AppDev Engineers

### In the first 30 days

- Use login.gov
  - Set up a login.gov account
  - Try to verify your identity on [login.gov/verify](https://secure.login.gov/verify)
- Setup the apps
  - [Set up your local IdP development environment](https://github.com/18F/identity-idp#readme)
  - Get the IdP test suite to pass locally
  - Get the [OIDC](https://github.com/18F/identity-oidc-sinatra#readme) and [SAML](https://github.com/18F/identity-saml-sinatra#readme) apps working locally
  - Get the [Partner Dashboard](https://github.com/18f/identity-dashboard#readme) app running locally
- Be a part of your scrum team's ceremonies by attending these meetings
  - Your scrum team's standup
  - Your scrum team's sprint planning
  - Your scrum team's retro
  - All-team backlog refinement
  - Design Huddle
  - PR Review Session
  - UAT meeting
  - Demo Day / All Hands
- Read some docs
  - [Our definition(s) of done]({% link _articles/definition-of-done.md %})
  - [Login.gov Design Guide](https://design.login.gov/)
- Write some code
  - Assign yourself a Jira ticket
  - Open a pull request against the IdP
  - Squash and merge a pull request into master on the IdP
- Get access to these lower environments
  - `dev`
  - `int`
- Review the product roadmap in Jira

### In the first 60 days

- Say hello, and get to know the team
  - Schedule a virtual coffee with our Director, Amos S
  - Schedule a virtual coffee with our Deputy Director, Caitlin H.
- Add things to Jira
  - Write a user story and add a ticket for it in Jira
  - Write a bug report and add a ticket for it in Jira
- Review someone else's pull request
- Set up pairing time with a teammate to cover these things
  - How we work with proofing vendors
  - Our encryption model for user PII
- See how other teams operate
  - Listen in on another team's standup
  - Listen in on another team's sprint planning
  - Listen in on another team's backlog refinement
- Figure out where to look for issues
  - Get access to New Relic and track down a bug
  - Follow an account creation in Cloudwatch
  - Follow a sign-in in Cloudwatch
- Add an item to a retro document
- Write some more code
  - Update the knapsack report for the IdP
  - Update the IdP's rubygem and npm dependencies
- Learn to release the app
  - Read the [release management guide]({% link _articles/appdev-deploy.md %})
  - Shadow someone who is deploying the app
- Get access to the login.gov static site setting in Federalist
- Review some more documentation
  - Review <developers.login.gov>
  - Review [NIST 800-63](https://pages.nist.gov/800-63-3/)

### In the first 90 days

- Sign in to login.gov with a screen reader
- Write some more code
  - Make a change to the login.gov static site
  - Make a change to the login.gov partner dashboard
  - Make a change to the login.gov sample app
- Get access to upper environments
  - Get SSH access to staging
  - Get SSH access to prod
- Get the [identity-pki](https://github.com/18F/identity-pki) repo running locally
- Release the app
  - Deploy the app to staging
  - Deploy the app to production
- Join the on-call rotation
- Use S3 logs to review a user's activity in the past year
- Write a simple service provider app from scratch using a language other than ruby

## For  Privileged Users (DevOps, SecOps, AppDev)

- [Set up your personal sandbox environment in AWS](https://login-handbook.app.cloud.gov/articles/infrastructure-personal-sandbox-env.html)
- Add a new user in the [cloud.gov `gsa-login-prototyping` org](https://dashboard.fr.cloud.gov/cloud-foundry/2oBn9LBurIXUNpfmtZCQTCHnxUM/organizations/fc240d49-f678-4325-8384-c88d92d60982/users)

## For non-GSA employees

### Physical access to GSA HQ at 1800 F

Any government employee or contractor can present a PIV card to the guards to gain access to the building.

To get card-reader access to the building, visit OMA Security and have them configure your PIV card to open the turnstiles. OMA Office Hours are Monday - Thursday 7:00 am - 3:30 pm, room B338.
