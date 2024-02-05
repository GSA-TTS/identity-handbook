---
title: "Contingency Plan Training Wargames - Player's Guide"
description: "How to prepare for a Wargames scenario as a player"
layout: article
category: "Team"
subcategory: Guides
cSpell: ignore socio
---

## Overview

Login.gov's "Contingency Plan Training Wargames" are a regular event that use a
mix of process practice, chaos engineering, and group troubleshooting to hone
skills and improve the readiness of our socio-technical system.

This guide provides some low-lift preparation options to help players feel more
prepared to step into unfamiliar roles.

The more familiar a process is, the easier it is to perform in a real scenario.
We want to make it easy and fun to participate in our wargames, even if you're
brand new to incident management.

## Tech lead preparation list:

### Equipment needed:
- Government Furnished Equipment (GFE)
  - This is necessary to use your yubikey, log into infrastructure, etc
- Yubikey

### Useful sites to log into before wargames begin
- [NewRelic](https://one.newrelic.com){:target="_blank"}
  - Requires SecureAuth login.
- AWS Console
  - Requires AWS username/password as well as a Yubikey MFA.
  - Use the PowerUser@login-sandbox role
  - Parts of the AWS console you may use:
	- [CloudWatch](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:logs-insights){:target="_blank"} to look at logs
	- [EC2](https://us-west-2.console.aws.amazon.com/ec2/home?region=us-west-2#Home:){:target="_blank"} to look at instances and autoscaling groups
	- [Workload Dashboard](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards?listOptions=~(filteringText~'workload~currentPageIndex~1)){:target="_blank"} of the environment that is being used for the war games

### Useful things to have up in a browser:
- [Incident response runbooks](https://github.com/18F/identity-devops/wiki/Incident-Response-Runbooks){:target="_blank"}
- [Troubleshooting Devops quick reference -- includes devops commands](https://github.com/18F/identity-devops/wiki/Troubleshooting-Quick-Reference){:target="_blank"}
- [Identity IdP Github](https://github.com/18f/identity-idp){:target="_blank"}
- [Identity Devops Github](https://github.com/18f/identity-devops){:target="_blank"}

### Optional
- Fun hat
