---
title: "Troubleshooting PIV/CAC logins"
description: "If somebody has trouble using their PIV/CAC with login.gov"
layout: article
category: "AppDev"
---

## Background

Using a PIV/CAC with login.gov relies on a certificate trust chain. The [identity-pki](https://github.com/18f/identity-pki)
repo tracks trusted issuing certificates in source control. We need to know that a certificate is used to issue PIVs
before we trust it (since not all certificates are used for issuing PIVs).

Related article: [Common OpenSSL command line recipes]({% link _articles/openssl-recipes.md %})

## Steps

If a user writes in that they can't log in to login.gov with their PIV and get errors like "The certificate you selected is invalid",
then we are probably missing an issuing certificate for their PIV. These steps outline how to find out what that certificate is,
and how to add it.

1. Get the user's email, and use it to get their UUID:

    ```ruby
    # in a production console
    User.find_with_email('user@example.gov').uuid
    ```

1. Look up their key ID in our logs in Cloudwatch Insights logs

    ```
    # prod_/srv/idp/shared/log/events.log
    fields @timestamp, properties.user_id, properties.event_properties.success, properties.event_properties.errors.type, properties.event_properties.key_id, @message
      | sort @timestamp desc
      | filter properties.user_id IN ['UUID from step 2 here']
      | filter properties.event_properties.success = 0
    ```
1. We log user's public certificates to an S3 bucket.
   Download the certificates based on the `key_id` in the previous steps to inspect them locally.

    <pre><code>export certificates_bucket=<a href="https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.lr6u13hz0psq">[see handbook appendix]</a></code></pre>

   ```bash
   # prefix search based on key ID
   aws s3 ls "s3://${certificates_bucket}/${key_id}"
   # prints out ${key_id}::{some_id}
   aws s3 cp "s3://${certificates_bucket}/${key_id_with_suffix}" .
   ```

1. Use the rails console in [identity-pki](https://github.com/18f/identity-pki) to inspect the certificate that was downloaded from S3,
   by using the [CertificateChainService](https://github.com/18F/identity-pki/blob/main/app/services/certificate_chain_service.rb).

    ```ruby
    cert = Certificate.new(OpenSSL::X509::Certificate.new(File.read("path/to/cert")))
    chain = CertificateChainService.new.debug(cert)
    ```

    It will print out a list of certificates, their issuers, and `key_id`s.

    ```
    ///////////////////////////////////////
    ///////////// [ CA Step: 0 ] /////////////
    ///////////////////////////////////////
    Subject: /C=US/O=U.S. Government/OU=Department of State/OU=PIV/OU=Certification Authorities/OU=U.S. Department of State PIV CA2
    Issuer: /DC=sbu/DC=state/CN=Configuration/CN=Services/CN=Public Key Services/CN=AIA/CN=U.S. Department of State AD Root CA
    -----BEGIN CERTIFICATE-----
    MIIJ5TCCB82gAwIBAgIEUbC5fzANBgkqhkiG9w0BAQsFADCBsTETMBEGCgmSJomT
    8ixkARkWA3NidTEVMBMGCgmSJomT8ixkARkWBXN0YXRlMRYwFAYDVQQDDA1Db25m
    ....
    ....
    -----END CERTIFICATE-----
    key_id: 8C:D6:D4:69:A9:E4:85:41:3A:6A:A6:5E:DA:51:1A:17:8D:92:8B:6C
    signing_key_id: CC:00:68:61:A6:A5:03:93:10:0A:1B:61:B7:87:18:C1:45:56:DA:82
    ca_issuer_dn: /DC=sbu/DC=state/CN=Configuration/CN=Services/CN=Public Key Services/CN=AIA/CN=U.S. Department of State AD Root CA
    ca_issuer_url: http://crls.pki.state.gov/AIA/CertsIssuedToDoSADRootCA.p7c
    fetching: http://crls.pki.state.gov/AIA/CertsIssuedToDoSADRootCA.p7c
    ///////////////////////////////////////

   ```

1. If a certificate is missing from our tracked issuing certificates, this will be `nil`:

    ```ruby
    key_id = '8C:D6:D4:69:A9:E4:85:41:3A:6A:A6:5E:DA:51:1A:17:8D:92:8B:6C'
    CertificateStore.instance[key_id]
    # => nil
    ```

    Load all the missing certs in the chain:

    ```ruby
    missing = CertificateChainService.new.missing(cert)
    # => [Certificate .... ]
    ```

1. If you want to add a certificate to our repo, write the PEM data to an appropriately named file in `config/certs`

    - `Certificate#pem_filename` creates a filename that matches our file naming conventions based on the Subject
    - `Certificate#to_pem` outputs the Subject + Issuer in addition to the PEM

    ```ruby
    missing.first.pem_filename
    # => "C=US, O=U.S. Government, OU=Department of State, OU=PIV, OU=Certification Authorities, OU=U.S. Department of State PIV CA2.pem"
    missing.each do |cert|
      File.open("config/certs/#{cert.pem_filename}", 'w') { |f| f.puts cert.to_pem }
    end
    ```

    1. Test that the certificate was added correctly by **closing and opeining the Rails console** (the certificates are loaded by [`config/initializers/`](https://github.com/18F/identity-pki/blob/main/config/initializers/certificate_store.rb) so it's easier than manually running the initializer)

        ```ruby
        key_id = '8C:D6:D4:69:A9:E4:85:41:3A:6A:A6:5E:DA:51:1A:17:8D:92:8B:6C'
        CertificateStore.instance[key_id]
        => #<Certificate:0x00007fd564fa89a8 ...>
        ```

    1. Commit the new `.pem` to source control and make a pull request

    1. Once merged, deploy the change to **INT** and ask the reporters to confirm the fixes
