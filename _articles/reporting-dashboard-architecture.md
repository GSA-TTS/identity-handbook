---
title: "Reporting Dashboard"
description: "Overview of reporting dashboard architecture for data.login.gov"
layout: article
category: "Architecture"
---

## Overview

We serve a dashboard at [data.login.gov][data-login-gov] with metrics that are safe to
share with the public

![architecture diagram of async/ruby workers]({{site.baseurl}}/images/reporting-dashboard-diagram.png)
(to update this diagram, edit the [Async Architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/DGQZwlRbJtEZGJH0t2iMvD/data.login.gov-report-architecture

### Data

Reporting jobs in the IDP run once a day or so by compiling data from the RDS instance,
and then and write JSON files to a private S3 bucket.
(<abbr title="nota bene">nb</abbr> this is a *different* bucket than for Login.gov internal
reports which includes billing information).

This S3 bucket is exposed publicly via a CloudFront distribution.

### Frontend

The [data.login.gov][data-login-gov] frontend, [18f/identity-reporting repo][frontend-repo],
is served by Federalist. The code is a Javascript-driven Single-Page App that dynamically loads
data from our cloudfront distro.

[data-login-gov]: https://data.login.gov
[frontend-repo]: https://github.com/18f/identity-reporting