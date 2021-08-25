---
title: "Background Jobs: RISC Ruby Workers"
description: "Overview and architecture of our RISC notification jobs"
layout: article
category: "AppDev"
---

## Overview

Our implementation of [RISC Security Event Token](https://developers.login.gov/security-events/) uses HTTP Push (basically webhooks) to delivery notifications to partners

To minimize the impact of external HTTP requests on our application performance, we moved those calls to background jobs.

![architecture diagram of async/ruby workers]({{site.baseurl}}/images/ruby-worker-risc-async-diagram.png)
(to update this diagram, edit the [Async Architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/w3TLJopAqDMjER3uCo8Y6v/Async-Worker-Architecture?node-id=104%3A3

The lifecycle of a job:

1. User performs an action that triggers a notification (such as changing their MFA)
2. IDP enqueues a job
    - The JWT payload is constructed and signed in the foreground, and the entire payload body is persisted temporarily as a job argument
    - See [data](#data) for payload contents
3. Worker host picks up the job and sends it
   - If the request to the parnter fails, the request will be retried about 5x

## Data

The jobs deliver JWT payloads which are base64-encoded and signed JSON objects (signed, not encrypted).

The data contained in the JWT payloads:
- Agency-specific UUID
- Timestamp
- Event name
- User Email (only sent for one type of event, not all events)

See the full list of [supported events and example payloads](https://developers.login.gov/security-events/#supported-outgoing-events)

## Deploys

The code for the workers lives in the same repository as the IDP, but is deployed to separate worker
instances.

## Configuration

1. Do the steps in [Ruby Proofing Workers]({% link _articles/appdev-proofing-ruby-worker-jobs.md %}) for job host configuration

2. Additionally update the env's [`application.yml`]({% link _articles/appdev-secrets-configuration.md %})

    - set **push_notifications_enabled**: `'true'` (this enables sending SET tokens)
    - Set **risc_notifications_active_job_enabled** `'true'` (this enables sending SET token via Ruby workers)
