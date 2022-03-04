---
title: "Analytics Events"
description: "Event descriptions"
layout: article
category: Reporting
---

{% if site.env.BRANCH == 'main' %}
  {% assign idp_base_url = site.env.IDP_BASE_URL %}
{% else %}
  {% assign idp_base_url = site.env.IDP_BASE_URL_PREVIEW %}
{% endif %}
{% assign idp_base_url = idp_base_url | default: 'https://secure.login.gov' %}

These are the events that are documented in the IDP. Each event has can have custom
properties that go under `event_properties` in the final payload:

```json
{
  "name": "Event Name",
  "user_id": "some-user-id",
  "properties": {
    "event_properties": {}
  }
}
```

<div
  id="events-container"
  data-idp-base-url="{{ idp_base_url }}">
</div>

<script type="module" src="{{ "/assets/js/analytics-events.js" | prepend: site.baseurl }}"></script>