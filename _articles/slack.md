---
title: Slack
description: Groups and Channels
layout: article
category: Team
subcategory: Team Organization
toc_h_max: 4
---

We use Slack extensively!

## Channel naming conventions

- All channels begin with `#login-`
- All channels with external collaborators start with `#login-partners-`
- Sprint team channels look like `#login-team-<name>`

## Groups

Use these to ping a large group of people, without having to **@here** or **@channel** a room full of the wrong people.

### Oncall Handles

These handles ping oncall engineers, use for emergencies or urgent items.

- `@login-appdev-oncall` The application developer oncall
- `@login-devops-oncall` The devops oncall
- `@login-deployer` The [appdev app deployer]({% link _articles/appdev-deploy-rotation.md %})
- `@login-devtools-oncall` The devtools developer oncall

### Team Handles

- `@login-devops-team` Group to tag the Login.gov devops team
- `@login-partnerships-team` Group to address Login.gov partnerships team members
- `@login-ux-feds` Group to tag the Login.gov UX federal employees
- `@login-ux-practice` Group to tag all of the Login.gov UX practitioners
- `@login-ux-ops` Group to tag the Login.gov UX Operations team
- `@github-admins-login` members of this group can edit [`identity-core`](https://github.com/orgs/18F/teams/identity-core) GitHub team membership

### Sprint Team Handles

{% comment %}
see data/sprint_teams.yml for the data
{% endcomment %}

{% assign sprint_team_handles = site.data.sprint_teams | sort: "name" %}

{% for sprint_team in sprint_team_handles %}{% if sprint_team.slack_group_name %}
- `@{{ sprint_team.slack_group_name }}` To tag members of [{{ sprint_team.name }}]({% link _articles/sprint-teams.md %}#{{ sprint_team.name | slugify }})
{%- endif %}{%- endfor %}


## Channels

Here are some common Slack Channels for the Login.gov team


**Filter by**

<div class="margin-bottom-05">
  <button class="usa-button" data-action="channel-filter" data-filter="all">
    All
  </button>
  (remove filters)
</div>

<div>
  <button class="usa-button usa-button--outline" data-action="channel-filter" data-filter="important">
    Important
  </button>
  <button class="usa-button usa-button--outline" data-action="channel-filter" data-filter="appdev">
    AppDev
  </button>
  <button class="usa-button usa-button--outline" data-action="channel-filter" data-filter="devops">
    DevOps
  </button>
  <button class="usa-button usa-button--outline" data-action="channel-filter" data-filter="design">
    Design/UX
  </button>
</div>

### All-team Channel

- [`#login`](https://gsa.enterprise.slack.com/archives/C5AUR5XUK):
  {% include tag.html name='important' %}
  Channel for the whole team, team-wide announcements and so on

### Sub-Team Channels

#### Design/UX

- [`#login-ux`](https://gsa.enterprise.slack.com/archives/CEUQ9FXNJ):
  {% include tag.html name='design' color='bg-success' %}
  Channel for the user experience design team (research, visual, content)

- [`#login-public-site`](https://gsa.enterprise.slack.com/archives/CNZCW01PX)
  Discussion around the Login.gov marketing/brochure/public site

- [`#login-design-system`](https://gsa.enterprise.slack.com/archives/C01JVKYE4KD)
  {% include tag.html name='design' color='bg-success' %}
  Discussion around the Login.gov design system

- [`#login-accessibility`](https://gsa.enterprise.slack.com/archives/C01C89LM6UF)
  {% include tag.html name='design' color='bg-success' %}
  Accessibility working group

#### Engineering/AppDev

- [`#login-appdev`](https://gsa.enterprise.slack.com/archives/C0NGESUN5):
  {% include tag.html name='appdev' color='bg-primary' %}
  General IdP and Appdev matters

- [`#login-reporting`](https://gsa.enterprise.slack.com/archives/C5E7EJWF7):
  Analytics and reporting channel

#### Engineering/DevOps

- [`#login-devops`](https://gsa.enterprise.slack.com/archives/C16RSBG49):
  {% include tag.html name='devops' color='bg-success' %}
  Platform and tools channel

- [`#login-platform-support`](https://gsa.enterprise.slack.com/archives/CMW9H0RFX):
  {% include tag.html name='appdev' color='bg-primary' %}
  {% include tag.html name='devops' color='bg-success' %}
  Platform channel specifically for helping people set up their environments (AWS, Terraform, etc.)

- [`#login-alarms`](https://gsa.enterprise.slack.com/archives/C06M08T8LE5):
  Channel for critical automated notifications from production

- [`#login-events`](https://gsa.enterprise.slack.com/archives/C42TZ3K5H):
  Channel for automated notifications from production

- [`#login-security`](https://gsa.enterprise.slack.com/archives/CA7NE63SB):
  Channel for security-related discussions

- [`#login-soc-events`](https://gsa.enterprise.slack.com/archives/C9HUJFC6R):
  Channel for automated notifications from AWS SOC monitoring

- [`#login-load-testing`](https://gsa.enterprise.slack.com/archives/C010L0SE4E8):
  Discussion around load testing of Login.gov

- [`#login-compliance`](https://gsa.enterprise.slack.com/archives/C3X5AJ8RK)
  FedRAMP and other Compliance information

#### Partners

- [`#login-partnerships`](https://gsa.enterprise.slack.com/archives/C23LEJLMC):
  Internal discussion around partnerships initiatives

- [`#login-partner-support`](https://gsa.enterprise.slack.com/archives/CG64NU5C7):
  Channel for providing customer support, we often grant guest Slack access to partners

#### Product

- [`#login-product-strategy`](https://gsa.enterprise.slack.com/archives/CR2SSAFRQ):
  Cross-team product strategy

#### Sprint Teams

{% comment %}
see data/sprint_teams.yml for the data
{% endcomment %}

{% assign sprint_team_channels = site.data.sprint_teams | sort: "name" | where: "archived", nil %}

{% for sprint_team in sprint_team_channels %}
{% if sprint_team.slack_channel_name and sprint_team.slack_channel_url %}
- [`#{{ sprint_team.slack_channel_name }}`]({{ sprint_team.slack_channel_url }})
  Team {{ sprint_team.name }} channel
{% endif %}
{% endfor %}

### Other Channels

- [`#login-handbook`](https://gsa.enterprise.slack.com/archives/CR6BF3CQK):
  Discussion and coordination around this handbook

- [`#login-leads`](https://gsa.enterprise.slack.com/archives/CR3TL6JTB):
  Login.gov leadership team channel

- [`#login-professional-development`](https://gsa.enterprise.slack.com/archives/C013NBL04AF):
  Discussion and coordination around professional development, attending conferences, etc.

- [`#login-situation`](https://gsa.enterprise.slack.com/archives/C5QUGUANN):
  {% include tag.html name='devops' color='bg-success' %}
  Incident response coordination channel

- [`#login-random`](https://gsa.enterprise.slack.com/archives/CNMN7K2MA):
  {% include tag.html name='important' %}
  Fun/random/miscellaneous channel

- [`#login-fraud-mitigation`](https://gsa.enterprise.slack.com/archives/C01987XHBM2):
  Discussion around fraud mitigation

- [`#login-user-support`](https://gsa.enterprise.slack.com/archives/C20J64X6V):
  Escalations and triage from user support

- [`#cop-containers`](https://gsa.enterprise.slack.com/archives/CUBGZS3SB):
  Channel for workflows on containerization in Docker across TTS

<script type="text/javascript">
  function setButtonHighlighted(button, highlighted) {
    if (highlighted) {
      button.classList.remove('usa-button--outline');
    } else {
      button.classList.add('usa-button--outline');
    }
  }

  function setElemVisible(elem, visible) {
    if (visible) {
      elem.classList.remove('display-none');
    } else {
      elem.classList.add('display-none');
    }
  }

  document.querySelectorAll('[data-action=channel-filter]').forEach(function(elem) {
    elem.onclick = function() {
      var thisButton = this;
      var filterName = thisButton.getAttribute('data-filter');

      document.querySelectorAll('[data-action=channel-filter]').forEach(function(button) {
        setButtonHighlighted(button, thisButton == button);
      });

      if (filterName == 'all') {
        document.querySelectorAll('[role=main] li').forEach(function(li) {
          setElemVisible(li, true);
        });
      } else {
        document.querySelectorAll('[role=main] li').forEach(function(li) {
          var matchesFilter = !!li.querySelector('[data-filter=' + filterName + ']');
          var isImportant = !!li.querySelector('[data-filter=important]');

          setElemVisible(li, matchesFilter || isImportant);
        });
      }
    };
  });
</script>
