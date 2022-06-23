---
title: "IDP Artifacts"
description: "Overview of IDP artifact-building architecture"
layout: article
category: "Architecture"
---

## Overview

To reduce operational complexity and minimize deployment time, artifacts for IDP hosts are built in migration hosts. The artifacts consist of Login.gov's IDP source code repositories, Ruby and Javascript dependencies downloaded via RubyGems and Node Package Manager (NPM), and compiled frontend assets. This functionality is currently backwards compatible, and deployments will fall back to existing behavior if an artifact is not available.

[![architecture diagram of reporting dashboard][image]][image]
(to update this diagram, edit the [IDP artifact-building architecture][figma] file in Figma and re-export it)

[image]: {{site.baseurl}}/images/idp-artifact-building-architecture.jpg
[figma]: https://www.figma.com/file/sam6yEo5qFMqJ29Y4jb4me/IDP-Artifact-Building-Architecture

### Building and Uploading Artifacts

Artifacts are built within the current IDP deploy process in the `migration` instance. The steps are:

1. Download latest IDP SHA from the configured deploy branch from GitHub
2. Skip if artifact already exists for that SHA in S3
3. Clone IDP on configured branch
4. Run IDP deploy build script, which downloads Ruby/Javascript dependencies, and builds frontend assets
5. Cache gem bundle
6. Tar and GZip IDP directory into a single compressed file, excluding large static files, private configuration, and application secrets
7. Upload file artifact to S3 with the SHA of the IDP git repository

### Downloading Artifacts

Artifacts are only used by `migration` and `idp` instances. They will attempt to download and use artifacts following these steps:

1. Download latest IDP SHA from the configured deploy branch from GitHub
2. Download artifact with that SHA from S3
3. Unzip artifact file into directory
4. Run IDP deploy build in local-dependency mode, which explicitly disallows contacting RubyGems and NPM

### Interaction with [CloudFront Static Assets]({% link _articles/appdev-cdn.md %})

Artifact generation is compatible with environments where regardless of whether CloudFront is used to serve static assets.
