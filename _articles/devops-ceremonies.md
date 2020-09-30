---
title: "Team Radia Sprint Ceremonies"
description: "How Sprints and Standups operate"
layout: article
category: "DevOps"
---

We currently use the **Login.gov Infrastructure** board <https://github.com/orgs/18F/projects/5> to track our current sprint, as well as the issues in our backlog.

## Our Sprint Principles

**We work in _sprints_, because doing so:**
- Helps us focus on burning down the backlog
- Allows us to understanding the velocity we’re moving at

**We agree that:**
- _We do not work on issues outside the sprint or add new issues to the current sprint_, unless you are Primary or Secondary On-Call
- _We strive to only work on one issue at a time_, so the **In Progress** column always describes what we are working on and standups are more efficient


## Schedule
These events are shared within the [login.gov shared calendar](https://calendar.google.com/calendar?cid=Z3NhLmdvdl82b3Z1bDZwY3NtZ2Q0MG84cHFuN3FtZ2U1Z0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t.)

|                                           | 1.Mon | 1.Tue | 1.Wed | 1.Thu | 1.Fri | 2.Mon | 2.Tue | 2.Wed | 2.Thu | 2.Fri |
|-------------------------------------------|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| [Weekly Omnibus](#weekly-omnibus)         |   X   |       |       |       |       |   X   |       |       |       |       |
| [Video Standup](#video-standup)           |       |       |   X   |       |       |       |       |   X   |       |       |
| [Sprint Planning](#sprint-planning)       |   X   |       |       |       |       |       |       |       |       |       |
| [Backlog Refinement](#backlog-refinement) |       |       |       |       |       |   X   |       |       |       |       |
| [Strategy](#strategy)                     |       |       |       |   X   |       |       |       |       |       |       |
| [AC Club](#ac-club)                       |       |       |       |   X   |       |       |       |       |       |       |
| [Wargames](#wargames)                     |       |       |       |       |       |       |       |       |   X   |       |


## Standups
In whichever format they take place, standups should answer the following, on a per-person basis:

  - **Y:** What I did yesterday
  - **T:** What I'm doing today
  - **B:** Any blockers I have

As much as possible, the work that each team member reports should match up with the issues they currently have on the project board.

Additional discussion, whether in general or regarding specific issues, should only occur when each team member has addressed each of these items.

### Video Standup

Standup begins once every team member has joined the call, or 5 minutes after start time, whichever occurs first. Each person on the call reports their **yesterday** / **today** / **blockers** described above. Those who are unable to make the call should report their standup information in Slack as close to the standup meeting time as possible.

During a video standup, please observe these courtesies:

- Constrain standup time to ~15-20m total, or 1-3m per person.
- At the start of a standup, there typically should be only one In Progress issue per person.
- Avoid specifics/lower-level details where they are not needed
  - A question or two is reasonable but if we go past that, say "let's Parking Lot this", and continue discussion when the standup is over.
- The standup meeting will **_not_** be a deep review like either of the Monday sprint meetings.
  - The exception is when reviewing blocked items in order to help unblock team work; however, please Parking Lot deep dives into these items until the end of the standup

Once all team members have finished reporting their standup items, a verbal confirmation that "standup is now finished" should be declared, allowing team members to drop off the call if they have other projects to work on, or stay on if they'd like to be involved in Parking Lot/miscellaneous discussions

## Per-Sprint Meetings
These occur once per sprint (except for the Omnibus, which is the first meeting of each week).

### Weekly Omnibus

Used for the weekly handoff between the current and previous On-Call team members. Information is added to the above doc by specific team members and a designated scribe for the meeting:
- Previous On-Call(s): fill out "What ops stuff happened last week?" section of doc
- Current On-Call(s): fill out "What ops stuff is happening this week?" section of doc

Start the meeting with those sections of the doc, following the [On-Call review and handoff procedures]({{site.baseurl}}/articles/devops-oncall-guide.html#procedure) when doing so. Follow the On-Call review with either [Sprint Planning](#sprint-planning) or [Backlog Refinement](#backlog-refinement) depending upon the week.

### Sprint Retro
(Part of [Weekly Omnibus](#weekly-omnibus); done at the start of a new sprint)

Endeavor to understand what worked well in our previous sprint, what didn't go so well, and how we can improve for the next sprint. Use the Google Doc to track the discussion, and

1. Vote on items to be addressed and document discussion as much as possible
2. Create issues/action items when possible

### Sprint Planning
(Part of [Weekly Omnibus](#weekly-omnibus); done at the start of a new sprint)

1. Team members take a few minutes to update their cards on the project board, depending upon what work was completed in the previous sprint, and what work they plan to do during the current sprint.
2. Issues should be pulled from the **_top_** of the Backlog if a team member has no issues within the To Do / In Progress columns.
3. Focus should be on issues brought up during the On-Call review (i.e. "what is happening this week") and the product priorities defined by the Product Owner.

### Backlog Refinement
(Part of [Weekly Omnibus](#weekly-omnibus); done midway through the current sprint)

1. Arrange issues in the backlog by priority
2. Add detail to upcoming stories that need it
3. Split large issues into smaller issues

To preserve velocity, issues within the backlog should ONLY be added to the current sprint if they can be completed before the end of the sprint.

### Strategy

Open-ish session for frequently-mentioned topics which are better discussed in a video/standup/meeting format, rather than in Slack/text. Use the Google Doc to drive the meeting; one team member should act as a scribe and, as much as possible, record all ideas/concepts brought forth for discussion.

1. Add topics to the top section of the doc before/at the start of the meeting.
2. Once meeting begins, vote on topics to be discussed by adding a `+` mark at the beginning of the line for each topic you're interested in discussing. _Please limit yourself to 1 vote per topic._
3. After voting is complete, discuss whichever item(s) have the highest number of votes, in order of 1) number of votes, then 2) order in the list. All of these items should be moved into the current-date section of the doc and removed from the top list.
4. During/after the discussion, create action items (i.e. GitHub issues) required for anything we want to move forward on.
5. Any topics that were moved from the top list, but were NOT discussed in the meeting, should be moved back to the top of the doc. All votes should be removed from the top-section topic list.

During the discussion, each team member is empowered to:

- Encourage buy-in / consensus from other team members
- Recognize when a discussion begins to trail off into bike-shedding, and suggest pulling back to the main topic

## Miscellaneous

### AC Club

Dedicated time used to address any open PRs or un-accepted ACs requiring love and approval.

- Prior to `AC Club` time On-Call should:
  - Check the following repos for straggling PRs:
    - [`identity-devops`](https://github.com/18F/identity-devops)
    - [`identity-devops-private`](https://github.com/18F/identity-devops-private)
    - [`identity-terraform`](https://github.com/18F/identity-terraform)
    - [`identity-cookbooks`](https://github.com/18F/identity-cookbooks)
    - [`identity-base-image`](https://github.com/18F/identity-base-image)
  - Check the [Login.gov Infrastructure Board](https://github.com/orgs/18F/projects/5) for items in the `Pending Acceptance` column
- SlackBot will in #login-devops if anyone has an AC or PR to discuss, as a reminder.
- On-Call will meet with anyone with outstanding ACs or PRs in AC Club Hangout (see meeting invite)

### Toil
_**Toil**_ is used to describe work that does not materially affect production, or the way the team operates, but is (often) essential work that leads to additional tech debt if it is not addressed. It is thusly named as **the `work:value` ratio** is further skewed towards the work side than the value side.

1. The Primary On-Call is the only team member that handles Toil during a given week, and should hand off any relevant issues to the next On-Call during the Weekly Omnibus.
2. When necessary, Toil should be discussed in Video Standups after the standup reporting is completed.
3. If an issue has been gaining scope creep, it should be scoped into the following sprint and/or broken into smaller issues.

### Wargames

"A strange game. The only winning move is not to play." - WOPR

Login.gov engineers engage in bi-weekly contingency planning exercises in the form of
role playing war games to improve operational readiness and share knowledge.

This is part of our overall set of contingency planning (CP)
practices.  (See [IT Security Procedural Guide: Contingency Planning (CP) CIO-IT Security-06-29](https://www.gsa.gov/cdnstatic/Contingency_Planning_(CP)_%5BCIO_IT_Security_06-29_Rev_4%5D_04-12-2018.pdf)
for CP requirements and [NIST Contingency Planning Control Family](https://nvd.nist.gov/800-53/Rev4/family/CONTINGENCY%20PLANNING) for the set or related controls.)

__Roles__:
* Dungeon Master (DM) - On-Call Engineers (primary from 1st week of sprint and primary from 2nd week)
* Player Character (PC) - Everyone else.  Collectively "the party".

__Prep__: Each DM must prepare prior to the wargame:
* Devise a small scenario - Remember that time is limited!  (Previous post-mortem notes are full of potential ideas.)
* Apply to your personal sandbox
* Test the scenario
* Test the fix
* Note the break and fix (WITHOUT SECRETS) in a GitHub Gist
* Share the Gist with your fellow DM

__Pre-Game Communication__:
* Prior to starting the wargames, one of the DMs will send the following announcement in the `#login-situation` channel: (Replace {LIST}
  with the environments testing will be conducted in.)
~~~
@login-devops is commencing war game activities in the following environments: {LIST}
Disregard alerts from these environment(s) till further notice.
~~~

__Game__:
* All members converge in the situation war room (See _Meet Link_)
* The DM starts by telling a brief story guiding the party into a starting point.  (Example: "You just deployed to the `yourname` environment and now PIVCAC logins are failing...")  At a minimum the DM must provide:
  * The environment name
  * One or more symptoms to diagnose
* The PCs can ask questions, but are mostly self guided.
* The game runs for 15 minutes or until the party restores service
* The alternate DM (one not running the game) acts as referee

__Post-Game Communication__:
* After completion of all wargames for the day, one of the DM will send the following announcement in the `#login-situation` channel:
~~~
@login-devops has concluded war game activities in the following environments: <LIST>
~~~

__Post Game__:
* A 5 minute discussion of each wargame should be completed right after the games.
* Note of the games, findings, and action items must be added to the
  [Login.gov Contingency Planning Wargames](https://docs.google.com/document/d/1uUN62hKNptCui59DD-ApCS2_mJpLR5G68j69ieh007o) doc.
