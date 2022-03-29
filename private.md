---
title: Private Articles
permalink: /private/
layout: article
---
{% if site.env.BRANCH == 'main' %}
  {% assign private_handbook_branch = site.env.PRIVATE_HANDBOOK_BRANCH %}
{% else %}
  {% assign private_handbook_branch = site.env.PRIVATE_HANDBOOK_BRANCH_PREVIEW %}
{% endif %}
{% assign private_handbook_branch = private_handbook_branch | default: 'main' %}

<div id="private-container" data-private-handbook-branch="{{private_handbook_branch}}"></div>

<script type="module">
  import {
    setUpPrivatePage
  } from '{{ "/assets/build/private-articles.js" | prepend: site.baseurl }}';

  setUpPrivatePage();
</script>

<span data-anchor="example data anchor to trigger anchor.js"></span>
