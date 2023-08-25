---
title: "Team Daytime Oncall"
description: "Responsibilities for individual team daytime oncall"
layout: article
category: AppDev
subcategory: Oncall
---

## Overview

* Each AppDev sprint team has its own daytime team-specific oncall rotation, to resolve issues related to that team.
* This role complements the [overnight oncall rotation]({% link _articles/appdev-oncall-guide.md %}), distributing the burden of work, moving ownership of issues closer to the responsible teams, and preparing individuals to become familiar with oncall procedures.
* The overnight oncall rotation is a first responder; they will triage incoming issues reported during daytime hours, delegating responsibility to team oncall to investigate, fix, or create relevant tickets.

## Expectations

* Each team's oncall should be reachable by a Slack group handle `@login-oncall-TEAM`.
* When issues are escalated to team oncall, the oncall should respond within 15 business minutes.
* The oncall should fix the issue immediately if it is urgent, or otherwise create a ticket if there is a non-urgent bug to be fixed.
* "Daytime" is defined as the working hours for the person(s) on the daytime oncall rotation, typically 9am to 5pm in the local time. If an issue is escalated outside working hours, it's expected and understood that the task will be handled the next business day during business hours.

## Managing Oncall

* It is up to the individual teams to decide how they want to manage their team's oncall. The only requirement is that someone is always reachable by the team oncall Slack handle.
  * Some example variations include:
    * Rotations every week, or every sprint
    * Single oncall, or primary and back-up oncall
* Consider using a spreadsheet to manage the list of engineers in the rotation and the timeline of the rotation (see team examples in [Team Oncall Details](#team-oncall-details) below)

## Team Oncall Details

{% assign sprint_teams = site.data.sprint_teams | where_exp: "item", "item.slack_appdev_oncall_handle" | sort: "name" %}

{% for sprint_team in sprint_teams %}
* **Team {{ sprint_team.name }}**
  * Slack handle: `@{{ sprint_team.slack_appdev_oncall_handle }}`
  {% if sprint_team.appdev_oncall_rotation -%}
  * [Team {{ sprint_team.name }} AppDev Oncall Rotation]({{ sprint_team.appdev_oncall_rotation }})
  {% endif %}
{% endfor %}
