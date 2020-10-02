---
title: Bug Bounty Triage
description: How to handle bug bounty reports
layout: article
category: AppDev
---

The AppDev on-call person is response for looking at and triaging bug bounty reports on a daily basis.

There are two channels that bug bounty reports may come through, HackerOne and the vulnerability disclosure form. The AppDev on-call person is responsible for managing both channels.

## HackerOne

HackerOne is a platform that allows researchers to report bugs to Login.gov.

To view the Login.gov feed in HackerOne:

1. [Login to HackerOne](https://hackerone.com/users/sign_in) and select "TTS Bug Bounty" from the dropdown in the top left
2. Select "Login.gov" in the menu along the top (You may need to click "More" if your screen is not absurdly large).

Any new reports that come in should be validated by you. You can leave team only comments if you think a bug is a false positive or ask for more information from the researcher. If you have validated the bug, open a Jira ticket and change the state in HackerOne to "Triaged". When you do that, include the link to the Jira ticket in the Reference ID column.

## The vulnerability disclosure form

The vulnerability disclosure form feeds into [this Google sheet](https://docs.google.com/spreadsheets/d/1a_jmZ809IpoAuWhJuIOgsuYLDfzmJrOKFXJb76RKHnc).

The procedure for reviewing entries in the form are as follows:

1. Review the title, description, and impact for each vulnerability report
1. If a vulnerability exists, open a Jira ticket and label it a bug
1. If the vulnerability could be considered to have a high or critical impact, consult the product owner for immediate prioritization. Otherwise, it will be prioritized at the next backlog grooming
1. Comment on the "Impact" cell for the report detailing the actions you took.

## H1 Resources

* H1 Bug bounty field manual
<https://www.hackerone.com/sites/default/files/2017-05/Bug-Bounty-Field-Manual-complete-ebook.pdf>

* Twitter feed to view recently publicly disclosed bugs:
<https://twitter.com/disclosedh1>

* Blog post with advice on triage
<https://www.hackerone.com/blog/bug-bounty-5-years-in-uber-facebook>
