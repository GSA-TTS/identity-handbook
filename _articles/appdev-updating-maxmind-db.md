---
title: "Updating MaxMind GeoIP database"
description: "Instructions for updating our IP address geolocation database"
layout: article
category: "AppDev"

appendix_url: https://docs.google.com/document/d/1ZMpi7Gj-Og1dn-qUBfQHqLc1Im7rUzDmIxKn11DPJzk/edit#heading=h.2dv73pe5frx0
---

This article walks through updating our copy of the MaxMind GeoIP database.

1. Log in to <https://www.maxmind.com>

   (See the [Handbook Appendix]({{ page.appendix_url }}) for credentials)

2. Download the updated database:
    - Navigate to "Download Files" under the "GeoIP2 / GeoLite2" heading on the left side
    - Download "GeoIP2 City" as a GZIP and unzip it, it should be a folder with a file named `GeoIP2-City.mmdb`

3. Upload the file to S3, we have separate buckets for sandbox and production.

      Set up some variables
      <pre><code>export sandbox_bucket=<a href="{{ page.appendix_url }}">[see handbook appendix]</a>
export prod_bucket=<a href="{{ page.appendix_url }}">[see handbook appendix]</a>
export local_maxmind_path=[path from step 2]</code></pre>

    To update the file in the sandbox:

    ```bash
    # sandbox
    aws-vault exec sandbox-power -- \
      aws s3 cp "$local_maxmind_path" "s3://${sandbox_bucket}/common/GeoIP2-City.mmdb"
    ```

    Verify by recycling the IDP, and then move on to production:

    ```bash
    # prod
    aws-vault exec prod-power -- \
      aws s3 cp "$local_maxmind_path" "s3://${prod_bucket}/common/GeoIP2-City.mmdb"
    ```