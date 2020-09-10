---
title: "Deploying the Sample Apps"
description: "How to deploy oidc-sinatra and saml-sinatra to cloud.gov"
layout: article
category: "AppDev"
---

## Apps

We deploy { two sample apps } &times; { two environments } in cloud.gov:

| | [OpenID Connect](https://github.com/18f/identity-oidc-sinatra/) | [SAML](https://github.com/18f/identity-oidc-saml/) |
|---|-----|
| int | <https://int-identity-oidc-sinatra.app.cloud.gov> | <https://int-identity-saml-sinatra.app.cloud.gov> |
| dev | <https://dev-identity-oidc-sinatra.app.cloud.gov> | <https://dev-identity-saml-sinatra.app.cloud.gov>

## Deploying

From inside the repository for the app you want to deploy:

1. Create the `deploy.json` file

    ```bash
rake login:deploy_json
```

1. Log in to cloud.gov in the [CloudFoundry CLI][cf-cli]. It will prompt you to get an OTP from <https://login.fr.cloud.gov/passcode>.

    ```bash
cf login -a api.fr.cloud.gov --sso
```

    - When it prompts you to select an org, choose **gsa-login-prototyping**
    - When it prompts you for an environment, pick **dev** or **int**, depending on where you are deploying

1. Push the app

    - Double-check the deployed apps in the environment

        ```bash
        cf apps # list the deployed apps
        ```

    - Push the code, the app should be one of:

        - **dev-identity-oidc-sinatra**
        - **dev-identity-saml-sinatra**
        - **int-identity-oidc-sinatra**
        - **int-identity-saml-sinatra**

        ```bash
    cf push int-identity-saml-sinatra
    ```

[cf-cli]: https://docs.cloudfoundry.org/cf-cli/install-go-cli.html
