---
title: "Contact Form Updating Instructions"
description: "Procedure for adding an agency to the Contact Form in the Help Center"
layout: article
category: "AppDev"
---

## Background

The backend to the login.gov marketing site [Contact Form](https://login.gov/contact/) is
a Salesforce instance.

The backend will reject form posts that contain dropdown values it does not know about,
so new agencies need to be added explicitly with the help of the Salesforce TEam

## Configuration

To streamline working with the Salesforce team and their QA/valdiation process,
we've set up our Federalist preview site to

- disable captchas
- point at the sandbox instance

## Procedure

Check out this document with more details on the procedure, including who to contact:

- [Contact Form Procedure Doc][procedure]
- [Mirror of Contact Form Procedure Doc][procedure-mirror] in case access to the original
  is too restrictive

[procedure]: https://docs.google.com/document/d/1mMbDFzbzVKn1A1W87XFHakr-oz1-WKxBPQ3cT9VbEH4/edit
[procedure-mirror]: https://docs.google.com/document/d/1hQN8Az_ibSNf_c-iMR2RhRSZzz-RQtk6mZJW00-Cd2c/edit