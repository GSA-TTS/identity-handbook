---
title: Onboarding
layout: article
category: Team
---

## TTS Onboarding

TTS Talent has [their own onboarding checklist in Google Drive](https://docs.google.com/spreadsheets/d/1w0WSTUT0l7q19mAI6c2QCIpCFs0Cei4eukaiiRBTbRA/edit#gid=1775743049) that they share with new employees. The Login.gov tab on that document has one item, a link to this page in our handbook.

## Login.gov team onboarding documents

Each Login.gov team has their own personalized [GDoc/Onboarding Template / Checklist](https://drive.google.com/drive/folders/1Zq00M0H4QzXTLvFK3IMN-vhMcsKkx0f3?usp=sharing), you'll get one of these documents when you start at Login.gov.

The following onboarding tasks are applicable to all employees.

## For new Login.gov team members to complete themselves

- Familiarize yourself with the [Login.gov Handbook]({{site.baseurl}})
- Watch a [Login.gov authentication overview](https://drive.google.com/file/d/1UFq0OAHgbLdPUXXj6FAIgSxtLyAfYxSa/view)
- Watch a [Login.gov identity verification overview](https://drive.google.com/file/d/1GanUUpkAcJCopQAPac4DSe10LREdSGZw/view)
- Watch a [Login.gov security overview](https://drive.google.com/file/d/1ZR4uin3dJZmq7nOvgROcv95_mcRPmx0n/view?usp=sharing)
- Review the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
- Review the [Login.gov Design System](https://design.login.gov/)
- Complete [GSA OLU](https://insite.gsa.gov/topics/training-and-development/online-university-olu?term=olu) IT Security Awareness Training, including accepting the GSA IT Rules of Behavior, which is required before we can give you access to any Login.gov systems. If you joined GSA more than two months ago, you’ve already completed this task. (Detailees must complete similar organization driven training and provide as proof to Login.gov team members)
- Schedule virtual tea/coffee meetings with your team lead, other members of your team, and anyone else!  Tea is just a short (~20 min) one-on-one video meeting with the purpose of getting to know each other.
- Once you've been added to Slack:
  - Make sure your account is set up [like this](https://handbook.tts.gsa.gov/slack/).
  - Make sure to join `#login`, the main announcement channel for our team
- Make sure your GitHub account is set up [like this](https://handbook.tts.gsa.gov/github/#setup).
- Request access to relevant Google Groups, [the handbook has a list of active groups](https://login-handbook.app.cloud.gov/articles/email.html#internal-team-lists)
  - Federal employees should be added to `login-team-feds@`
  - Contractors should be added to `login-team-contractors@`
- Add the Login.gov Shared Calendar to your Google Calendar:
    - Make sure you've been added to the [Login Team Feds google group](https://groups.google.com/a/login.gov/g/login-team) or the [Login Team Contractors google group](https://groups.google.com/a/gsa.gov/g/login-team-contractors)
    - Go to https://calendar.google.com/calendar/render?cid=gsa.gov_6ovul6pcsmgd40o8pqn7qmge5g@group.calendar.google.com
    - Click "Add" when prompted to add the calendar
    - You should see "Login.gov shared calendar" under "My Calendars"
- Add yourself to the [`team.yml`](https://github.com/18F/identity-private/blob/main/team/team.yml) file
- Add a signature to your GSA email account like this:
  > **Human Person**<br>
  > Login.gov Chief of Kittens<br>
  > Technology Transformation Services<br>
  > U.S. General Services Administration
- [Request Admin rights on your TTS Macbook](https://handbook.tts.gsa.gov/equipment/#admin-rights) if you require it, e.g. if you are a developer.
- (Optional) [Add your gpg key to github](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)

## For the on-boarding buddy to complete

As an on-boarding buddy you'll be a new employee's main point of contact and Login.gov guide for a couple weeks.
Look at this work as a power multiplier, you are helping someone gain a firm foundation to work upon, you are starting up a new engine.

- Add a new JIRA Issue to the [People-Ops board](https://cm-jira.usa.gov/secure/RapidBoard.jspa?projectKey=LPO&rapidView=2861) to track completion of onboarding tasks.
  - `Create Bulk Sub Tasks` on the new issue and use the `Login.gov Onboarding Buddy Tasks` template.
- Request that the new user to be invited to [the 18F org on GitHub](https://github.com/orgs/18F) in #admins-github on Slack. Cc `@github-admins-slack` on your request.
  - *For members needing **push commit** access*: Also add to the [identity-core](https://github.com/orgs/18F/teams/identity-core/members) team (contact [team maintainers](https://github.com/orgs/18F/teams/identity-core/members?utf8=%E2%9C%93&query=%20role%3Amaintainer) for this)
  - *For members NOT needing **push** access*: Also add to the [identity-team-yml](https://github.com/orgs/18F/teams/identity-team-yml/members) team, which grants read-only access. (contact [team maintainers](https://github.com/orgs/18F/teams/identity-team-yml/members?utf8=%E2%9C%93&query=+role%3Amaintainer) for this)
- [Create a new issue in the `identity-devops` Github repository using the onboarding template](https://github.com/18F/identity-devops/issues/new?labels=administration&template=onboarding-devops.md&title=Onboarding+for+%5Binsert+new+team+member%27s+name%5D) and ping `@login-devops-oncall` in Slack to alert them to the new onboarding issue.
- Schedule a daily pairing session in GCal for an hour or two. Use the time to walk through project details, cooperate on environment setup, work on a ticket, etc. Taper off in a way that makes sense to you and your buddy.
- Give intro to weekly ceremonies and team workflow
- [Request Slack access with ServiceNow](https://gsa.servicenowservices.com/sp?id=sc_category&sys_id=f9874e76db5003400dc9ff621f96190d&catalog_id=e0d08b13c3330100c8b837659bba8fb4)
  - Federal employees are added as full Slack members by default.
  - Contractors who are working on TTS projects most or full-time can be added as full Slack members.
  - Other collaborators should be added as multi-channel guests.
  - Full Slack access for Contractors is at the discretion of Login.gov's Contracting Officer. Please see [TTS Handbook guidance](https://handbook.tts.gsa.gov/slack-admin/) for more info.
- Add to appropriate [Login.gov Slack groups]({% link _articles/slack.md %}) like `login-feds` or `login-appdev-team`.
- [Using the JIRA Portal](https://cm-jira.usa.gov/servicedesk/customer/portal/11), choose `Application Access` and request a new JIRA account. Under `Access Details` ask that they be added to the Login.gov project.
- Approve their PR to update [`team.yml`](https://github.com/18F/identity-private/blob/main/team/team.yml) with their info
- Verify their membership in all appropriate Google Groups. This will grant them permission to see the Login.gov Team Drive and other Google Docs
  - Add everyone to `login-all@`
  - Add feds to `login-team@`, and contractors to `login-team-contractors@`
- Update the [Login.gov org chart](https://docs.google.com/spreadsheets/d/1tiTR2ohdl0NIsrF4gJjNipEZ0z0oq1pOFWYjHg8Tbi0/edit#gid=0)
- Verify they have been added to all team events like
  - Sprint ceremonies
  - All-hands / Demo-day
  - Retros / IRLs
- [Add user to Figma](https://www.figma.com/files/team/893580939040886405/Login.gov/members) if appropriate (e.g. on UX team or implementing interfaces)
- For Federal employees only: Help your buddy double check that they have a Performance Plan in HRLinks
- Ensure that your buddy has working VPN access. For contractors the request originates with our CO.
- Ensure that your buddy's lead has 30, 60, and 90 day check-ins scheduled with the new employee. Any concerns during these reviews should be raised to the Contracting Officers Representative or the employee's supervisor.

## For non-GSA employees

### Physical access to GSA HQ at 1800 F

Any government employee or contractor can present a PIV card to the guards to gain access to the building.

To get card-reader access to the building, visit OMA Security and have them configure your PIV card to open the turnstiles. OMA Office Hours are Monday - Thursday 7:00 am - 3:30 pm, room B338.
