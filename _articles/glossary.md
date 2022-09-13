---
title: "Glossary"
description: "Explanation of common terms, acronyms, and abbreviations"
layout: article
category: "Team"
---

## Overview

This glossary is for possibly-confusing terms and abbrevations that come up working on, or talking about, Login.gov.

Many of them are related to Identity Management ecosystem, our goal is to
provide common terms to communicate about Identity without confusion. We will
map where these terms are used incorrectly or interchangeably.

An "industry" glossary worth scanning: <https://solutionsreview.com/identity-management/identity-management-glossary/>

## Terms

### 2FA
**Two-factor authentication** or **two-step authentication**

Also called 2FA and two-factor authentication, two-step authentication is a way of logging into a website that increases security by requiring a password plus something else such as a physical trait, a PIN, or location or time of a login attempt. Two-factor authentication makes users' accounts more secure by requiring a mobile device (a phone or a tablet) as well as a password to sign in, reducing the threat of attackers being able to hack their way into accounts.

### AAL
**Authentication Assurance Level**

How certain we are the owner of an account logged in to that account. Based on [NIST 800-63-3][nist-800-63-3].

Login.gov supports
- AAL 2: multifactor authentication
- AAL 3: phishing resistant authenticator with verifier impersonation resistance, requires WebAuthn or a PIV/CAC


### AAMVA
**American Association of Motor Vehicle Administrators**

An association of DMVs from many states, AAMVA provides an API we use to validate driver's license data.

### Authentication
**AuthN**

Authentication is the process by which users prove that their identities belong to them.

### Authentication application (app)
An authentication application is a mobile security application that generates sign-in passcodes; a few examples include Google Authenticator and Authy. These apps allow users to generate codes even without an internet connection or mobile service.

### AuthZ
**Authorization**

