---
title: "Deploying a Partner Service Provider Config to Production"
layout: article
description: "Process and proceeders when deploying a partner service provider config to production"
category: Partnerships
---

Here is a list of items that need to be completed to deploy the configuration for a partner SP (Service Provider) to Production.


{%- capture alert_content -%}
**Note to AppDev**: You should probably work with the Partnership team to ensure that steps 1-4 are complete.
{%- endcapture %}

{% include alert.html content=alert_content %}

1. Ensure that the IAA is signed for the hubspot deal. You should see a "IAA Approved" with an "IAA Number" on the deal. Please contact Silke if unsure. If the IAA is not approved, then let the partner know that the app cannot be deployed to production until the IAA is signed.

2. Ensure that the hubspot deal has been populated with information that comes from [this hubspot template email](https://app.hubspot.com/templates/5531666/edit/13393058). If the email was not sent, then send this template from the hubspot deal to Program Management POC.

3. Ensure that the **Contact Center Fact Sheet** was sent from the hubspot deal. Click on the Emails tab and search for the **"NOTICE: A new Login.gov app is launching"** email. If the email was not sent, then send [this template form the hubspot deal](https://app.hubspot.com/templates/5531666/edit/9282726). This template email should go to the [Contact Center Fact Sheet Email List (see handbook appendix)](https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.2dv73pe5frx0)

4. Ensure that the production app has been created on the Dashboard. The partner should be responding with a link to an app in the dashboard with "Production" in the name. The partner may provide the Issuer for the app instead. In this case you can [search for the issuer here](https://dashboard.int.identitysandbox.gov/service_providers/all). You can also check the Dashboard Team URL on the hubspot deal to see if the prod config was created. If not, then [send this template](https://app.hubspot.com/templates/5531666/edit/12106190 ) from the hubspot deal to the Technical POC:

5. Make sure the app meets the following criteria:
    * All production urls should have `.gov`, `.mil` or a dedicated `.com` address and point to an ATO'd environment. It should not be a local IP or have things like "dev", "qa",  or "mikes-macbook" in the urls.
    * If the app does not have a logo, then the partner will need to upload one before it can be deployed. You can find the [logo guidelines here](https://developers.login.gov/design-guidelines/#agency-logo-guidelines).
    * **If this is an SAML integration** (Not OpenID Connect), then please ensure that `SAML Assertion Encryption` is enabled and `Assertion Consumer Logout Service URL` is defined.

6. Create a PR on the [identity-idp-config](https://github.com/18f/identity-idp-config) repo that consists of:
    * App configuration added to [`service_providers.yml`](https://github.com/18F/identity-idp-config/blob/main/service_providers.yml)
    * A logo image in [`/public/assets/images/sp-logos`](https://github.com/18F/identity-idp-config/tree/main/public/assets/images/sp-logos)
    * A certificate file in [`/certs/sp`](https://github.com/18F/identity-idp-config/tree/main/certs/sp)

7. After merging the above PR you will need to deploy the configuration change by migrating and recycling the IDP in **both**:
    - In Staging ([deploy commands for staging]({{ '/articles/appdev-deploy.html#staging' | prepend: site.baseurl }}))
    - In Production ([deploy commands for production]({{ '/articles/appdev-deploy.html#production' | prepend: site.baseurl }}))

8. Open the hubspot deal for this partner and Inform the Technical POC and Program Management POC that the app has been deployed to production. You should also tell them to:

    > Change your production endpoint urls to **https://secure.login.gov/**
