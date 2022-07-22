---
title: "IdP CDN"
description: "Overview of use of CloudFront CDN to serve Login.gov"
layout: article
category: "Architecture"
redirect_from: /articles/appdev-static-assets-cdn.html
---

## Overview

To help reduce load on the IdP application servers, increase resiliency to DDoS attacks, and allow for
more robust error handling and maintenance pages we use Cloudfront to serve both static and dynamic
content. To smooth deployments, we serve static assets like images, CSS, and JavaScript from an S3 bucket 
and dynamic content from the servers using Cloudfront path based behaviors. This solution prevents 404s 
when a browser accesses static content referenced in the newly deployed application server which
then fails to load when directed to an older application server which does not have the new asset.

[![architecture diagram of static asset cloudfront CDN][image]][image]
(to update this diagram, edit the [cloudfront static asset architecture][figma] file in Figma and re-export it)

[image]: {{site.baseurl}}/images/cloudfront-diagram.png
[figma]: https://www.figma.com/file/EyRJkb84OMXEKLhKfmSkGA/cloudfront-static-asset-architecture

### Populating Static Assets

Assets are copied from `migration` instances into their environment specific private static asset
S3 bucket.  This ensures that new assets are present before being referenced by new IdP releases.

This S3 bucket is exposed publicly via a CloudFront distribution.

### Referencing Static Assets

By default, IdPs serve static assets directly.  To use the static asset CDN the `asset_host`
configuration is set to `https://idp.ENVIRONMENT.DOMAIN` and Cloudfront has a path based behavior
to route requests to your static content.

## Further Information

See [Runbook: CloudFront CDN](https://github.com/18F/identity-devops/wiki/Runbook:-CloudFront-CDN) for technical
and troubleshooting details.

