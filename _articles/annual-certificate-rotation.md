---
title: "SAML: Annual Certificate Rotation"
description: How to perform annual certificate rotation
layout: article
category: "AppDev"
---

The Login.gov SAML certificate is valid for just over one year. Every spring, Login.gov adds new SAML endpoints with the current year that use a new signing certificate. (So  `/api/saml/metadata2021`  becomes  `/api/saml/metadata2022`.)

The certificates are issued to create an overlap period of about a month, during which all partners using SAML should migrate at their convenience to the new endpoint URLs for the current year.

The 20XX certificates for `idp.int.identitysandbox.gov` and `secure.login.gov` each expire on April 1st the next year. So the transition from 2021 to 2022 endpoints should take place starting in January of 2022 and resolving around April 2022.

Please refer to the developer documentation for more details: <https://developers.login.gov/saml/>

Rotating the certificates happens in two phases: first adding the new certificates (should happen around Jan 1), then retiring the old certificates once partners have switched over (should happen around April-June).

## Steps to add the new SAML certificate:
1. Contact DevOps to create a ticket to generate the SAML 20XX key and cert.
    - Cert/Key get generated and saved to a secure S3 bucket
    - Certificate passphrases are saved to a Google sheet (limited distribution)
    - A PR in the `identity-devops` repo to copy the new cert down to new instances via Chef is created and merged.
    - Follow up to ensure the new key and cert have been pushed all the way to new production instances.
    - Ensure that the new certificate expires on April 1st the next year.
        - `openssl x509 -in saml20xx.crt -text -noout`
2. Update reference to the new 20XX cert in secrets saml_endpoint_configs:
    - You will need to append the new certificate to saml_endpoint_configs in the secrets file in `dev`, `int`, `staging` and `prod` environments.
        - Do not update the configs until you have confirmed that the certs have been pushed to instances in that env (see above).
    - Get access to the new certificate's passphrase from the engineer who generated the new certs (e.g., via a shared Google doc)
    - Edit the env configs via `bin/app-s3-secret --env <ENV> --app idp --edit` in the `identity-devops` repo.
    - So this:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Recycle the env to make new configs take effect.
3. Confirm the new endpoint is live by going to `/api/saml/metadata20XX` in that environment's idp.
3. New SAML 20XX has been tested using a new test app on the Dashboard
    - Create a new "SAML 20XX" test app on <https://dashboard.int.identitysandbox.gov/> to test the new certificate endpoints.

4. Update <https://developers.login.gov/saml/> article to use the new year endpoints
    - Update <https://developers.login.gov/saml/> article found in [18F/identity-dev-docs](https://github.com/18F/identity-dev-docs) to use the new year certificate.
    - The endpoints change like this:
    - `/api/saml/metadata2021` → `/api/saml/metadata2022`
    - `/api/saml/auth2021` → `/api/saml/auth2022`

5. Send notification to our SAML partners technical contacts
    - Provide a list of all SAML issuers in Prod to Partnerships and ask for the technical contacts.
    - Send a message to the technical contacts from <partners@login.gov> with subject "Login.gov Annual Certificate Rotation."
    - Here is an example:

<blockquote class="padding-left-5 border-left-05" markdown="1">
Greetings Login.gov Partner,

This email is intended for all partners who have a SAML integration with Login.gov. OpenID Connect (OIDC) integrations are not affected.
The 2019 certificates for <https://idp.int.identitysandbox.gov/> and <https://secure.login.gov/> each expire on April 1, 2020. So the transition from 2019 to 2020 endpoints should take place before April 1, 2020.

Briefly:
- `/api/saml/metadata2019` becomes `/api/saml/metadata2020`
- `/api/saml/auth2019` becomes `/api/saml/auth2020`

Please refer to the developer documentation for more details:
<https://developers.login.gov/saml/>

If you have any questions, please send an email to <partners@login.gov>.

Thank you,

Partnerships team | [login.gov](http://login.gov/)
Technology Transformation Services
U.S. General Services Administration
[partners@login.gov](mailto:partners@login.gov)
</blockquote>


## Steps to remove an old SAML certificate:

Removing an endpoint can result in a disruption of service if a partner is still referencing the old endpoint. Do not assume that old endpoints are not in use, even well after the certificates have expired.

The following considerations are essential for a successful removal:
- **Communicate**
    - All plans/changes should be announced in #login-appdev and #login-devops
- **SLOW ROLLOUT**
    - Remove enpoints in lower environments first and ensure partners are not having problems (give it a few days).
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
    - For example, if expiring the 2019 endpoint:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
3. Recycle the environment and monitor for any errors. Revert immediately if errors occur.
4. Once we are confident that the scaling back is successful, a PR in `identity-devops` to remove the old cert from the deployed instances can be generated.
