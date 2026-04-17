---
title: "Deploying the Sample Apps"
description: "How to deploy and customize oidc-sinatra and saml-sinatra on cloud.gov"
layout: article
category: "AppDev"
subcategory: "Deploying"
toc_h_max: 4
envs:
- dev
- int
- staging
- prod
---

## Shared sample apps

We deploy { two sample apps } &times; { four environments } in cloud.gov:

| | [OpenID Connect](https://gitlab.login.gov/lg/identity-oidc-sinatra) | [SAML](https://gitlab.login.gov/lg/identity-saml-sinatra) |
|---|-----|
{% for env in page.envs -%}
| {{ env }} | <https://{{ env }}-identity-oidc-sinatra.app.cloud.gov> | <https://{{ env }}-identity-saml-sinatra.app.cloud.gov> |
{% endfor %}

The sample apps deploy automatically when changes are merged to the `main` branch.

Refer to each project's GitLab CI/CD configuration for details on the shared deployment workflow:

- [identity-oidc-sinatra/.gitlab-ci.yml](https://gitlab.login.gov/lg/identity-oidc-sinatra/-/blob/main/.gitlab-ci.yml?ref_type=heads)
- [identity-saml-sinatra/.gitlab-ci.yml](https://gitlab.login.gov/lg/identity-saml-sinatra/-/blob/main/.gitlab-ci.yml?ref_type=heads)

## Deploy your own sample app

Use this workflow when you want a personal or team-specific deployment of either Sinatra sample app, or when you want to point the app at a different IdP environment without changing the shared apps above.

### Pick your values once

Set these values first and reuse them throughout the guide. The important distinction is that your app name, Cloud.gov target, and IdP environment are separate settings:

| Variable | What it controls | Example values |
|---|---|---|
| `SOURCE_ENV` | The existing sample app environment you are copying a manifest from | `dev`, `int` |
| `SOURCE_APP` | The exact existing Cloud.gov app you are copying a manifest from | `dev-identity-oidc-sinatra`, `data-identity-oidc-sinatra` |
| `APP_NAME` | The name of your new deployment in Cloud.gov | `katherine-identity-oidc-sinatra`, `my-test-oidc` |
| `IDP_ENV` | The Login.gov environment your app should talk to | `dev`, `int` |
| `OIDC_CLIENT_ID` | The OIDC issuer and `client_id` registered for the app in the Partner Portal | `urn:gov:gsa:openidconnect.profiles:sp:sso:gcruzort` |
| `CF_ORG` | The Cloud.gov org to target | `gsa-login-prototyping` |
| `CF_SPACE` | The Cloud.gov space inside the selected org | `your-space-in-that-org` |

`CF_ORG` and `CF_SPACE` should be chosen together. If you change orgs, the available spaces usually change too. `IDP_ENV` is separate from both of those values and should match the IdP endpoints you put in the manifest.

`SOURCE_ENV` is only used to decide which existing app you copy from. It does not control the name of your new deployment and it does not decide which IdP environment the new deployment points to.

`APP_NAME` can be whatever you want to call the deployment, as long as it is a valid Cloud.gov app name. `IDP_ENV` separately controls which Login.gov environment the app talks to.

`OIDC_CLIENT_ID` is separate from `APP_NAME`. For OIDC deployments it should match the issuer registered in the Partner Portal, and in some sandboxes that value follows the sandbox name rather than the Cloud.gov app name.

Example: you can copy from `dev-identity-oidc-sinatra`, deploy a new app named `malick-oidc-lab`, and point that app at `int`.


For OIDC:

```bash
export REPO=identity-oidc-sinatra
export SOURCE_ENV=dev
export SOURCE_APP="${SOURCE_ENV}-identity-oidc-sinatra"
export APP_NAME="${USER}-identity-oidc-sinatra"
export IDP_ENV=dev
export OIDC_CLIENT_ID="urn:gov:gsa:openidconnect.profiles:sp:sso:${IDP_ENV}"
export CF_ORG=gsa-login-prototyping
export CF_SPACE=USER_NAME
```

For SAML:

```bash
export REPO=identity-saml-sinatra
export SOURCE_ENV=dev
export SOURCE_APP="${SOURCE_ENV}-identity-saml-sinatra"
export APP_NAME="${USER}-identity-saml-sinatra"
export IDP_ENV=dev
export CF_ORG=gsa-login-prototyping
export CF_SPACE=USER_NAME
```

Every value above is meant to be edited. `dev` is only an example. If your deployment naming convention uses something other than your username, change `APP_NAME` directly.

When these values change:

- If `CF_ORG` changes, verify `CF_SPACE` again for that org.
- If you want the app to point at a different Login.gov environment, update `IDP_ENV` and the manifest settings that reference it.
- If your OIDC integration uses a different issuer or `client_id`, update `OIDC_CLIENT_ID` and the manifest values that reference it.
- If you want to copy from a different existing deployment, update `SOURCE_ENV` and `SOURCE_APP`.
- If you want a different Cloud.gov app name, change `APP_NAME`.

`SOURCE_APP` can be any existing deployment in your target space that is closest to what you need. It does not need to match your final app name or target IdP environment. For example, some teams may use a deployment such as `data-identity-oidc-sinatra` as the source manifest.

### Prerequisites

1. Ask to be added to the relevant Login.gov Cloud.gov org and space with permission to view and deploy apps.
2. Install the Cloud Foundry CLI:

```bash
brew install cloudfoundry/tap/cf-cli@8
```

3. Verify the CLI is working:

```bash
cf --version
cf api
cf target
cf apps
```

### Log in and target the correct space

```bash
cf login -a api.fr.cloud.gov --sso
cf target -o "$CF_ORG" -s "$CF_SPACE"
cf apps
```

Use `cf spaces` after selecting the org so you can confirm the correct `CF_SPACE` for that org before targeting it.

### Clone the sample app repo

These repos use GitLab as the primary source of truth. GitHub remains available as a public mirror.

```bash
git clone "git@github.com:GSA-TTS/${REPO}.git"
cd "$REPO"
```


### Copy a manifest from an existing deployment

Starting from an existing Cloud.gov app manifest is the easiest way to preserve routes, services, memory, and other deployment defaults.

This is the only place where `SOURCE_ENV` matters. Once you have copied the manifest, your new deployment is controlled by `APP_NAME` and the manifest values you edit next.

```bash
cf create-app-manifest "$SOURCE_APP"
cp "${SOURCE_APP}_manifest.yml" "${APP_NAME}-manifest.yml"
```

### Update the manifest

Edit `${APP_NAME}-manifest.yml` and treat the copied values as a template, not as fixed settings. Replace any copied app names, URLs, hosts, routes, usernames, or environment names with your own values. At minimum, update:

- `name`
- any `host`, `route`, or URL values that still reference the old app name
- any copied example values such as `dev`, `int`, or another engineer's app name
- the environment-specific settings listed below

#### OIDC settings

For `identity-oidc-sinatra`, keep the environment-specific values near each other so retargeting the app later is a small edit.

- `idp_environment`: set this to `IDP_ENV`
- `idp_url`: use `https://idp.IDP_ENV.identitysandbox.gov`
- `redirect_uri`: set this to `https://APP_NAME.app.cloud.gov/`
- `client_id`: set this to `OIDC_CLIENT_ID`; it should match the issuer registered in the Partner Portal
- `client_id_pkce`: update this only if your deployment also uses a separate PKCE client registration
- `attempts_shared_secret`, `sp_private_key`, or `sp_private_key_path`: keep these aligned with the environment and secrets your app needs

Template OIDC values:

```yaml
env:
  client_id: YOUR_OIDC_CLIENT_ID
  idp_environment: YOUR_IDP_ENV
  redirect_uri: https://YOUR_APP_NAME.app.cloud.gov/
```

Example: if `APP_NAME=malick-oidc-lab`, `IDP_ENV=int`, and `OIDC_CLIENT_ID=urn:gov:gsa:openidconnect.profiles:sp:sso:gcruzort`, then the deployed app would be named `malick-oidc-lab`, it would point at the `int` IdP, and it would identify itself to the IdP with that registered `client_id`.

#### SAML settings

For `identity-saml-sinatra`, update the SAML service provider values so they match your new app URL and chosen IdP environment.

- `issuer`
- `assertion_consumer_service_url`: usually `https://APP_NAME.app.cloud.gov/consume`
- `idp_sso_target_url`
- `idp_slo_target_url`
- `sp_cert` and `sp_private_key` when the target environment requires explicit keys

To switch environments, keep the path suffix from the source manifest and only replace the host unless you are intentionally rotating to a new certificate year. For lower environments, the host is usually `idp.IDP_ENV.identitysandbox.gov`. For production, use `secure.login.gov`. For example, if the source manifest uses `/api/saml/auth2024` and `/api/saml/logout2024`, keep those path suffixes and swap only the host. If `IDP_ENV` changes, these SAML URLs need to change too.

Template SAML values:

```yaml
env:
  issuer: urn:gov:gsa:SAML:2.0.profiles:sp:sso:YOUR_APP_NAME
  assertion_consumer_service_url: https://YOUR_APP_NAME.app.cloud.gov/consume
  idp_sso_target_url: https://idp.YOUR_IDP_ENV.identitysandbox.gov/api/saml/auth2024
  idp_slo_target_url: https://idp.YOUR_IDP_ENV.identitysandbox.gov/api/saml/logout2024
```

Example: if `APP_NAME=malick-saml-lab` and `IDP_ENV=int`, then the deployed app would be named `malick-saml-lab` and would point at the `int` IdP.

### Push the app

```bash
cf push "$APP_NAME" -f "${APP_NAME}-manifest.yml"
```

### Verify the deployment

1. Confirm the app is running:

   ```bash
   cf app "$APP_NAME"
   ```

2. Open `https://APP_NAME.app.cloud.gov`.
3. Start a sign-in flow and confirm the app redirects to the intended `IDP_ENV`.
4. For SAML, make sure the app is using the same certificate year as the target IdP metadata endpoint, for example `https://idp.IDP_ENV.identitysandbox.gov/api/saml/metadata2024`.

### Verify in the Cloud.gov dashboard

After the first push, confirm the deployed app is using the values you expect.

1. Sign in to <https://dashboard.fr.cloud.gov/applications>.
2. Open `APP_NAME` and confirm the Summary tab shows the app as started.
3. Open the Variables tab and compare the deployed values with your manifest.

For OIDC deployments, this checklist is a good starting point for lower environments. Treat copied secrets as deployment data, not as values to invent by hand.

| Variable | Expected value | Notes |
|---|---|---|
| `client_id` | `OIDC_CLIENT_ID` | Must match the issuer registered in the Partner Portal. |
| `ENABLE_LOGGING` | `true` | 
| `idp_domain` | `identitysandbox.gov` | 
| `idp_url` | `https://idp.IDP_ENV.identitysandbox.gov/` |
| `redirect_uri` | `https://APP_NAME.app.cloud.gov/` | The app later derives callback URLs from this base URL. |
| `semantic_ial_values_enabled` | `true` | Matches current Login.gov semantic IAL support. |
| `signed_events` | Keep the source deployment value if it is already set | Some working sandbox deployments carry this explicitly. |
| `sp_private_key_path` | `./config/demo_sp.key` or your Secrets Manager path | Upload the matching public certificate in the Partner Portal. |

4. Restart the app after changing variables. You can do that from the Cloud.gov dashboard app actions menu or with:

```bash
cf restart "$APP_NAME"
```

5. Wait for the app to return to a healthy state before testing again.

### Configure the Partner Portal for OIDC

This section applies to `identity-oidc-sinatra`. If you are deploying the SAML sample app, use the SAML metadata and certificate workflow instead.

This sandbox portal flow is for lower environments. 

1. Open the sandbox Partner Portal at `https://portal.IDP_ENV.identitysandbox.gov/` and sign in with a sandbox account. The public [Using the sandbox](https://developers.login.gov/testing/#using-the-sandbox) guide shows the same flow with `int`; for a named sandbox, replace `int` with your `IDP_ENV` in the hostname.
2. If you do not see the Admin tab and need to create or manage configurations, ask an existing admin to grant access. One internal path is:

```bash
aws-vault exec sandbox-power -- ./bin/ssm-instance --any "asg-${IDP_ENV}-portal"
sudo -su websrv
cd /srv/dashboard/current
rake users:make_admin USER=first.last@gsa.gov,First,Last
```

3. In the Partner Portal, create or update the OIDC configuration so it matches the app you just deployed.

Use these fields as the starting point:

| Portal field | What to use |
|---|---|
| App name | Any portal label your team will recognize. This does not have to equal `APP_NAME`. |
| Friendly name | Any readable label for the app |
| Identity protocol | `openid_connect_private_key_jwt` |
| Issuer | `OIDC_CLIENT_ID` |
| Level of service | Choose the lowest setting that still covers the flows you need to test. A common sample-app starting point is identity verification permitted. |
| Default AAL | Choose the default assurance level you want to test. A common starting point is `AAL2`. |
| Redirect URIs | Include `https://APP_NAME.app.cloud.gov/`, `https://APP_NAME.app.cloud.gov/auth/result`, and `https://APP_NAME.app.cloud.gov/logout` |
| Failure to proof URL | Usually `https://APP_NAME.app.cloud.gov/` |
| Post-IdV follow-up URL | Usually `https://APP_NAME.app.cloud.gov/` |
| Attribute bundle | Include the attributes and scopes your sample app needs to request |
| Certificate upload | Upload the public certificate that matches the private key configured in the app |

The exact values that need to line up with the deployed app are the issuer, redirect URIs, follow-up URLs, and certificate. The portal display names can be whatever your team prefers.

Pick the issuer carefully before saving. In practice, the Partner Portal issuer becomes the value you use for the app's `client_id`, and it is easier to treat that value as stable.

4. Save the configuration, then re-open it and confirm the issuer, redirect URIs, and uploaded certificate all match the Cloud.gov deployment.
5. Restart or re-push the app if you changed any app-side values after saving the portal configuration.
6. Open `https://APP_NAME.app.cloud.gov`, start a sign-in, complete the sandbox flow, and confirm the browser returns to the deployed app successfully.
