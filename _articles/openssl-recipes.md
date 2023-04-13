---
title: "OpenSSL Command Line Recipes"
description: "Commands for common certificate tasks, useful for PIV/CAC or AAMVA credentials"
layout: article
subcategory: "X509 and PIV/CAC Certificates"
category: "AppDev"
---

For all these commands, we use `$cert_path`, here's an example cert:

```bash
cert_path="config/certs/C=US, O=U.S. Government, OU=FPKI, CN=Federal Bridge CA G4.pem"
```

## Get SHA-1 Fingerprint

One use of the SHA-1 fingerprint is clients like the [identity-saml-sinatra][identity-saml-sinatra-fingerprint]
that verify the IDP's certificate.

Key arguments: `-fingerprint -sha1` (`-sha1` is the default)

```bash
openssl x509 -fingerprint -sha1 -noout -in "$cert_path"
SHA1 Fingerprint=85:1C:1A:F4:FC:F3:68:48:BC:6F:94:8E:B7:AC:F8:62:E0:BE:1E:1A
```

[identity-saml-sinatra-fingerprint]: https://github.com/18F/identity-saml-sinatra/blob/fcfa223d76eae74b37077b94c1dfe6820e2eec50/.env.example#L6

## Get SHA256 Fingerprint

Key arguments: `-fingerprint -sha256`

```bash
openssl x509 -fingerprint -sha256 -noout -in "$cert_path"
SHA256 Fingerprint=B9:76:75:E4:9A:53:F6:BA:37:AA:D5:D1:38:11:65:DD:1F:5D:9F:9C:DE:52:3C:38:28:B5:4D:B0:96:34:17:7F
```

## Print Text Summary

Key argument: `-text`

```bash
openssl x509 -text -noout -in "$cert_path"
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 31124 (0x7994)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=U.S. Government, OU=FPKI, CN=Federal Common Policy CA
        Validity
            Not Before: Dec 12 17:38:21 2019 GMT
            Not After : Dec 12 17:38:13 2021 GMT
# ...
```
<details>
  <summary>
    View full output
  </summary>
