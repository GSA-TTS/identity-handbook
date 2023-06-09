---
title: "Background Jobs: Proofing Ruby Workers"
description: "Overview and architecture of our proofing background jobs"
layout: article
category: "Architecture"
redirect_from: /articles/appdev-ruby-worker-jobs.html
cSpell: ignore PSQL
---

## Overview

To minimize long-running requests in the IDP, we've moved calls that talk to vendors
to background jobs. We have implemented those background jobs as jobs using
[GoodJob](https://github.com/bensheldon/good_job).

We currently use proofing jobs for PII verification.

[![architecture diagram of async/ruby workers][image]][image]
(to update this diagram, edit the [Async Architecture][figma] file in Figma and re-export it)

[image]: {{site.baseurl}}/images/ruby-worker-proofing-async-diagram.png
[figma]: https://www.figma.com/file/w3TLJopAqDMjER3uCo8Y6v/Async-Worker-Architecture?node-id=104%3A3

The lifecycle of a job:

1. The user submits a form to the IDP
    - For PII verification jobs, the payload will contain PII:
        - First name
        - Last name
        - Date of Birth
        - SSN
        - Driver's license number
        - Address
1. The IDP will enqueue a background job
    - Job parameters are persisted to the PSQL database
    - Sensitive parameters are symmetrically encrypted by a server-side IDP key (see notes on [server-side encryption](#server-side-encryption))
1. The IDP will show a waiting page to the user
1. The Worker host polls the background jobs table. When it pulls a job:
    - Writes to the jobs table to mark the job as claimed
    - It will make HTTP requests via our outbound proxy to vendors
        - The request to the vendors will include PII
1. When the worker process is done, it will
    - Update the jobs table to mark the job as done, and
    - Store the result (which may contain PII) in Redis, symmetrically encrypted and
      with a 60 second expiration.
    - PII in the payload may include data from reading the driver's license
        - First name
        - Last name
        - Date of Birth
        - Driver's license number
        - Address
1. The user waiting page will be polling for the result of the background job, where the IDP will
   check Redis for the result for that particular job. Once it is complete, the user will continue
   to the next step of the flow.
    - If after 60 seconds the IDP has not seen a response for the job, the IDP will decide the job
      has timed out, and show an error screen to the user, giving them an option to retry.

### Server-Side Encryption

The server stores job arguments in RDS. The Ruby code encrypts arguments that contain PII
using the same encryption to encode a session: AES-256-GCM inside of an AWS KMS-encrypted message.
The AES key is the application's `session_encryption_key`, stored with the application secrets.
The application secrets are sensitive config items are stored live in S3 in YAML files, and are
pulled down when the app launches and read into memory.

### Logging

Logging for the workers will go to `log/production.log` just like the IDP web hosts,
which will be ingested into Cloudwatch.

GoodJob logs job durations by default.

## Deploys

The code for the workers lives in the same repository as the IDP, but is deployed to separate worker
instances.

## Configuration

To enable ruby workers in an environment:

1. Update the environment's [`application.yml`]({% link _articles/appdev-secrets-configuration.md %})
  - Set **ruby_workers_idv_enabled**: `'true'` (this enables async for resolution, address jobs)
2. Set terraform variables:
    - Positive worker sizes to be positive integers [(example pull request)](https://github.com/18F/identity-devops-private/pull/1513/files):
        - **asg_worker_min**: 2
        - **asg_worker_desired**: 2
        - **asg_worker_max**: 8 (or something)
    - Enable worker alarms for alerting [(example pull request)](https://github.com/18F/identity-devops-private/pull/1514/files)
        - **idp_worker_alarms_enabled**: 1
