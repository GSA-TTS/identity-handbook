---
title: "SAML: Annual Certificate Rotation"
description: How to perform annual certificate rotation
layout: article
category: "AppDev"
---

The Login.gov SAML certificate is valid for just over one year. Every spring, Login.gov adds new SAML endpoints with the current year that use a new signing certificate. (So  `/api/saml/metadata2020`  becomes  `/api/saml/metadata2021`.)

The certificates are issued to create an overlap period of about a month, during which all partners using SAML should migrate at their convenience to the new endpoint URLs for the current year.

The 202X certificates for `idp.int.identitysandbox.gov` and `secure.login.gov` each expire on April 1st the next year. So the transition from 2020 to 2021 endpoints should take place in February or March 2021.

Please refer to the developer documentation for more details: <https://developers.login.gov/saml/>

## Steps to rotate SAML certificate:
1. Contact DevOps to create a ticket to generate the SAML 202X key and cert.
	- Follow up to ensure the new key and cert have been pushed all the way to production.
	- Ensure that the new certificate expires on April 1st the next year.
2. Update reference to the new 2020 cert in secrets saml_endpoint_configs:
	-    You will need to append the new certificate to saml_endpoint_configs in the secrets file in INT, Staging and Prod environments. Coordinate with DeveOps to get this done.
3. New SAML 2020 has been tested using a new test app on the Dashboard
	 - Create a new "SAML 202X" test app on <https://dashboard.int.identitysandbox.gov/> to test the new certificate endpoints.
	 - So this:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2019","secret_key_passphrase":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}]'
	 ```
	 - Becomes:
	 ```yaml
	 saml_endpoint_configs: '[{"suffix":"2020","secret_key_passphrase":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},{"suffix":"2021","secret_key_passphrase":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}]'
	 ```
4. Update <https://developers.login.gov/saml/> article to use the new year endpoints
	- Update <https://developers.login.gov/saml/> article found in [18F/identity-dev-docs](https://github.com/18F/identity-dev-docs) to use the new year certificate.
	- The endpoints change like this:
	  - `/api/saml/metadata2019` → `/api/saml/metadata2020`
	  - `/api/saml/auth2019` → `/api/saml/auth2020`


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