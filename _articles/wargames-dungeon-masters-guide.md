---
title: "Contingency Plan Training Wargames - Dungeon Master's Guide"
description: "How to create an exciting scenario"
layout: article
category: "Team"
subcategory: Guides
---

## Overview

Login.gov's "Contingency Plan Training Wargames" are a regular event that use a
mix of process practice, chaos engineering, and group troubleshooting to hon
skills and improve the rediness of our socio-technical system.

The fuel for our Wargames are spine chilling scenarios created by our "Dungeon Masters".

You don't need to be a seasoned veteran of Login.gov to create a good scenario,
and many of the best scenarios take relatively little time to prepare.

If you want to stump your peers and learn a lot in the process, read on...

## Resources

* [Contingency Plan - Wargames running doc](https://docs.google.com/document/d/1uUN62hKNptCui59DD-ApCS2_mJpLR5G68j69ieh007o/edit) - Should have notes for each session including action items for improvement
* [DM Signup Sheet](https://docs.google.com/spreadsheets/d/1GY8IWTWcNhCulWdparz-ABA_N3U_aK7Tu_DBle5b6AY/edit) - Sign up to volunteer as DM for a session
* [Contingency Plan Training Folder](https://drive.google.com/drive/folders/1XsMEgsz9iTOOaLoJOCkIJxTIWnmHU8fQ) - More contingency plan training resources
* [Wargame Scenario Grab Bag](https://docs.google.com/spreadsheets/d/1Kd6pkKsU2wVluit2VQj9VYG5XFQ5Mn4x95S-XcrCQ9U/edit) - Some ideas for scenarios (No peeking, players!)
* [Login.gov Incidents Folder](https://drive.google.com/drive/folders/1TWTMp_w55niNuqC7vTPDEe5vkxaiP4P0) - Some of the best ideas come from the past things that hurt us
* `#login-wargames-coordination` Slack channel - Invite only for folks who wish to DM;  Ask a current DM for access

## Categories of Scenario

There is no end to the type of scenario, but some common themes to consider
include (in order of peril):

**Availability**
* Outage - A downed service or component resulting in users being unable to use Login.gov
* Degraded service - Slow or intermittent problems causing user frustration
* Denial of service - Intentional overload of Login.gov (GSA IR)
* Bad release - Buggy code impacting users

**Integrity**
* Data corruption - Invalid or incorrect data in database or cache resulting in errors or inaccuracies
* Deleted or ransomed data - Accidental or deliberate data loss (GSA IR)

**Confidentiality**
* Data exfiltration / breach - Data leaving the ATO boundary (GSA IR)
* Compromised server - Attacker with control of a system withing Login.gov (GSA IR)
* Insider threat - The call is coming from inside of the building (GSA IR)
* Spillage - Sensitive data being sent to logs

(Items labeled "GSA IR" above should stress that response and mitigation would
require GSA IR involvement.  The DM or a member of GSA IR should provide
guidance.)

## Types of Sessions

### Classic Wargame

Our classic game involves the DM intentionally breaking a test environment
in a diabolical way.  Bugs, simulated failure of a process, and attack
are common themes.  The key is to give the players something that takes
work to resolve, but not too much work.  [Desirable difficulty](https://en.wikipedia.org/wiki/Desirable_difficulty)
should be the goal.

Steps for a Classic Wargame:
* [Prior to session] Break/attack/mess with a test environment for the players to work with
* If applicable, start the session with an actual alert (or simulation)
* The players should follow our standard IR process and work in the #login-situation-practice channel
* You may want to turn off your video if you do have trouble hiding your amusement
  as the players work to find a solution
* Try to avoid giving tips unless the team is really stuck, and then only provide enough to unblock
* Urge use of screen sharing, a particularly helpful way to get less experienced players engaged
* Once complete discuss potential improvements and record in the running notes

### Mindgame

For scenarios that are hard to simulate, you may need to revert to a more
table-top-like scenario.  For a "mindgame" think about a situation and what
the various dashboards, logs, etc might look like.  For example, if you wanted
to have the team try to figure out a problem where there was a major Internet
connectivity problem, you might say "you can get to X but you can not get to Y
from your workstation".  If players are looking at the WAF logs, they may see
little or no traffic.  Etc.

Mindgames should be hands on to exercise troubleshooting skills.  They are more
demanding of the DM at the time of scenario because the DM has to actively
tell the story and explain what the players **would** see.  For these reasons
try to avoid use of the "mindgame".

The mechanics of the scenario are identical to the [Classic Wargame](#classic-wargame)
except for the [Prior to session] component of breaking something.

### Runbook

A runbook scenario is one that focuses on executing a fixed runbook to verify
and refine it.  For example, you could conduct a Wargame where the team
is guided toward needing to use our basic [HA Test Contingency Plan Runbook](https://github.com/18F/identity-devops/wiki/HA-test---Contingency-Plan---Runbook)
to recover from an availability zone outage that did not cleanly failover.

These scenarios are also useful for addressing annual Contingency Plan Training
requirements, so please take attendance if you run one.

Steps for a Runbook scenario:
* [Prior to session] Prepare an environment for the players to work with
* If applicable, start the session with an actual alert (or simulation)
* The players should follow our standard IR process and work in the #login-situation-practice channel
* You may direct players to the applicable runbook - This is a named scenario,
  so initial troubleshooting should be minimized
* Once complete, note and assing runbook refinements

### Fault Injection / Chaos Engineering Tools

"Chaos Engineering" tends to refer to the use of automation/tools to introduce
failure into a distributed system.  Organizations have created a wide range
of tools to do things like randomly killing processes, randomly disconnecting
or slowing network interfaces, or blowing up entire services, all to test
the resilience of systems.

While most of our Wargames involve deliberate specific breakage incurred by
a human you should feel free to try using Chaos Engineering tools for a wargame.

To get started check out [Awesome Chaos Engineering](https://github.com/dastergon/awesome-chaos-engineering)

Please remember that these tools are inherently dangerous and should only be
tested outside of our ATO boundary in sandbox accounts and on sandbox
application environments.  (I.e. - Do not use NetHavoc on prod.)

Other than the use of tools and the potential for uncertainty in the specific
types of fault, you may conduct the scenario the same as a [Classic Wargame](#classic-wargame).

### What Was That?

Looking at logs or metrics of production systems will often result in finding
mysteries.  "Why did that line go up?"  "Is that and error or just noise?"

The lazy DM can crowd source and answer with a "What Was That?" session.

* [Prior to session] Find your conundrum and capture it in a screenshot,
  snippet, or specific steps to reproduce
* The players should work together to build a theory that addresses the
  mystery
* The players should then explain their theory to the full group and be
  ready to show graphs, logs, and evidence to support the theory
* It is acceptable not to arrive at an answer - The journey and the learning
  should be the focus
* Though, answers should not be discouraged!
* In post-game discussion think about tools or approaches that would make it
  easier to answer the question next time

### What Would You Do?

Sometimes it is good to zoom out and focus on decision making.  "What would you do?" (WWYD)
sessions are conducted using a simple slide deck and multiple choices.  The value
is not in finding the "right" answer but in the team discussing and deliberating.
[Kobayashi Maru](https://en.wikipedia.org/wiki/Kobayashi_Maru) situations are welcome.

For a sample of prior sessions see [this WWYD deck](https://docs.google.com/presentation/d/1lKkTWW2jyke3SZbUDMOSMNMxLg1nSntVG5J0wKu1Bfs/edit#slide=id.gf525bea144_0_1)

## Managing Larger Groups

If 8 or more players are present consider breaking the players into separate
teams.  Starting additional video rooms and moving a set of players to the new
rooms is generally easier than using "breakout room" functionality.  You will
want a helper-DM to supervise each room in most cases, though you can hop
between rooms instead if needed.

Suggested flow:
* Start in the main room and present the scenario
* Create additional rooms
* Name players that should move to the new rooms - Make sure to share the link!
* Monitor rooms and make sure teams don't get stuck
* Announce the return to the main room in each channel and ensure folks make
  it back
* Complete the session with a full group discussion


