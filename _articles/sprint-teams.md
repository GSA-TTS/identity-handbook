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
## {{ sprint_team.name }}

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

{% endfor %}
