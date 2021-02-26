---
title: "SAML: Annual Certificate Rotation"
description: How to perform annual certificate rotation
layout: article
category: "AppDev"
---

The Login.gov SAML certificate is valid for just over one year. Every spring, Login.gov adds new SAML endpoints with the current year that use a new signing certificate. (So  `/api/saml/metadata2021`  becomes  `/api/saml/metadata2022`.)

The certificates are issued to create an overlap period of about a month, during which all partners using SAML should migrate at their convenience to the new endpoint URLs for the current year.

The 202X certificates for `idp.int.identitysandbox.gov` and `secure.login.gov` each expire on April 1st the next year. So the transition from 2021 to 2022 endpoints should take place in February or March 2022.

Please refer to the developer documentation for more details: <https://developers.login.gov/saml/>

**NOTE:** Do not assume that partners are not using out-of-date endpoints. It is a good idea to separate out the addition of the new year's certs/endpoints and the removal of older years certs/endpoints.

## Steps to add the new SAML certificate:
1. Contact DevOps to create a ticket to generate the SAML 202X key and cert.
    - Cert/Key get saved to a secure S3 bucket
    - Follow up to ensure the new key and cert have been pushed (via chef) all the way to new production instances.
    - Ensure that the new certificate expires on April 1st the next year.
2. Update reference to the new 202X cert in secrets saml_endpoint_configs:
    - Do not update the configs until you have confirmed that the certs are being pushed to instances in that env (see above).
    - You will need to append the new certificate to saml_endpoint_configs in the secrets file in `dev`, `int`, `staging` and `prod` environments. Edit the env configs via `bin/app-s3-secret --env <ENV> --app idp --edit` in the `identity-devops` repo.
    - So this:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
3. New SAML 202X has been tested using a new test app on the Dashboard
    - Create a new "SAML 202X" test app on <https://dashboard.int.identitysandbox.gov/> to test the new certificate endpoints.

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


## Steps to remove and old SAML certificate:
1. Run a CloudWatch query to ensure that partners are no longer the endpoint for the year being retired, e.g.,
    ```
    fields
      substr(replace(path, "/api/saml/auth", ""), 0, 4) AS year,
      @timestamp, @message
    | sort @timestamp desc
    | filter path like "/api/saml/auth"
    | stats count(*) by year
    ```
2. If the endpoint is no longer in use, remove reference to the old 20XX cert in secrets saml_endpoint_configs:
    - You will need to append the new certificate to saml_endpoint_configs in the secrets file in `dev`, `int`, `staging` and `prod` environments. Edit the env configs via `bin/app-s3-secret --env <ENV> --app idp --edit` in the `identity-devops` repo.
    - So this:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
    - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXX"}]'
	 ```
3. Recycle the environment and monitor for any errors. Revert immediately if errors occur.
4. Once we are confident that the scaling back is successful, a PR in `identity-devops` to remove the old cert from the deployed instances can be generated.