<pre><code>Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 31124 (0x7994)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=U.S. Government, OU=FPKI, CN=Federal Common Policy CA
        Validity
            Not Before: Dec 12 17:38:21 2019 GMT
            Not After : Dec 12 17:38:13 2021 GMT
        Subject: C=US, O=U.S. Government, OU=FPKI, CN=Federal Bridge CA G4
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:e5:27:14:58:00:81:01:40:68:61:89:4c:cd:31:
                    65:ab:55:44:af:c9:0e:0b:73:ee:a5:b6:af:8b:ea:
                    5f:b4:db:7c:0e:b1:af:95:15:d7:33:09:42:50:1d:
                    3f:6f:ef:98:14:5d:0f:91:42:91:4e:ce:fa:7c:c6:
                    9e:a3:cf:ba:c6:b5:28:fd:6a:fa:cf:c3:79:fd:73:
                    69:e1:92:0f:2c:1d:08:58:c9:f9:33:32:b5:cc:ab:
                    18:77:43:01:0b:84:c1:b0:64:75:10:64:c6:56:af:
                    c5:6b:d1:5c:31:f0:37:5d:84:6c:72:43:0a:72:bf:
                    b1:ae:b2:35:70:27:bf:6a:11:db:88:df:c7:e5:ea:
                    1c:5a:8e:ef:0b:ad:f3:7c:a0:11:5e:0e:15:a9:00:
                    ce:83:8a:9d:2f:63:ad:13:2b:6c:a6:56:84:6f:23:
                    cc:f2:dc:6c:b8:7e:33:a5:49:b9:e3:c0:da:5f:d2:
                    49:ce:c8:a5:d8:c5:80:9d:99:49:88:6d:e5:59:7d:
                    f2:0a:fa:93:71:89:dc:7d:ea:48:43:e8:5f:ea:e7:
                    0f:fb:42:72:39:d2:ca:e9:28:65:11:ce:19:09:80:
                    68:20:6f:64:9f:03:b7:72:61:53:69:b6:f9:74:d4:
                    1e:dd:c3:0d:df:d3:6b:eb:52:89:75:55:4c:27:fb:
                    7e:df
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:TRUE
            Authority Information Access:
                CA Issuers - URI:http://http.fpki.gov/fcpca/caCertsIssuedTofcpca.p7c

            X509v3 Policy Mappings:
                2.16.840.1.101.3.2.1.3.6:2.16.840.1.101.3.2.1.3.3, 2.16.840.1.101.3.2.1.3.7:2.16.840.1.101.3.2.1.3.12, 2.16.840.1.101.3.2.1.3.16:2.16.840.1.101.3.2.1.3.4, 2.16.840.1.101.3.2.1.3.8:2.16.840.1.101.3.2.1.3.37, 2.16.840.1.101.3.2.1.3.36:2.16.840.1.101.3.2.1.3.38
            X509v3 Certificate Policies:
                Policy: 2.16.840.1.101.3.2.1.3.6
                Policy: 2.16.840.1.101.3.2.1.3.7
                Policy: 2.16.840.1.101.3.2.1.3.8
                Policy: 2.16.840.1.101.3.2.1.3.13
                Policy: 2.16.840.1.101.3.2.1.3.16
                Policy: 2.16.840.1.101.3.2.1.3.1
                Policy: 2.16.840.1.101.3.2.1.3.2
                Policy: 2.16.840.1.101.3.2.1.3.14
                Policy: 2.16.840.1.101.3.2.1.3.15
                Policy: 2.16.840.1.101.3.2.1.3.17
                Policy: 2.16.840.1.101.3.2.1.3.18
                Policy: 2.16.840.1.101.3.2.1.3.19
                Policy: 2.16.840.1.101.3.2.1.3.20
                Policy: 2.16.840.1.101.3.2.1.3.36
                Policy: 2.16.840.1.101.3.2.1.3.39
                Policy: 2.16.840.1.101.3.2.1.3.40
                Policy: 2.16.840.1.101.3.2.1.3.41

            Subject Information Access:
                CA Repository - URI:http://repo.fpki.gov/bridge/caCertsIssuedByfbcag4.p7c

            X509v3 Policy Constraints: critical
                Require Explicit Policy:0, Inhibit Policy Mapping:2
            X509v3 Inhibit Any Policy: critical
                0
            X509v3 Key Usage: critical
                Certificate Sign, CRL Sign
            X509v3 Authority Key Identifier:
                keyid:AD:0C:7A:75:5C:E5:F3:98:C4:79:98:0E:AC:28:FD:97:F4:E7:02:FC

            X509v3 CRL Distribution Points:

                Full Name:
                  URI:http://http.fpki.gov/fcpca/fcpca.crl

            X509v3 Subject Key Identifier:
                79:F0:00:49:EB:7F:77:C2:5D:41:02:65:34:8A:90:23:9B:1E:07:6F
    Signature Algorithm: sha256WithRSAEncryption
         1b:bf:d1:54:a9:14:90:78:96:c4:73:63:79:ea:4b:95:75:87:
         b9:8f:97:e3:77:9a:f6:eb:cd:6e:35:d3:4b:2d:01:e4:8e:f7:
         21:ed:98:18:38:aa:41:a3:17:74:d0:6b:24:95:8b:0c:15:29:
         7b:99:e4:71:2c:3f:f3:05:f4:4f:70:42:ad:22:b0:02:70:bc:
         9d:9a:73:06:03:7d:aa:4d:36:ed:f8:58:2a:ed:a6:8e:12:5c:
         cd:cc:ca:e5:7a:cd:43:de:93:b2:2d:aa:66:95:c4:83:0f:b9:
         0a:72:dd:0a:3d:1d:46:df:2b:16:80:a3:34:e5:4d:4a:45:df:
         f3:a1:5d:07:3f:8d:7a:14:35:6f:cf:50:1f:8a:79:56:a2:6b:
         a2:38:67:36:61:21:8e:7c:1d:81:ee:f0:6e:75:64:b8:9d:a8:
         b8:bb:82:84:bb:ab:e1:84:4a:ae:68:7d:55:c7:ab:29:50:fb:
         c7:1f:50:8d:ec:87:5a:11:d7:ab:65:e7:04:e5:45:1e:e2:e4:
         28:67:a5:19:bf:58:62:8e:20:a2:b7:1a:1c:e6:0c:19:06:86:
         41:5d:f0:da:e0:d2:a7:97:bf:96:6e:1e:52:e7:91:21:da:a8:
         87:70:ec:05:bf:d8:e7:d1:8f:22:bc:ae:67:d9:a0:b8:3e:a5:
         69:88:fd:9a
