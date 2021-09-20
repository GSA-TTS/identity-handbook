---
title: "IdP Static Assets CDN"
description: "Overview of use of CloudFront CDN to serve static assets"
layout: article
category: "Architecture"
---

## Overview

To smooth deployment and reduce some load on the IdP application servers, we serve static assets
like images, CSS, and JavaScript from public CloudFront distributions.   This solution prevents
404s when a browser accesses a page served from a newly deployed application server which then fails to
load when directed to an older application server which does not have the new asset.

![architecture diagram of static asset cloudfront CDN]({{site.baseurl}}/images/static-cdn-diagram.png)
(to update this diagram, edit the [cloudfront static asset architecture][figma] file in Figma and re-export it)

[figma]: https://www.figma.com/file/EyRJkb84OMXEKLhKfmSkGA/cloudfront-static-asset-architecture

### Populating Static Assets

Assets are copied from `migration` instances into their environment specific private static asset
S3 bucket.  This ensures that new assets are present before being referenced by new IdP releases.

This S3 bucket is exposed publicly via a CloudFront distribution.

### Referencing Static Assets

By default, IdPs serve static assets directly.  To use the static asset CDN the `asset_host`
configuration is set to `https://static.idp.ENVIRONMENT.DOMAIN`

## Further Information

See [Runbook: CloudFront CDN](https://github.com/18F/identity-devops/wiki/Runbook:-CloudFront-CDN) for technical
and troubleshooting details.