### (Double) Blind Privacy
A privacy architecture that allows the [IdP](#idp) and [RP](#rp) to collaborate with each other without the need for reading or modifying any User data traveling through the network with the intent there is zero disclosure of [PII](#pii).

### (Triple) Blind Privacy
A privacy architecture that includes the [Double Blind Privacy](#double-blind-privacy) model, with the addition of the [Hub](#hub) having zero disclosure  to User’s [PII](#pii).

Source: [Privacy By Design](https://www.ipc.on.ca/images/Resources/operationalizing-pbd-guide.pdf), [SecureKey](http://securekey.com/wp-content/uploads/2015/09/SK-UN117-Trust-Framework-SecureKey-Concierge-Canada.pdf)

### CCN

**Credit Card Number**

### Credential
An object or data structure that authoritatively binds an identity (and optionally, additional attributes) to a token possessed and controlled by a Subscriber.

Source: [SP 800-63](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63-2.pdf)

Evidence attesting to one’s right to credit or authority.

Source: [FIPS 201](http://csrc.nist.gov/publications/fips/fips201-1/FIPS-201-1-chng1.pdf)

Evidence or testimonials that support a claim of identity or assertion of an attribute and 
are intended to be used more than once.

Source: [CNSSI-4009](http://www.ncsc.gov/nittf/docs/CNSSI-4009_National_Information_Assurance.pdf), [Searchable Source](http://www.fismapedia.org/index.php/Category:CNSSI_4009_Terms)

### CSP
**Credential Service Provider**

A trusted entity that issues or registers Subscriber tokens and issues electronic credentials to Subscribers. The CSP may encompass [Registration Authorities (RAs)](#ra) and [Verifiers](#verifier) that it operates. A CSP may be an independent third party, or may issue credentials for its own use.

Source: [SP 800-63](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63-2.pdf)

A CSP is often also an [IdP](#idp).

### Entitlement
Documents that indicate that the holder is eligible for a service or benefit, such as health care.

A set of rules, defined by the IT resource owner, for managing access to a resource (asset, service, or entity) and for what purpose.  A User's level of access is conditioned not only by your identity but is also likely to be constrained by a number of further security considerations.

Source: [Entities and Entitlement](http://blog.opengroup.org/2012/08/07/entities-and-entitlement-the-bigger-picture-of-identity-management/)

### Factor
A factor is a type of evidence that users can provide to prove they own an identity record or an account. There are three types of factors:
- **Something you know** (like a password)
- **Something you carry** (like a telephone or PIV card) _Usually referred to as **something you have**_
- **Something your body has** (like a fingerprint) _Usually referred to as **something you are**_

Multi-factor authentication is a process that requires users to present valid examples of multiple factors. NB: We have rewritten the names of the factors for greater clarity and precision. _See also **Authentication**, **[Two-Factor Authentication](#2fa)** and **[Multi-Factor Authentication](#mfa)**_ definitions.


### FYSA
**For Your Situational Awareness**
Similar to FYI (For Your Information). In government context, FYI can mean for one individual only, or information that should not be shared, but FYSA can be used to indicate the information can be shared.

### GTC
**General Terms and Conditions**

The long term agreement that establishes the relationship between Login.gov and an agency. These typically span a 5 year period.

### GPO
**Government Publishing Office** ([gpo.gov](https://www.gpo.gov/))

A federal agency that can print and send letters. Login.gov uses GPO to send letters with our verify-by-mail flow. See [GPO Designated Receiver]({% link _articles/gpo-designated-receiver.md %}) for some example letter templates.

### Hub
Hub is the idea of an identity "traffic controller" that interacts with requesters and requestees during an identity authentication workflow. It "manages communications between Users, [RP](#rp) and [IdP](#idp). It makes sure that users can _assert_ their identities securely and safely, and that relying parties can be confident that users are who they say they are."

On the basis of this _assertion_, the Hub can aid in making an access control decision - it can decide whether to perform some service for the connecting parties. _Will be revised as we make progress_

Source: [Wikipedia](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language), [UK Digital Services](https://www.gov.uk/service-manual/identity-assurance)

### IAA
**Inter-Agency Agreement**

A contract between government agencies. For Login.gov, these are the contracts we have with other agencies that let them use Login.gov as partners/clients.

### IAL
**Identity Assurance Level**
How certain we are somebody is who they say they are. Based on [NIST 800-63-3][nist-800-63-3].

Login.gov supports:
- IAL 1: a lightly verified identity
- IAL 2: a verified identity

### IAM
**Identity Access Management**

### Identity
In everyday usage, **identity** refers to the characteristics, qualities, beliefs, and other factors that make a particular individual or group different from others. The technical definition of the word is much more precise. An **identity** is a record or statement that describes a person or thing. In the case of identity assurance and management, it refers to who or what an entity is, defined by certain attributes.

### Identity Attribute
A property of a Digital Subject that may have zero or more values. Generally known as an **attribute** (name, first name, shoe size, Social Security number, religion, marital status, and so on) in digital form, an attribute is attached to a Digital Subject. The attributes exist whether or not they have a value and whether or not they're part of a Claim.

### Identity Proofing

See [IdV](#idv).

Identity Proofing is the _process_ in which users identities are verified.

The process by which a [CSP](#csp) and a [RA](#ra) collect and verify information about a person for the purpose of issuing credentials to that person. We follow the [NIST 800-63-3][nist-800-63-3] guidelines for enrollment and identity proofing.

[nist-800-63-3]: https://pages.nist.gov/800-63-3/

### IdP
**Identity Provider**

An Identity Provider, also known as Identity Assertion Provider, is responsible for (a) providing identifiers for users looking to interact with a system, and (b) asserting to such a system that such an identifier presented by a user is known to the provider, and (c) possibly providing other information about the user that is known to the provider.

An Identity Provider can be described as a Service Provider for storing identity profiles and offering incentives to other SPs with the aim of federating user identities.

### Identity Resolution
The ability to distinguish a person from all others within the context of the total population of persons of interest.

### IdV
**Identity Verification**

See [Identity Proofing](#identity-proofing).

Identity Verification is the _completion_ of the [identity proofing](#identity-proofing) process.

**Identity Verification vs Identity Proofing**

The two terms are also sometimes used interchangeable, which can be confusing to folks.
We lean towards only using identity verification for consistency, but may use identity proofing where it makes sense to do so.

To differentiate, we could say:

> The user proofed their identity to complete identity verification.

### LOA
**Level of Assurance**

*Note: LOA has been succeeded by the newer [IAL](#ial) and [AAL](#aal) levels*

Level of Assurance describes the degree of confidence in the vetting processes required for a user leading up to and including an authentication. With Login.gov, it's the degree of confidence we require and that partner government agencies require ["that a user is who they say they are"](https://alphagov.github.io/identity-assurance-documentation/shared/glossary.html), per [Gov.UK Verify](https://www.gov.uk/government/publications/introducing-govuk-verify/introducing-govuk-verify), Great Britain's identity assurance service.

* Level of Assurance 1 (LOA1): Used when an entity needs to know that the same user is returning to the service but doesn’t need to know who that user is; low confidence in the asserted identity’s validity.
* Level of Assurance 2 (LOA2): Used when an entity needs to know who the user is and that they're real; some confidence in the asserted identity’s validity.
* Level of Assurance 3 (LOA3): Used when an entity needs to know beyond reasonable doubt who the user is and that they are a real person; high confidence in the asserted identity’s validity.
* Level of Assurance 4 (LOA4): Used when an entity needs to know beyond reasonable doubt who the user is and that they are a real person, usually involving biometric verification or unique identifiers such as fingerprints, retina and iris patterns, signatures, and DNA; very high confidence in the asserted identity’s validity.

### MBUN
**Meaningless But Unique Number**

### Modeling for Authentication Solution
- Two Party Model: User and Service Provider
- Three Party Model: User, Identity Provider and Service Provider
- Four Party model: User, Identity Provider, Attribute Provider and Service Provider

Source: [NISTIR 7817](http://nvlpubs.nist.gov/nistpubs/ir/2012/NIST.IR.7817.pdf)

### MFA
**Multi-factor Authentication**

Multi-factor authentication describes two-factor and higher levels of authentication. Anything that requires more than just a username and password is considered MFA (eg. passphrase + OTP via phone, passphrase + browser fingerprint + phone OTP). Note, however, that MFA is meant to describe combining different types of authentication factors: possession, knowledge, and inherence.

### Null Identity

An identity record present in the database that is missing one or more of the attributes included in an analysis that causes a search error and renders that record invalid for the purpose of the analysis.

### OTP
**One Time Password**
Token valid for one use. See https://en.wikipedia.org/wiki/One-time_password

### Passcode
A **passcode** works like a password but uses only numbers. In previous iterations, Login.gov used **one-time passcode** to refer to the six-digit code sent during phone confirmation. However, usability tests suggested that the one-two sequence of **two-factor authentication** and **one-time passcode** might be misleading to non-experts.
* In technical documentation, use **one-time passcode** on first reference, OTP on second. Don’t use **one-time password** or **TOTP** unless it is clearly explained as an alternate term. 
* Never use these alternatives in the interface. Instead, **use "security code"** to refer to any OTP sent to confirm device ownership.

### Password
A collection of random characters (words and numerals) or short words used to access an account. It has no spaces. A **passphrase** is a password with spaces in it. **For interface copy, we will use "password" over "passphrase,"** which might be more technically accurate but is likely less recognizable to the intended enduser.

### PII
**Personally Identifiable Information**

See [PII Guidance]({% link _articles/pii-guidance.md %}) for more on safe handling of PII.

### RP
**Relying Party**

We prefer Service Provider to Relying Party when describing client applications.

An entity that relies upon the subscriber’s credentials, typically to process a transaction or grant access to information or a system.

Source: [CNSSI-4009](http://www.ncsc.gov/nittf/docs/CNSSI-4009_National_Information_Assurance.pdf), [Searchable Source](http://www.fismapedia.org/index.php/Category:CNSSI_4009_Terms)

An entity that relies upon the Subscriber's token and credentials or a Verifier's assertion of a Claimant’s identity, typically to process a transaction or grant access to information or a system. Source: SP 800-63

### RA
**Registration Authority**
A trusted entity that establishes and vouches for the identity or attributes of a Subscriber to a CSP. The RA may be an integral part of a CSP, or it may be independent of a CSP, but it has a relationship to the CSP(s).


### SAML
**Security Assertion Markup Language**

### SCR

**Significant Change Request**

A change to our system that triggers additional review processes.

### SP
**Service Provider**

An application (or applications) within an ecosystem that provides a service to users; examples of SPs that relate to Login.gov include vets.gov, myssa, and ELIS.

### SLO
**Single LogOut**

### TOTP
**Time-based one-time password**

This is the code that would be displayed on a user's authenticator app, such as Google Authenticator.

<https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm>
<https://tools.ietf.org/html/rfc6238>

### TTP
Short for [Trusted Traveler Programs](https://ttp.cbp.dhs.gov/).

### User
A user is the person accessing the government service via Login.gov. For clarity, refer to agency partners as **partners** or **integrators**.

### Verification
Identity proofing or verifying the identity of a user requires that user to provide information about themselves and answering questions to prove that they're really who they say they are. When Login.gov conducts identity proofing, we need users to give us:
* An government-issued identifier such as their Social Security number
* Financial or utility account information
* An address on record with an institution that also verified (such as a phone company or a mortgage holder)

### Verifier
An entity that verifies the Claimant’s identity by verifying the
Claimant’s possession and control of a token using an authentication
protocol. To do this, the Verifier may also need to validate
credentials that link the token and identity and check their status.
Source: SP 800-63

An entity which is or represents the entity requiring an authenticated
identity. A verifier includes the functions necessary for engaging in
authentication exchanges.
Source: FIPS 196
