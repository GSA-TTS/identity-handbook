---
title: "Sprint Teams"
description: "List of our sprint teams and the explanations behind their names"
layout: article
category: "Team"
subcategory: Team Organization
---

Here are the Login.gov sprint teams, most of them are named after famous women in STEM fields.

{% comment %}
see data/sprint_teams.yml for the data
{% endcomment %}

{% assign sprint_teams = site.data.sprint_teams | sort: "name" %}

{% for sprint_team in sprint_teams %}
<div markdown="1" class="{% if sprint_team.archived %}sprint-team--archived{% endif %}">
## {{ sprint_team.name }}

{% if sprint_team.archived %}
This sprint team is not currently active
{% endif %}

{% if sprint_team.namesake_markdown -%}
* **Namesake**: {{ sprint_team.namesake_markdown }}
{%- endif %}
* **Focus area**: {{ sprint_team.focus_area }}
{% if sprint_team.slack_channel_url -%}
* **Slack**: [#{{ sprint_team.slack_channel_name }}]({{ sprint_team.slack_channel_url }})
{%- endif %}
{% if sprint_team.readme -%}
* **Readme**: [View Team {{sprint_team.name}} Readme]({{ sprint_team.readme }})
{%- endif %}
{% if sprint_team.slack_appdev_oncall_handle -%}
* **AppDev oncall Slack handle**: @{{ sprint_team.slack_appdev_oncall_handle }}
{%- endif %}
{% if sprint_team.appdev_oncall_rotation -%}
* **AppDev oncall rotation**: [Team {{ sprint_team.name }} AppDev Oncall Rotation]({{ sprint_team.appdev_oncall_rotation }})
{%- endif %}
</div>
{% endfor %}
