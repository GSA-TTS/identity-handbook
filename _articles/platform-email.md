---
title: "Email Routing"
description: "Inbound and outbound SMTP information"
layout: article
category: Platform
cSpell: ignore DMARC DNSSEC nameserver
---

## Overview

Login.gov uses GMail for organizational email and AWS SES for outbound transactional email to users.

In order to serve the public it is important that email is delivered reliably to the public
when they sign up or make account changes.  It is also important that Login.gov team
members receive email in order to support the public and agency partners.

This page provides an overview of how email is delivered to and sent from `@login.gov`
addresses.  It includes command line examples showing how to check current DNS records
and other SMTP related settings.  Unless otherwise specified, all DNS records are served
by AWS Route53 and all configuration is managed as code with Terraform.

## Inbound Delivery to @login.gov

## GMail In

Inbound email to `@login.gov` is directed by DNS MX records which list the SMTP servers
that can receive email for `@login.gov` addresses:

~~~
$ nslookup -type=mx login.gov
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
login.gov	mail exchanger = 30 aspmx2.googlemail.com.
login.gov	mail exchanger = 30 aspmx3.googlemail.com.
login.gov	mail exchanger = 30 aspmx4.googlemail.com.
login.gov	mail exchanger = 30 aspmx5.googlemail.com.
login.gov	mail exchanger = 10 aspmx.l.google.com.
login.gov	mail exchanger = 20 alt1.aspmx.l.google.com.
login.gov	mail exchanger = 20 alt2.aspmx.l.google.com.
~~~

