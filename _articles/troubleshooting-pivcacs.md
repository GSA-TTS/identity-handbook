---
title: "Troubleshooting PIV/CAC login certificate chains"
description: "Diagnose an invalid PIV/CAC login and resolve missing issuing certificates"
layout: article
subcategory: "X509 and PIV/CAC Certificates"
category: "AppDev"
---

## Background

Login.gov validates a PIV/CAC by building a certificate chain to a trusted root.
The [identity-pki](https://github.com/18f/identity-pki) repository gets most
trusted intermediate and root certificates from the generated FICAM bundle at
`config/cert_bundles/ficam_bundle.pem`. The `config/certs` directory contains
only exceptions that are required for validation and are not available in the
FICAM bundle.

Use this guide to investigate a specific login failure. For scheduled
certificate expiration, replacement, or removal work, see
[Troubleshooting expiring PIV/CAC certs]({% link _articles/troubleshooting-expiring-pivcac.md %}).

Related article: [Common OpenSSL command line recipes]({% link _articles/openssl-recipes.md %})

## Retrieve the presented certificate

An invalid-certificate error can be caused by expiration, revocation, policy,
or an incomplete certificate chain. Do not assume that an issuing certificate
is missing before validating the certificate.

1. Get the user's UUID with [`uuid-lookup`]({% link _articles/devops-scripts.md %}#uuid-lookup)
   or [`salesforce-email-lookup`]({% link _articles/devops-scripts.md %}#salesforce-email-lookup).
1. Download the user's public certificate from S3 with
   [`oncall/download-piv-certs`]({% link _articles/devops-scripts.md %}#oncalldownload-piv-certs).

The certificate subject can contain identifying information. Keep the file out
of tickets and public chat, and delete the local troubleshooting copy according
to team data-handling practices when the investigation is complete.

## Validate against the current store

From the `identity-pki` repository, run:

```shell
bundle exec rake 'certs:validate_client_cert[path/to/cert.pem]'
```

This reports whether the certificate validates against the currently loaded
FICAM bundle and any exceptions in `config/certs`. A valid result confirms the
local certificate chain, but it does not rule out a different problem in the
deployed environment or login flow.

## Refresh the FICAM bundle

Before adding an individual certificate, regenerate the primary certificate
source:

```shell
bundle exec rake certs:generate_certificate_bundles
git diff -- config/cert_bundles/ficam_bundle.pem
bundle exec rake certs:check_certificate_bundle
bundle exec rake 'certs:validate_client_cert[path/to/cert.pem]'
```

Review the bundle diff for the expected additions or removals and for unrelated
churn. If the refreshed FICAM bundle fixes validation, commit the bundle change.
Do not also add the same certificate to `config/certs`.

## Investigate a missing chain

If validation still fails because the issuing chain is incomplete, inspect the
missing certificates in the Rails console:

```ruby
cert = Certificate.new(OpenSSL::X509::Certificate.new(File.read("path/to/cert.pem")))
missing = CertificateChainService.new.missing(cert)

missing.each do |certificate|
  puts "Subject: #{certificate.subject}"
  puts "Issuer: #{certificate.issuer}"
  puts "Key ID: #{certificate.key_id}"
  puts "Expiration: #{certificate.not_after}"
end
```

Alternatively, use the interactive task:

```shell
bundle exec rake 'certs:find_missing_intermediate_certs[path/to/cert.pem]'
```

The task follows issuer metadata, excludes certificates already available from
the configured sources, and prompts before saving a candidate to `config/certs`.
Before answering `y`, confirm that the candidate:

- is a certificate authority required by the presented chain;
- is absent from the refreshed FICAM bundle;
- has the expected subject, issuer, key ID, and expiration; and
- is appropriate for Login.gov to trust.

Do not paste full certificate PEM or raw repository responses into tickets or
shared logs.

## Verify an exception

After saving a reviewed exception, run:

```shell
bundle exec rspec spec/certs/store_spec.rb
bundle exec rake 'certs:validate_client_cert[path/to/cert.pem]'
git diff -- config/certs config/cert_bundles/ficam_bundle.pem
```

Confirm that the new PEM is the intended certificate, no duplicate was added,
and the bundle has no unrelated changes. Commit the reviewed certificate change,
open a pull request, deploy it to **INT**, and ask the reporter to confirm the
login works.