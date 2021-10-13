---
title: "GitLab"
description: "GitLab Setup"
layout: article
category: Infrastructure
---

## Authentication

GitLab leverages OmniAuth to allow users to sign in using a variety of sersvices, including Login.gov (via SAML). To configure this:

1. Generate a cert and private key by following the instructions at <https://developers.login.gov/testing/#creating-a-public-certificate>:
```
openssl req -nodes -x509 -days 365 -newkey rsa:2048 -keyout private.pem -out public.crt
```

1. Grab the IDP sandbox signing certificate from <https://developers.login.gov/saml/> and get its fingerprint:
```
curl -s https://idp.int.identitysandbox.gov/api/saml/metadata2021 \
| xml sel -N x="http://www.w3.org/2000/09/xmldsig#" -t -v '(//x:X509Certificate)[1]' \
| openssl x509 -in ~/idp_staging.crt -noout -fingerprint | sed -E 's/.*=//'
```

1. Copy the IDP cert fingerprint, generated certificate, and generated private key to the per-enviroment S3 secrets bucket. Name them `saml_idp_cert_fingerprint`, `saml_certificate` and `saml_private_key`, respectively:
```
aws s3 cp - "s3://${SECRET_BUCKET}/alpha/saml_private_key" --no-guess-mime-type --content-type="text/plain" --metadata-directive="REPLACE"
    [...]
```

1. With the public cert generated above, and replacing `$ENVIRONMENT`, configure a test integration at http://dashboard.int.identitysandbox.gov with the following parameters:
  - Issuer: `urn:gov:gsa:openidconnect.profiles:sp:sso:login_gov:gitlab_$ENVIRONMENT`
  - Return to App URL: `'https://gitlab.$ENVIRONMENT.gitlab.identitysandbox.gov'`
  - Identity Assurance Level (IAL):  `IAL1`
  - Attribute_bundle: `email`
  - Identity Protocol: `saml`
  - Assertion Consumer Service URL: `'https://gitlab.$ENVIRONMENT.gitlab.identitysandbox.gov/users/auth/saml/callback'`
  - SAML Assertion Encryption: `'aes256-cbc'`
