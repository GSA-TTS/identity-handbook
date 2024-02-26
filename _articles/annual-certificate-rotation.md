---
title: "SAML: Annual Certificate Rotation"
description: How to perform annual certificate rotation
layout: article
category: "AppDev"
subcategory: "Tasks"
---

The Login.gov SAML certificate is valid for just over one year. Every spring, Login.gov adds new SAML endpoints with the current year that use a new signing certificate. (So  `/api/saml/metadata2021`  becomes  `/api/saml/metadata2022`.)

The certificates are issued to create an overlap period of about a month, during which all partners using SAML should migrate at their convenience to the new endpoint URLs for the current year.

The 20XX certificates for `idp.int.identitysandbox.gov` and `secure.login.gov` each expire on April 1st the next year. So the transition from 2021 to 2022 endpoints should take place starting in January of 2022 and resolving around April 2022.

Please refer to the developer documentation for more details: <https://developers.login.gov/saml/>

Rotating the certificates happens in two phases: first adding the new certificates (should happen around Jan 1), then retiring the old certificates once partners have switched over (should happen around July 1).

## Steps to add the new SAML certificate:
1. Contact DevOps to create a ticket to generate the SAML 20XX key and cert.
    - Cert/Key get generated and saved to a secure S3 bucket
    - Certificate passphrases are saved to a Google sheet (limited distribution)
    - A PR in the `identity-devops` repo to copy the new cert down to new instances via Chef is created and merged.
    - Follow up to ensure the new key and cert have been pushed all the way to new production instances.
    - Ensure that the new certificate expires on April 1st the next year.
        - `openssl x509 -in saml20xx.crt -text -noout`
2. Wait here until `identity-devops` has been deployed through to `prod`!   Until a given environment has the updated `identity-devops` code applied
   it will NOT copy the new certificate from S3 on to the `idp` instances.  As the release progresses, you can follow along
   with the next steps.
3. Update reference to the new 20XX cert in secrets saml_endpoint_configs:
    - You will need to append the new certificate to saml_endpoint_configs in the secrets file in `dev`, `int`, `staging` and `prod` environments.
        - Do not update the configs until you have confirmed that the certs have been pushed to instances in that env (see above).
    - Get access to the new certificate's passphrase from the engineer who generated the new certs (e.g., via a shared Google doc)
    - Edit the env configs via `bin/app-s3-secret --env <ENV> --app idp --edit` in the `identity-devops` repo.
    - So this:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2022","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Recycle the env to make new configs take effect.
4. Confirm the new endpoint is live by going to `/api/saml/metadata20XX` in that environment's idp.
5. New SAML 20XX has been tested using a new test app on the Dashboard
    - Create a new "SAML 20XX" test app on <https://dashboard.int.identitysandbox.gov/> to test the new certificate endpoints.

6. Update <https://developers.login.gov/saml/> article to use the new year endpoints
    - Update <https://developers.login.gov/saml/> article found in [GSA-TTS/identity-dev-docs](https://github.com/GSA-TTS/identity-dev-docs) to use the new year certificate.
    - The endpoints change like this:
    - `/api/saml/metadata2021` → `/api/saml/metadata2022`
    - `/api/saml/auth2021` → `/api/saml/auth2022`

7. Send notification to our SAML partners' technical contacts following the [SAML rotation communication plan](https://docs.google.com/document/d/1nsxtJtqZK0GAhBjzkSVGUdvpl8I9k3jNynOB2FGxsSM/edit#).

## Steps to remove an old SAML certificate:

Removing an endpoint can result in a disruption of service if a partner is still referencing the old endpoint. Do not assume that old endpoints are not in use, even well after the certificates have expired.

The following considerations are essential for a successful removal:
- **Communicate**
    - All plans/changes should be announced in #login-appdev and #login-devops, as well as communicated to partners following the [SAML rotation communications plan](https://docs.google.com/document/d/1nsxtJtqZK0GAhBjzkSVGUdvpl8I9k3jNynOB2FGxsSM/edit#).
- **SLOW ROLLOUT**
    - Remove endpoints in lower environments first and ensure partners are not having problems (give it a few days).
    - With no problems in lower, proceed to `staging`, let run for a few days.
    - Finally, when we are confident that all partners are off the old endpoint, *schedule* making the updates to `prod`
        - **Do not** remove an endpoint from `prod` on the same day as a production code deploy!

1. Run a CloudWatch query to ensure that partners are no longer using the endpoint for the year being retired:
    - Run the following query over the past week on the `prod_/srv/idp/shared/log/production.log` to get a count of authentications per endpoint year:
    ```
    # file prod_/srv/idp/shared/log/production.log
    fields
      substr(replace(path, "/api/saml/auth", ""), 0, 4) AS year,
      @timestamp, @message
    | sort @timestamp desc
    | filter path like "/api/saml/auth"
    | stats count(*) by year
    ```
    - Run the following query over the past week on the `prod_/var/log/nginx/access.log` to get an idea of which partners are using which endpoints:
    ```
    # file prod_/var/log/nginx/access.log
    fields @timestamp, @message
    | parse @message 'http_referer="*"' as http_referer
    | parse @message 'uri_path="*"' as path
    | sort @timestamp desc
    | filter path like "/api/saml/auth"
    | filter http_referer not like "secure.login.gov"
    | limit 20
    | display
      replace(path, "/api/saml/auth", "") AS year,
      http_referer AS http_referer,
      @timestamp
    | stats count(*) by year, http_referer
    ```
2. If the endpoint is no longer in use, remove references to the old 20XX cert in secrets saml_endpoint_configs:
    - Edit the env configs via `bin/app-s3-secret --env <ENV> --app idp --edit` in the `identity-devops` repo.
    - For example, if expiring the 2021 endpoint:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2022","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2022","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
3. Recycle the environment and monitor for any errors. Revert immediately if errors occur.
4. Once we are confident that the scaling back is successful, a PR in `identity-devops` to remove the old cert from the deployed instances can be generated.
