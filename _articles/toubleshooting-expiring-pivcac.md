---
title: "Troubleshooting expiring PIV/CAC certs"
description: "Guide on finding new certs if a cert is expiring"
layout: article
category: "AppDev"
---

Whenever a certificate is due to expire, we should verify that a replacement is
in place and remove the expiring cert.
PIV issuers will usually issue a new certificate which will have a later
expiration and probably a new subject key and subject key ID.

The best place to look for a re-issued certificate is on the signing cert for
that certificate.
Within the PKI sphere, signing or parent cert will have a "Subject Information
Access" extension.
This extension will contain a URL to a repository containing the bundle of
certificates issued by the signing cert.

You can manually inspect the cert, download the bundle, and search for the
replacement, or you can use the `certs:find_replacement` rake task.
The rake task will make a best effort to locate the certificate and add it to
the repository.

Finding replacement certificates is tricky because there are a lot of edge
cases.
A group that issues PIVs may change the structure of their branch of the PKI graph.
Also, if the signing cert has been re-issued, and the replacement cert was issued
with the new signing cert you may need to go further up the tree.

Moreover, replacement certificates are often re-issued well before they expire,
and PIVs are issued with the new certs.
This means that often times the new certificate will already be in place.
Be careful about adding duplicates.

## Using the cert:find_replacement rake task

The `certs:find_replacement` rake task will make a best effort to find a
replacement for a cert and save it for you.

To run the rake task, invoke it like this:

```shell
# Replace the following with the expiring cert key ID:
EXPORT expiring_key_id='CF:79:3C:ED:4D:BC:19:25:F2:45:69:4E:12:2F:9C:29:53:C9:A7:46'
bundle exec rake certs:find_replacement\[$expiring_key_id\]
```

This will display all of the certs that are potential replacements:

```
- Index: 0
  Expiration: 2029-06-22 13:53:22 UTC
  Subject: /C=US/O=U.S. Government/OU=Department of Veterans Affairs/OU=Certification Authorities/OU=Department of Veterans Affairs CA
  Issuer: /C=US/O=U.S. Government/OU=Department of the Treasury/OU=Certification Authorities/OU=US Treasury Root CA
  SHA1 Fingerpint: 76cc898f03eb0fc7e0877aac30a0c1340bb34879
  Key ID: DA:9C:B6:1F:FF:67:9D:47:91:0D:26:E7:29:66:14:65:97:E6:80:58
  In Certificate Store: false
- Index: 1
  Expiration: 2025-10-17 14:31:27 UTC
  Subject: /C=US/O=U.S. Government/OU=Department of Veterans Affairs/OU=Certification Authorities/OU=Department of Veterans Affairs CA
  Issuer: /C=US/O=U.S. Government/OU=Department of the Treasury/OU=Certification Authorities/OU=US Treasury Root CA
  SHA1 Fingerpint: e2edb0df1fe8068717a08e38741b5bc4c38029d0
  Key ID: 75:61:DA:1F:31:92:6E:2E:2A:64:5E:A3:65:19:85:65:80:E8:C7:2B
  In Certificate Store: true

Which cert(s) would you like to download? Use the format 1,2 if selecting multiple.
Press enter to skip
```

You can select the index of a cert to add it to the store.
The test suite should validate that the certificate is valid and signed by a trusted root.
You can run `bundle exec rspec spec/certs/store_spec.rb` to validate this.

## Using the Subject Information Access extension

It is possible to use openssl to perform the checks this rake task performs in
you terminal.

First determine which certificate is the signing key for the expiring cert.
You can do this by using the rails console.

Next, look up the SIA endpoint for the signing key:

```shell
# Replace the following with the path to the expiring cert's signing cert's file
export signing_key_path='config/certs/C=US, O=U.S. Government, OU=Department of the Treasury, OU=Certification Authorities, OU=US Treasury Root CA.pem'
openssl x509 -noout -text -in $signing_key_path
```

Look for the following in the output:

```
Subject Information Access:
    CA Repository - URI:http://pki.treasury.gov/root_sia.p7c
```

Next, download the p7c bundle for the repository:

```shell
curl http://pki.treasury.gov/root_sia.p7c -o tmp/bundle.p7c
```

Finally, read in the certificates from the bundle and look for a replacement:

```shell
openssl pkcs7 -inform DER -in tmp/bundle.p7c -print_certs -text
```
