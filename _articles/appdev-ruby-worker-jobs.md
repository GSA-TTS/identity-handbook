---
title: "Background Jobs: Ruby Workers"
description: "Overview of our background jobs using DelayedJob"
layout: article
category: "AppDev"
---

## Overview

To minimize long-running requests in the IDP, we've moved calls that talk to vendors
to background jobs. We have implemented those background jobs as jobs using
[DelayedJob](https://github.com/collectiveidea/delayed_job).

Generally, the jobs fall into two categories:

1. ID card scanning (image processing jobs)
2. PII verification

![architecture diagram of async/ruby workers]({{site.baseurl}}/images/ruby-worker-async-diagram.png)
(to update this diagram, edit the [Async Architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/w3TLJopAqDMjER3uCo8Y6v/Async-Worker-Architecture?node-id=104%3A3

The lifecycle of a job:

1. (For image processing jobs only)
  - The IDP will generate pre-signed S3 URLs and pass them to the client/browser
  - The browser will generate a random encryption key
  - The browser will AES-encrypt images and upload those encrypted images to the pre-signed S3 URLs
2. The user submits a form to the IDP
    - For image processing jobs, the payload will contain:
        - S3 image URLs
        - the encryption key and initialization vectors (IVs)
    - For PII verification jobs, the payload will contain PII:
        - First name
        - Last name
        - Date of Birth
        - SSN
        - Driver's license number
        - Address
3. The IDP will enqueue a background job
    - Job parameters are persisted to the PSQL database
    - Sensitive parameters are symmetrically encrypted by a server-side IDP key
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

## Deploys

The code for the workers lives in the same repository as the IDP, but is deployed to separate worker
instances.
