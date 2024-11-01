---
title: "AWS Incident Manager"
description: Basic information on our on-call scheduling and alerting tool
layout: article
subcategory: How To
category: Team
---

## Purpose

[AWS Incident Manager](https://aws.amazon.com/systems-manager/features/incident-manager/) provides on-call rotation scheduling and alerting for
both automated and human generated events. It is our primary emergency notification system.

## Getting Started

### Getting an Account and Logging In

Access can be provided for any team member with an on-call or emergency notification
need. Ask in `#login-platform-support` and tag `@login-platform-help` if you need
access. See the [Devops AWS Incident Manager wiki page](https://gitlab.login.gov/lg/identity-devops/-/wikis/On-Call-Scheduling-and-Alerting-with-AWS-Incident-Manager)
for more information on setup.

## Teams and Scheduling

AWS Incident Manager is structured as follows:
* [Contacts](https://docs.aws.amazon.com/incident-manager/latest/userguide/contacts.html) -
  Contacts are people who may be contacted for incident response.
* [Schedules and Rotations](https://docs.aws.amazon.com/incident-manager/latest/userguide/incident-manager-on-call-schedule-create.html) -
  A rotation is made up of people. We organize our rotation membership by collecting users who will be part
  of the same set of on-call rotations and have the same on-call responsibilities.
* [Escalation Plan](https://docs.aws.amazon.com/incident-manager/latest/userguide/escalation.html) -
  Each team should have an escalation policy which defines the order of notifications
  when an incident is routed to one or more rotations.

## Active Integrations

Integrations are configured for the following:
* CloudWatch - Allows CloudWatch Alarms to use SNS to raise an incident.
* NewRelic - Allows NewRelic to create Incident Manager incidents.
* Slack - Allows AWS Incident Manager to send alerts to Slack

## Support and Documentation

* [Devops AWS Incident Manager wiki page](https://gitlab.login.gov/lg/identity-devops/-/wikis/On-Call-Scheduling-and-Alerting-with-AWS-Incident-Manager)
* Ask in #login-platform-support if you have a problem with AWS Incident Manager.
