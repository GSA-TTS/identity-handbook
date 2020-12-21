---
title: "Lambda Background Jobs"
description: "Overview of and launch checklist for our async Lambda workers"
layout: article
category: "AppDev"
---

## Overview

To minimize long-running requests in the IDP, we've moved calls that talk to vendors
to background jobs. We have implemented those background jobs as AWS Lambda functions.

Generally, the jobs fall into two categories:

1. ID card scanning (image processing jobs)
2. PII verification


![architecture diagram of async/lambda]({{site.baseurl}}/images/lambda-async-diagram.png)

(to update this diagram, edit the [Async/Lambda Architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/w3TLJopAqDMjER3uCo8Y6v/Async%2FLambda-Architecture?node-id=0%3A1

The lifecycle of a lambda:

1. (For image processing jobs only)
  - The IDP will generate pre-signed S3 URLs and pass them to the client/browser
  - The browser will generate a random encryption key
  - The browser will AES-encrypt images and upload those encrypted images to the pre-signed S3 URLs
2. The user submits a form to the IDP
    - For image processing jobs, the payload will contain:
        - S3 image URLs
        - the encryption key and IVs
    - For PII verification jobs, the payload will contain PII:
        - First name
        - Last name
        - Date of Birth
        - SSN
        - Driver's license number
        - Address
3. The IDP immediately kicks off a Lambda (IDP does not persist any of the form data)
    - The IDP is pinned to a particular SHA of the Lambda code, via its its source (see [`GIT_REF`][git-ref] constant)
    - The lambda payload contains a `callback_url` which has a unique token for the job
    - The lambda payload contains the values submitted from the form (S3 image urls, encryption keys, or PII as needed)
4. The IDP will show a waiting page to the user
5. The Lambda will process the jobs
    - (For image processing jobs only)
        - The Lambda will download the encrypted image data from S3, and decrypt it
    - It will make HTTP requests via our outbound proxy to vendors
        - The request to the vendors will include either PII or decrypted image data
6. When the lambda is done, it will HTTP POST back to the IDP
    - It uses the `callback_url` with a unique token
    - It authenticates by passing a `X-API-AUTH-TOKEN` header (shared secret) with the IDP, the token
      is different per job (3 different jobs means there are 3 different authentication tokens)
    - The IDP stores the result (which may contain PII) in Redis, symmetrically encrypted and
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

[git-ref]: https://github.com/18F/identity-idp/blob/master/app/services/lambda_jobs/git_ref.rb

## Deploys

The code that runs inside the AWS Lambdas lives in the [identity-idp-functions][identity-idp-functions] repository.

We use CircleCI ([`.circleci/config.yml`][circleci]) to build and package the code via `sam`, and upload it to S3. The uploads
are tagged by their git ref.

TODO: add more info about the codebuild pipeline after the files get to S3.

The IDP is pinned to a specific SHA of the `identity-idp-functions` via its [`GIT_REF`][git-ref] constant, so
to get the IDP to use newer lambda code, you need to make a pull request to the IDP to update that file.

[identity-idp-functions]: https://github.com/18F/identity-idp-functions
[circleci]: https://github.com/18F/identity-idp-functions/blob/master/.circleci/config.yml

## Configuration

These are the secrets and configurations needed in order to enable and authenticate
the lambda workflow in the IDP.

<a id="parameter-name-conversion" />

| SSM secret name                 | IDP secret name                        | Purpose |
| ----                            | ----                                   | ---- |
| —                               | `aws_lambda_proofing_enabled`          | Enables lambdas in the IDP |
| —                               | `doc_auth_enable_presigned_s3_urls`    | Enables uploading images to S3 in the IDP |
| `address_proof_result_token`    | `address_proof_result_lambda_token`    | Shared authentication secret |
| `document_proof_result_token`   | `document_proof_result_lambda_token`   | Shared authentication secret |
| `resolution_proof_result_token` | `resolution_proof_result_lambda_token` | Shared authentication secret |


## Launch Checklist

Here's the step-by-step to enable the lambda background jobs workflow in the IDP.

1. Set up the IDP `application.yml`. See [how to update application.yml][secrets-config].

    Enable AWS proofing and set the various API auth tokens

    ```yaml
    aws_lambda_proofing_enabled: "true"
    doc_auth_enable_presigned_s3_urls: "true"
    # generate your own random tokens for these:
    address_proof_result_lambda_token: "CHANGEME"
    document_proof_result_lambda_token: "CHANGEME"
    resolution_proof_result_lambda_token: "CHANGEME"
    ```

2. Set the secrets the AWS Console

    1. Open the AWS console
        ```bash
        aws-vault login sandbox-power
        ```
    2. Go to **Parameter Store**

        (It's under _Systems Manager_ → _Application Management_ → **Parameter Store**)

    3. Find the secret you want to update, like: `/dev/idp/doc-capture/address_proof_result_token`

        - _Optional_: It's probably easiest to filter down to the environment.
          Parameters are templatized like `/$ENV/idp/doc-capture/$SSM_NAME`
        - _Reminder_: The parameter names are different than in the application YML,
          see SSM name in the [conversion table](#parameter-name-conversion)
        - Click "Edit", scroll down and put the value in the "Value" field
        - Click "Save Changes"

3. Recyle the IDP so the changes take effect

[secrets-config]: {% link _articles/appdev-secrets-configuration.md %}
