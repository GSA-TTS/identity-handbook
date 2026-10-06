---
title: "Troubleshooting expiring PIV/CAC certs"
description: "Identify, replace, or remove expiring PIV/CAC certificate authorities"
layout: article
subcategory: "X509 and PIV/CAC Certificates"
category: "AppDev"
redirect_from: /articles/toubleshooting-expiring-pivcac.html
---

Whenever a certificate authority is due to expire, verify whether a replacement
is available and determine whether the expiring certificate is still needed.
PIV issuers usually publish a replacement with a later expiration and often a
new subject key and subject key ID.

Most trusted intermediate and root certificates come from the generated FICAM
bundle at `config/cert_bundles/ficam_bundle.pem`. The `config/certs` directory
contains only exceptions that are required for validation and are not available
in the FICAM bundle.

Use this guide for scheduled certificate lifecycle work. For a specific PIV/CAC
login failure, see
[Troubleshooting PIV/CAC login certificate chains]({% link _articles/troubleshooting-pivcacs.md %}).

## Identify expiring certificates

From the `identity-pki` repository, list certificates that expire within the
next 30 days:

```shell
bundle exec rake 'certs:print_expiring[30]'
```

The argument is the deadline in days and defaults to 30. The task checks the
complete loaded store, including the FICAM bundle and exceptions in
`config/certs`. It exits with a nonzero status when it finds an expiring
certificate so it can be used by scheduled checks.

## Identify the certificate source

List the certificates provided by FICAM:

```shell
bundle exec rake certs:list_ficam_certs
```

Match the expiring certificate's key ID or subject against this output. If it is
listed, follow the FICAM workflow below. Otherwise, look for its PEM file in
`config/certs` and follow the exception workflow.

## Refresh the FICAM bundle

Generate the bundle from GSA's current published source:

```shell
bundle exec rake certs:generate_certificate_bundles
git diff -- config/cert_bundles/ficam_bundle.pem
bundle exec rake certs:check_certificate_bundle
bundle exec rake certs:list_ficam_certs
bundle exec rspec spec/certs/store_spec.rb
```

Review the diff before committing it. Confirm that expected replacements were
added or removed and that there is no unrelated churn.

`certs:check_certificate_bundle` verifies that the bundle exists, can be parsed,
and contains certificate authorities. The store spec provides the additional
repository validation. Neither check determines whether a newly published
certificate is the operational replacement for a particular issuer, so review
the subject, issuer, key ID, and expiration.

Do not edit `ficam_bundle.pem` by hand. Regeneration overwrites manual changes.
Regeneration also does not remove a certificate merely because it expired; a
certificate disappears only after GSA removes it from the published bundle. If
GSA still publishes an expiring or expired certificate without a replacement,
check FPKI notifications and activity logs before escalating the issue.

## Investigate an exception certificate

For a certificate maintained in `config/certs`, the signing certificate may
contain a Subject Information Access (SIA) extension with a CA Repository URL.
That repository contains certificates issued by the signing certificate.

Use the Rails console to locate the expiring certificate and its signing
certificate by key ID:

```ruby
expiring_key_id = "EXPIRING:CERTIFICATE:KEY:ID"
expiring_cert = CertificateStore.instance[expiring_key_id]
signing_cert = CertificateStore.instance[expiring_cert.signing_key_id]

puts signing_cert.subject_info_access
File.write("tmp/signing-cert.pem", signing_cert.to_pem)
```

You can also inspect the SIA extension with OpenSSL:

```shell
openssl x509 -noout -text -in tmp/signing-cert.pem
```

Look for a CA Repository URI, download its PKCS7 bundle, and inspect the
certificates. Replace the URL with the URI from the signing certificate:

```shell
curl 'https://example.gov/path/to/ca-repository.p7c' -o tmp/ca-repository.p7c
openssl pkcs7 -inform DER -in tmp/ca-repository.p7c -print_certs -text
```

Compare candidate subjects, issuers, key IDs, and expiration dates. A PKI branch
may have been reorganized, or the replacement may have been issued by a
replacement signing certificate farther up the chain. Also check that the
candidate is not already present in the refreshed FICAM bundle or
`config/certs` before adding an exception.

The `certs:find_missing_intermediate_certs` task is for troubleshooting a
presented PIV/CAC chain with missing intermediates. It is not a replacement
finder for an expiring certificate authority.

## Check FPKI notifications

If a replacement is not available, it may not have been issued yet. GSA's FICAM
program publishes
[notifications for Federal PKI ecosystem changes](https://www.idmanagement.gov/fpki/notifications/#notifications).
Check for a notice describing whether a replacement is expected before the
scheduled expiration.

## Handle certificates without replacements

If no replacement is available near or after the expiration date, the
certificate may be expected to expire without replacement.

1. Check PKI activity over the weeks leading up to expiration to understand the
   expected impact:

    ```text
    # Log group: prod_/srv/pki-rails/shared/log/production.log
    filter issuer like /CN=[CN of expiring certificate]/
    ```

2. If the certificate is an exception in `config/certs`, remove its PEM file
   only after it has expired, no replacement exists, and the activity review
   indicates that removal will not affect users.

For a FICAM certificate, do not remove it manually from the generated bundle.
If GSA continues to publish an expired certificate and it creates an operational
problem, escalate the upstream bundle issue with the evidence gathered from
notifications and logs.

## Find issuers and service providers in CloudWatch

CloudWatch can identify certificate activity and errors by issuer and service
provider. Open[CloudWatch Logs Insights](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:logs-insights)
and query for the issuer and service provider 