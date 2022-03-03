---
title: "Updating Pwned Passwords Dataset"
description: "Instructions for updating Pwned Passwords dataset in s3"
layout: article
category: "AppDev"

appendix_url: https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.2dv73pe5frx0
---

This article walks through updating our pwned passwords dataset in S3.
The script will download the (at the time of this posting) 17.2 gb pwned passwords file from [haveibenpwned](https://haveibeenpwned.com/Passwords)
and then post it to our AWS environments is specified.

We have separate buckets for sandbox and production. To upload the files you must:

      Set up some variables for the s3 buckets.
      <pre><code>export sandbox_bucket=<a href="{{ page.appendix_url }}">[see handbook appendix]</a>
export prod_bucket=<a href="{{ page.appendix_url }}">[see handbook appendix]</a></code></pre>

    To do a dry run where you don't upload to s3:
    ```bash
    ./scripts/pwned-passwords.sh
    ```

    Update the file in the sandbox:

    ```bash
    # sandbox
    ./scripts/pwned-passwords.sh -s
    ```

    Update the files in production:

    ```bash
    # prod
    ./scripts/pwned-passwords.sh -p
    ```