</code></pre>
</details>

## Convert PKCS7 (`.p7b`) to PEM

Sometimes Cerficate Authority certs are available in PKCS7 format but we need them in PEM format for our app.

For these examples, we'll use a variable `$p7b_path`

```bash
p7b_path="/path/to/your.p7b"
```

1. Figure out what encoding the `.p7b` is

    - If the `file` identities the file as "data", then it's likely in the binary **DER** format
    - Otherwise it's probably the ASCII **PEM** format already

    ```bash
file "$p7b_path"
file.p7b: data
    ```

2. Convert the file, it prints to stdout. This Ruby script will take the PEM files and write them to files that match our PKI naming convention:

    ```bash
openssl pkcs7 -print_certs \
    -in "$p7b_path" \
    -inform der \
    -outform pem | \
    ruby -r openssl \
         -e 'STDIN.read.split("\n\n").each_with_index { |cert, i| subject = OpenSSL::X509::Certificate.new(cert).subject.to_s(OpenSSL::X509::Name::COMPAT); File.open("config/certs/#{subject} #{"%02d" % i}.pem", "w") { |f| f.puts cert } }'
    ```

## Convert PKCS12 (`.pfx`) to PEM

PFX contains a public-private key pair. It may be protected by a password, and if so, the commands
below will prompt for the password on stdin. Is the password from AAMVA and OpenSSL isn't accepting it?
See notes about [Password Encoding from AAMVA](#password-encoding-from-aamva) below.

For these examples, we'll read from `$pfx_path` and export to `$private_pem` and `$public_pem`.

```bash
pfx_path="/in/some.pfx"
private_pem="/out/private.pem"
public_pem="/out/public.pem"
```

1. Export the private key

    ```bash
openssl pkcs12 \
    -in "$pfx_path" \
    -nocerts \
    -out "$private_pem" \
    -nodes
    ```

2. Export the public key

    ```bash
openssl pkcs12 \
    -in "$pfx_path" \
    -clcerts \
    -out "$public_pem" \
    -nodes
    ```

#### Password Encoding from AAMVA

These instructions may be hyper-specific to AAMVA and their processes, but hopefully they can be
useful to somebody else in the future.

AAMVA sent a password in a `.txt` file that was UTF-16LE encoded, with control characters embedded.
Specifically, the UTF Byte order mark (BOM), which is in the file but not a valid part of the password.
The BOM as hexadecimal is `FEFF`, so if you look at the file in Ruby it might look like:

```ruby
File.read('password.txt')
=> "\xFF\xFE...."
```

A few ways to convert the password so that OpenSSL accepted it:

* TextEdit on macOS

    1. Open the file in TextEdit
    1. Duplicate it (shift-cmd-S)
    1. Save it (cmd-S) as a new file
    1. Choose UTF-8 as the encoding

* Ruby

    ```ruby
File.open('out.txt', 'w') do |out|
    out.write File.read('in.txt', mode: 'rb', encoding: 'UTF-16LE').encode('UTF-8')
end
    ```
