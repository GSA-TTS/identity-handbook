---
title: Team Members
description: The login.gov team roster
layout: article
category: Team
---

This page is dynamically generated from [identity-private/team.yml][team-yml]
every time the handbook is deployed.

[team-yml]: https://github.com/18F/identity-private/blob/main/team/team.yml

<div id="error-container"></div>

### Current Team Members

<div id="team-container"></div>

### Alumni

<div id="alumni-container"></div>

<script type="module">
import { loadTeam } from '{{ "/assets/build/team.js" | prepend: site.baseurl }}';

loadTeam();
</script>

