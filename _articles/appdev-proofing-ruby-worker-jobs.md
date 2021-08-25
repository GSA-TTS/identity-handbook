---
title: "Background Jobs: Proofing Ruby Workers"
description: "Overview and architecture of our proofing background jobs"
layout: article
category: "AppDev"
redirect_from: /articles/appdev-ruby-worker-jobs.html
---

## Overview

To minimize long-running requests in the IDP, we've moved calls that talk to vendors
to background jobs. We have implemented those background jobs as jobs using
[GoodJob](https://github.com/bensheldon/good_job).

We have two kinds of proofing jobs

1. ID card scanning (image processing jobs)
2. PII verification

![architecture diagram of async/ruby workers]({{site.baseurl}}/images/ruby-worker-proofing-async-diagram.png)
(to update this diagram, edit the [Async Architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/w3TLJopAqDMjER3uCo8Y6v/Async-Worker-Architecture?node-id=104%3A3

The lifecycle of a job:

1. (For image processing jobs only)
  - The IDP will generate pre-signed S3 URLs and pass them to the client/browser. The pre-signed URL expiration matches the maximum session duration to guarantee that it won't expire while the user's session is still active.
  - The browser will generate a random encryption key (see notes on [client-side encryption](#client-side-encryption))
  - The browser will AES-encrypt images and upload those encrypted images to the pre-signed S3 URLs (see notes on [client-side encryption](#client-side-encryption))
2. The user submits a form to the IDP
    - For image processing jobs, the payload will contain:
        - S3 image URLs
        - the encryption key and initialization vectors (IVs) (see notes on [client-side encryption](#client-side-encryption))
    - For PII verification jobs, the payload will contain PII:
        - First name
        - Last name
        - Date of Birth
        - SSN
        - Driver's license number
        - Address
3. The IDP will enqueue a background job
    - Job parameters are persisted to the PSQL database
    - Sensitive parameters are symmetrically encrypted by a server-side IDP key (see notes on [server-side encryption](#server-side-encryption))
4. The IDP will show a waiting page to the user
4. The Worker host polls the background jobs table. When it pulls a job:
    - Writes to the jobs table to mark the job as claimed
    - (For image processing jobs only)
        - The worker process will download the encrypted image data from S3, and decrypt it
    - It will make HTTP requests via our outbound proxy to vendors
        - The request to the vendors will include either PII or decrypted image data
6. When the worker process is done, it will
    - Update the jobs table to mark the job as done, and
    - Store the result (which may contain PII) in Redis, symmetrically encrypted and
      with a 60 second expiration.
    - PII in the payload may include data from reading the driver's licese
        - First name
        - Last name
        - Date of Birth
        - Driver's license number
        - Address
7. The user waiting page will be polling for the result of the background job, where the IDP will
   check Redis for the result for that particular job. Once it is complete, the user will continue
   to the next step of the flow.
    - If after 60 seconds the IDP has not seen a response for the job, the IDP will decide the job
      has timed out, and show an error screen to the user, giving them an option to retry.

### Client-Side Encryption

The browser encrypts images before they are uploaded to S3. The browser generates 256-bit AES key,
with a separate 12-byte random IV per image. It uses AES-GCM.

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

1. Update the env's [`application.yml`]({% link _articles/appdev-secrets-configuration.md %})
  - Set **ruby_workers_enabled**: `'true'` (this enables async for resolution, address jobs)
  - Set **doc_auth_enable_presigned_s3_urls**: `'true'` (this enables async for document proofig job)
2. Set terraform variables:
    - Positive worker sizes to be positive integers [(example pull request)](https://github.com/18F/identity-devops-private/pull/1513/files):
        - **asg_worker_min**: 2
        - **asg_worker_desired**: 2
        - **asg_worker_max**: 8 (or something)
    - Enable worker alarms for alerting [(example pull request)](https://github.com/18F/identity-devops-private/pull/1514/files)
        - **idp_worker_alarms_enabled**: 1
