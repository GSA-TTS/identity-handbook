---
title: "SAML: Development"
layout: article
category: AppDev
subcategory: "Development"
description: "High-level overview of the flow of SAML in the IDP code"
---

Just a place to collect helpful SAML links and/or discussion on how the SAML code in IDP works.

## Sample flow through code
Starts in the IdP ([18f/identity-idp](https://github.com/18f/identity-idp))
```
SamlIdpController#auth
SamlIdpController#handle_successful_handoff
SamlIdpAuthConcern#saml_response
```

Then calls in to the our fork of the saml_idp gem ([18f/saml_idp](https://github.com/18f/saml_idp))
```
SamlIdp::Controller#encode_response
SamlIdp::Controller#encode_authn_response
SamlIdp::SamlResponse#build
SamlIdp::Signable#signed
SamlIdp::AssertionBuilder#raw
```

## Tools

* [SAML Online Developer Tools](https://www.samltool.com/online_tools.php)
  * This is an essential resource that includes examples of valid requests/responses and tools to encrypt/decrypt/validate SAML XML.
* In Firefox
  * [SAML-tracer extension](https://addons.mozilla.org/en-US/firefox/addon/saml-tracer/)
    * This extension is great for tracing all of your http traffic, but has specific tools to look at the SAML being passed back and forth.
* In Chrome
  * [SAML-tracer extension](https://chrome.google.com/webstore/detail/saml-tracer/mpdajninpobndbfcldcmbpnnbhibjmch?hl=en)
    * Same as above, but in Chrome!
  * [SAML DevTools extension](https://chrome.google.com/webstore/detail/saml-devtools-extension/jndllhgbinhiiddokbeoeepbppdnhhio)
    * Adds a SAML tab to the Chrome developer tools

## Testing with SAML-sinatra

The SAML Sample app receives encrypted responses by default, but there is now an option to skip the encryption if desired so the response XML can be inspected in the browser tools listed above.

## Invalid Signature

If, when logging in to the SAML Sinatra sample app, you get an error saying:

> Authentication Error! <br/>
> Invalid Signature on SAML Response.

This is usually caused by a mismatch between the IdP certificate used to sign the response, and the recorded signature of the certificate which is saved in the environment variable `idp_cert_fingerprint` (either in config/application.yml, or the environment variables in the deployed environment).

To fix this, you'll first need to get the X509 Certificate from the appropriate SAML metadata endpoint, ie [https://idp.dev.identitysandbox.gov/api/saml/metadata2024](https://idp.dev.identitysandbox.gov/api/saml/metadata2024) for [https://dev-identity-saml-sinatra.app.cloud.gov/](https://dev-identity-saml-sinatra.app.cloud.gov/).  

The local `identity-saml-sinatra` app uses the certificate from `identity-idp`, so that XML can be found at [identity-idp/config/artifacts.example/local/saml${YEAR}.crt](https://github.com/18F/identity-idp/tree/main/config/artifacts.example/local/).

Edit it to look like a normal certificate (or find the orig), e.g.,
```
-----BEGIN CERTIFICATE-----
MII/KeepCopyingButBreakItUpInto64CharacterLinesWhenYouSaveItHere
...
TheLastLineMayNotBeExactly64CharactersAndThatsOK=
-----END CERTIFICATE-----
```
and finally calculate the fingerprint:
```
$ openssl x509 -noout -fingerprint -sha1 -inform pem -in file.crt
SHA1 Fingerprint=AB:CD:EF:12:34:56:78:90:A1:B2:C3:D4:E5:F6:1A:2B:3C:4D:5E:6F
```
