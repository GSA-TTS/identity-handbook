---
title: "CloudWatch Dashboards"
description: "How to search for, create, and manage CloudWatch dashboards"
layout: article
category: "Reporting"
subcategory: "CloudWatch"
---

## Overview

Amazon CloudWatch makes it possible to search Login.gov logs and AWS metrics to
create visualizations or display statistics.
CloudWatch Insights is the tool that makes it possible to query logs. See [CloudWatch 101][cloudwatch-101] for more information on how to write queries, or the [Devops CloudWatch Guide][devops-cloudwatch].

[cloudwatch-101]: {% link _articles/cloudwatch-101.md %}
[devops-cloudwatch]: https://gitlab.login.gov/lg/identity-devops/-/wikis/Guide:-Cloudwatch-Logs,-Metrics-and-Dashboards

[Login.gov's CloudWatch Dashboards](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards:)
can be found by navigating to the Cloudwatch service in the AWS Console and
selecting "Dashboards" in the left pane.
From here you will see a list of available dashboards and there is functionality
for searching dashboards.

## Experimental vs Terraformed Dashboards

The source for CloudWatch Dashboards should be maintained in Terraform code
under version control in the
[identity-devops repo](https://github.com/18f/identity-devops).

Creating dashboards can be tricky and require some experimentation that are
impeded by the long feedback loop of making and applying changes to terraform
code.
As a result, Login.gov supports experimental dashboards.
These are ephemeral dashboards which can be used to create source for long-lived
dashboards.

Terraformed dashboards are distinguished from experimental dashboards by the
prefix in the dashboard name.
A terraformed dashboard will have a prefix which is an environment name.
For example, a terraformed dashboard may be named `prod-sample-dashboard`.
Conversely, an experimental dashboard will use a name that identifies the author.
For example, `my-example-dashboard`.

Once an experimental dashboard reaches the desired state it should be converted
into a terraformed dashboard.
The `identity-devops` repo has tooling for converting dashboards to terraformed
dashboards.

Given an experimental dashboard named `my-sample-dashboard`, run the
following in the `identity-devops` repo to create `prod-my-sample-dashboard`, `staging-my-sample-dashboard`, etc.:

```bash
aws-vault exec prod-power -- bin/copy-cloudwatch-dashboard -i my-sample-dashboard
```

This will create a terraform file in the devops repo for the dashboard.
When this file is checked in and applied by terraform a dashboard matching
the experimental one will be created for all environments.

## Technical Information

For technical information on creating dashboards and alerts, see [Monitoring and observability: CloudWatch queries, alarms and dashboards](https://gitlab.login.gov/lg/identity-devops/-/wikis/Monitoring-and-observability:-CloudWatch-queries,-alarms-and-dashboards).
