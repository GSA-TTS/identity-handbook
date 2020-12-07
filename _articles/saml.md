---
title: "SAML: Development"
layout: article
category: AppDev
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

One difficulty is that the response is encrypted, so it's hard to use tools to just see the contents of the response. The easiest way to get around this is to modify your local idp's Gemfile to pick up a local copy of the `saml_idp` gem, then comment out everything in `SamlResponse#signed_assertion` [except the line](https://github.com/18F/saml_idp/blob/master/lib/saml_idp/saml_response.rb#L70) `assertion_builder.signed`.
