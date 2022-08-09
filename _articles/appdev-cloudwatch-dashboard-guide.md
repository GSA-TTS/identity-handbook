---
title: "Cloudwatch Dashboards"
description: "How to search for, create, and manage cloudwatch dashboards"
layout: article
category: "AppDev"
---

## Overview

Amazon Cloudwatch makes it possible to search Login.gov logs and AWS metrics to
create visualizations or display statistics.
Cloudwatch Insights is the tool that makes it possible to query logs.
Information on how to build Cloudwatch Insights queries can be found in the
[AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html).

[Login.gov's CloudWatch Dashboards](https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards:)
can be found by navigating to the Cloudwatch service in the AWS Console and
selecting "Dashboards" in the left pane.
From here you will see a list of available dashboards and there is functionality
for searching dashboards.

## Experimental vs Terraformed Dashbords

The source for Cloudwatch Dashboards should be maintained in terraform code
under version control in the
[identity-devops repo](https://github.com/18f/identity-devops).

Creating dashboards can be tricky and require some experimentation that are
impeded by the long feedback loop of making and applying changes to terraform
code.
As a result, Login.gov supports experimental dashboards.
These are ephemeral dashboards which can be used to create source for long-lived
dashboards.

Terraformed dashboards are distinguisehd from experiemental dashboards by the
prefix in the dashboard name.
A terraformed dashboard will have a prefix which is an environment name.
For example, a terraformed dashboard may be named `prod-sample-dashboard`.
Conversly, an experimental dashboard will use a name that identifies the author.
For example, `my-example-dashboard`.

Once an experimental dashboard reaches the desired state it should be converted
into a terraformed dashboard.
The `identity-devops` repo has tooling for converting dashboards to terraformed
dashboards.

Given an expriemental dashboard named `my-sample-dashboard`, run the
following in the `identity-devops` repo:

```bash
aws-vault exec prod-power -- bin/copy-cloudwatch-dashboard -i my-sample-dashboard
```

This will create a terraform file file in the devops repo for the dashboard.
When this file is checked in and applied by terraform a dashboard matching
the experimental one will be created for all environments.
