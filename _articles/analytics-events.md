---
title: "Analytics Events"
description: "`events.log` structure and event descriptions"
layout: article
category: Reporting
---

{% if site.env.BRANCH == 'main' %}
  {% assign idp_base_url = site.env.IDP_BASE_URL %}
{% else %}
  {% assign idp_base_url = site.env.IDP_BASE_URL_PREVIEW %}
{% endif %}
{% assign idp_base_url = idp_base_url | default: 'https://secure.login.gov' %}

## Location

The IDP logs analytics events as JSON payloads to its `events.log` file, which
is replicated into Cloudwatch as `/${ENV}_/srv/idp/shared/log/events.log`.

## Structure

Each event has can have custom properties that go under `event_properties` in the final payload:

```ruby
{
  name: "Email and Password Authentication",
  properties: {
    event_properties: {
      success: true,
      user_locked_out: false,
      stored_location: null,
      sp_request_url_present: true,
      remember_device: false,
    },
    new_event: true, # is this the first time this event has triggered this session
    new_session_path: false, # is this the first time this path has been visited this session
    new_session_success_state: true, # is this the first time this "success_state" has been recorded this session
    success_state: "POST|/|Email and Password Authentication", # VERB + PATH + EVENT
    path: "/",
    user_id: "00000000-0000-0000-0000-000000000000",
    locale: "en",
    user_ip: "0.0.0.0",
    hostname: "idp.int.identitysandbox.gov",
    pid: 9391,
    service_provider: "urn:gov:gsa:openidconnect.profiles:example_sp:abcdef",
    trace_id: "Root=1-622654be-0a268c46759f64617fe9114a", # from the X-Amzn-Trace-Id header
    git_sha: "46e306a9",
    git_branch: "main",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
    browser_name: "Chrome",
    browser_version: "98.0.4758.102",
    browser_platform_name: "Windows",
    browser_platform_version: "10.0",
    browser_device_name: "Unknown",
    browser_mobile: false, # if we think this was a mobile browser based on User-Agent header
    browser_bot: false, # if we think this was an automated request based on User-Agent header
  },
  time: "2022-01-01T00:00:00.000Z",
  id: "11111111-1111-1111-1111-111111111111", # id for this log event
  visitor_id: "22222222-2222-2222-2222-222222222222", # id for this user via ahoy gem
  visit_id: "33333333-3333-3333-3333-333333333333", # id for this visit via ahoy gem
}


```


## Events

These are the events in the IDP that have been documented using our YARD syntax documentation.
For additional events see the [legacy Analytics Event documentation][legacy-documentation]

[legacy-documentation]: https://github.com/18F/identity-analytics-etl/blob/b42d5ca75bce809e00dcd1aa1bbbedf96339aca7/docs/Managing-analytics-events-in-IDP.md

### List Of Events {#event-list}

<div
  id="events-container"
  data-idp-base-url="{{ idp_base_url }}">
</div>

<script type="module">
import { loadAnalyticsEvents } from '{{ "/assets/build/analytics-events.js" | prepend: site.baseurl }}';

loadAnalyticsEvents();
</script>
