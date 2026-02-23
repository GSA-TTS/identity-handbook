---
title: "USPS IPP-B Spot Checks"
description: "How we verify that USPS In-Person Proofing is working as expected"
layout: article
category: Team
---

## Introduction

In partnership with the United States Postal Service, we offer In-Person Proofing services to help users gain access to government services through Login.gov. As of September 2025, In-person proofing (IPP) is available at over 18,000 USPS locations across states and U.S. territories. 99% of the public live within 10 miles of one of these USPS locations. In order to continue supporting this service we must ensure it continues to meet our internal and industry standards. The steps detailed below would allow us to conduct “spot checks” to the service which will help us collect observational data that will inform process improvements within the applications and training of the USPS clerks.

## How do we initiate the ‘Spot checks’?

On the 1st of every month, or the work day right after, one or more Login.gov team members will be signed up through our Staging environment to receive an IPP enrollment code by the Appdev on-call for the Identity Proofing team (Team Charity). With the provided enrollment code, the team members will then visit a Post Office near them and request IPP identity verification. After their visit, they will fill out a brief form detailing their experience at the Post Office.

## What should I expect and how would I do it?

First, you would need to sign-up as a volunteer. A few days ahead of your chosen month, the Appdev on-call for the Identity Proofing team (Team Charity) will reach out to you asking for some personal information to create the profile that will be verified. You will share this information over Google Chat or another secure manner - please do NOT share over Slack. Then the AppDev will generate an enrollment code for you.
* You will have 7 days from the day the code was generated to visit a participating Post Office
* You can work with the AppDev to decide when your code will be generated to give you flexibility on when you can/will visit the Post Office
* We ask that you do it within the month that you signed up for

You will be required to have an ID with you during the visit. After the visit, you will be asked to submit high-level details on your experience via a form. Some of the questions you will be asked are:

* Name
* Date of visit
* Post Office location
* Were you able to get service promptly for your IPP request?
* Did the clerk ask for documentation: ID and enrollment code?
* Did the clerk compare your ID with your face?
* Did the clerk check the expiration date on your ID?
* Any other information from your visit you want to share?
* Any suggestions on how to improve the process based on your visit?

## Want to volunteer?

If you'd like to volunteer to complete a 'Spot check' at a Post Office near you, please add your name to the [Upcoming Volunteers tab][upcoming-volunteers] of the USPS IPP-B Spot Checks spreadsheet. We will have two spots available per month.

If you have any questions about the process or urgent feedback after your visit, you can reach out to us via Slack on our team channel, [#login-team-charity][team-charity-slack].

## For AppDevs

The Appdev on-call for the Identity Proofing team (Team Charity) will facilitate the process by changing our Staging environment to leverage our Production API with USPS. More information on how to achieve this can be found in the [Run book: Use Prod USPS Configurations in Staging Environment][usps-config-runbook].

## Related Articles

* [GPO Designated Receiver][gpo-designated-receiver] - How we verify that USPS/GPO address verification is working as expected

[upcoming-volunteers]: https://docs.google.com/spreadsheets/d/14HjdH9ndSLHkICYuK6rbv7raXiANiP8_Gc7kRJJXmxg/edit?gid=0#gid=0
[team-charity-slack]: https://gsa.enterprise.slack.com/archives/C08JUHUQYNA
[usps-config-runbook]: https://docs.google.com/document/d/1Op8xepngI6ah__gwAaWMMIKIXaYzr5EJzR5RItgEwXw/edit?tab=t.0
[post-visit-survey]: #
[gpo-designated-receiver]: https://handbook.login.gov/articles/gpo-designated-receiver.html