__Note - The top Server and Address lines show this lookup used the machine's local resolver.
Your tests may show a different address.   In addition, note the `Non-authoratative answer:` and
`Authoratative answers can be found from:` lines are due to using a forwarder instead of querying
the authoritative DNS servers for login.gov directly.  See [Querying Authoritative DNS Servers](#querying-authoritative-dns-servers) if you wish to query login.gov's authoritative DNS servers directly in cases of suspected DNS cache issues.__

### SMTP MTA Strict Transport Security (MTA-STS)

MTA-STS is roughly the equivalent of [HTTP Strict Transport Security (HSTS)](https://tools.ietf.org/html/rfc6797)
for email.  It allows a domain to specify that all inbound email to the domain must use TLS
and explicitly lists which names are allowed on the certificates used by receiving mail servers.

Implementation of MTA-STS requires both DNS and serving a web page that contains the policy for
the domain.  This allows end to end trust to be formed between the sending email system and
receiving system using the same trust framework used for HTTPS.

**WARNING - If receiving email servers are added or removed for login.gov, changes must be reflected
in the MTA-STS policy to prevent inbound email to `@login.gov` addresses from bouncing.**

Due to the complexity in properly serving MTA-STS, Login.gov developed a Terraform based method
that:
* Defines the list of MXes in code
* Builds the policy file and pushes it to S3
* Serve the policy file through an AWS CloudFront distribution
* Publishes a `_mta-sts.login.gov` TXT record using a fingerprint of the file in the `id` field
* Publishes a ` _smtp._tls.login.gov` TXT record defining what email addresses should receive MTA-STS delivery reports

To manually check the MTA-STS configuration:

* Fetch the current policy from https://mta-sts.login.gov/.well-known/mta-sts.txt
* Check the MTA-STS TXT record:

~~~
$ nslookup -type=txt _mta-sts.login.gov
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
_mta-sts.login.gov	text = "v=STSv1; id=59784add0f027f4ce93efbe6bc286e1a"
~~~

* Check the reporting record:

~~~
$ nslookup -type=txt _smtp._tls.login.gov
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
_smtp._tls.login.gov	text = "v=TLSRPTv1;rua=mailto:tls.reports@gsa.gov,mailto:tls-reports@login.gov"
~~~

<!-- See [Runbook: Email - MTA-STS](https://gitlab.login.gov/lg/identity-devops/-/wikis/Runbook:-Email#MTA-STS) for implementation details. -->

## Outbound Sending from @login.gov

### GMail Out

Most Login.gov team members send email using their `@gsa.gov` address.  Some Google Groups and other
special addresses under `@login.gov` do send out email.  All outbound email from `@login.gov` addresses

### AWS SES

AWS Simple Email Service (SES) is used to deliver messages to Login.gov users.

### Sender Policy Framework (SPF)

Sender Policy Framework uses a TXT record to specify which mail servers (MXes) are allowed
to send email out on behalf of a domain.

* To check the `login.gov` SPF record:

~~~
$ nslookup -type=txt login.gov | grep spf
login.gov descriptive text "v=spf1 include:amazonses.com include:_spf.google.com ~all"
~~~

* `include` elements reference other SPF records that include their own list of MXes.  Notably:
  * `amazonses.com` - Amazon Simple Email Service (SES) servers, as used for transactional email
  * `_spf.google.com` - Google GMail servers, as used for organizational email
* `~all` - Explicit deny of any other MX from sending email on behalf of `login.gov`

### DomainKeys Identified Email (DKIM)

DomainKeys Identified Email (DKIM) allows a sending domain to declare cryptographic keys that will be used to sign
all outbound email from the domain.  Since `login.gov` uses GMail and SES, both of which have DKIM keys in place and published, we simply need to reference those keys in DNS.  (As opposed to managing our own keys.)   References are defined in TXT records as follows:

* `SES-ID._domainkey.login.gov` - `SES-ID` is a value obtained dynamically through AWS API calls using our `ses_dkim_r53` Terraform module
* `google._domainkey.login.gov` - Explicitly defined and testable with `nslookup -type=txt google._domainkey.login.gov`

Contact GSA email support if you have questions regarding DKIM keys for GMail.

Once the keys are defined they are referenced in outbound email as part of a DKIM signature value.
Here is an example:

~~~
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
d=login.gov; s=google;
h=mime-version:from:date:message-id:subject:to;
bh=SOMTHING=;
b=SOMTHING-ELSE=
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
d=1e100.net; s=20161030;
~~~

### Domain-based Message Authentication, Reporting, and Conformance (DMARC)

DMARC allows a domain to define a set of policies applicable to email
sent from the domain.


Flow Diagram (from [RFC7498](https://tools.ietf.org/html/rfc7489))

~~~
    +---------------+
    | Author Domain |< . . . . . . . . . . . . . . . . . . . . . . .
    +---------------+                        .           .         .
        |                                    .           .         .
        V                                    V           V         .
    +-----------+     +--------+       +----------+ +----------+   .
    |   MSA     |<***>|  DKIM  |       |   DKIM   | |    SPF   |   .
    |  Service  |     | Signer |       | Verifier | | Verifier |   .
    +-----------+     +--------+       +----------+ +----------+   .
        |                                    ^            ^        .
        |                                    **************        .
        V                                                 *        .
     +------+        (~~~~~~~~~~~~)      +------+         *        .
     | sMTA |------->( other MTAs )----->| rMTA |         *        .
     +------+        (~~~~~~~~~~~~)      +------+         *        .
                                            |             * ........
                                            |             * .
                                            V             * .
                                     +-----------+        V V
                       +---------+   |    MDA    |     +----------+
                       |  User   |<--| Filtering |<***>|  DMARC   |
                       | Mailbox |   |  Engine   |     | Verifier |
                       +---------+   +-----------+     +----------+
~~~

Note the verification of DKIM and SPF.  To check the DMARC policy for `login.gov`:

~~~
$ nslookup -type=txt _dmarc.login.gov
_dmarc.login.gov descriptive text "v=DMARC1; p=reject; pct=100; fo=1; ri=3600; rua=mailto:dmarc-reports@login.gov,mailto:reports@dmarc.cyber.dhs.gov; ruf=mailto:dmarc-forensics@login.gov"
~~~

The above specifies:
* `p=reject` - Reject email if received email does not match policy
* `pct=100` - 100% of email is subject to filtering
* `fo=1` - Generate DMARC failure reports if SPF or DKIM checks did not pass
* `ri=3600` - Reporting Interval of 3600 (one hour) between reports
* `rua=mailto:dmarc-reports@login.gov,mailto:reports@dmarc.cyber.dhs.gov` - Send email delivery reports to the listed `login.gov` group and the standard DHS report destination
* `ruf=mailto:dmarc-forensics@login.gov` - Send forensic reports to the listed `login.gov` group

## Querying Authoritative DNS Servers

If you are making DNS changes and want to validate the changes quickly without waiting for
your DNS cache to expire and existing record, or if you suspect a DNS caching issue, you can query the authoritative DNS servers for login.gov using the following instructions.

* Lookup the NS records using an official `.gov` nameserver:

~~~
$ nslookup -type=ns login.gov a.gov-servers.net
Server:		a.gov-servers.net
Address:	2001:500:4431::2:30#53

Non-authoritative answer:
*** Can't find login.gov: No answer

Authoritative answers can be found from:
login.gov	nameserver = ns-521.awsdns-01.net.
login.gov	nameserver = ns-1641.awsdns-13.co.uk.
login.gov	nameserver = ns-249.awsdns-31.com.
login.gov	nameserver = ns-1458.awsdns-54.org.
~~~

* Perform further lookups for `login.gov` records using an authoritative server by including the nameserver at the end of the query.  For example, to get the list of MX records for `login.gov` using an the `ns-521.awsdns-01.net` listed above:

~~~
$ nslookup -type=mx login.gov ns-521.awsdns-01.net
Server:		ns-521.awsdns-01.net
Address:	2600:9000:5302:900::1#53

login.gov	mail exchanger = 10 aspmx.l.google.com.
login.gov	mail exchanger = 20 alt1.aspmx.l.google.com.
login.gov	mail exchanger = 20 alt2.aspmx.l.google.com.
login.gov	mail exchanger = 30 aspmx2.googlemail.com.
login.gov	mail exchanger = 30 aspmx3.googlemail.com.
login.gov	mail exchanger = 30 aspmx4.googlemail.com.
login.gov	mail exchanger = 30 aspmx5.googlemail.com.
~~~

Note - Implementation of DNSSEC is pending for `login.gov` domains.

## Further Reading

* [RFC5321 - Simple Mail Transfer Protocol](https://tools.ietf.org/html/rfc5321)
* [RFC6376 - DomainKeys Identified Mail (DKIM) Signatures](https://tools.ietf.org/html/rfc6376)
* [RFC7208 - Sender Policy Framework (SPF) for Authorizing Use of Domains in Email, Version 1](https://tools.ietf.org/html/rfc7208)
* [RFC7489 - Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://tools.ietf.org/html/rfc7489)
* [RFC8461 - SMTP MTA Strict Transport Security (MTA-STS)](https://tools.ietf.org/html/rfc8461)
