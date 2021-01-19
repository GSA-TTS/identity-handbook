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

    Updating the files in production:

    ```bash
    # prod
    aws-vault exec prod-power -- \
      aws s3 cp "$local_maxmind_path" "s3://${prod_bucket}/common/GeoIP2-City.mmdb"
    ```

4. Verifying MaxMind database metadata

    In a Rails console, run this command to look up the timestamp associated with the MaxMind database.
    It should correspond to the date of the file downloaded in step 2.

    ```ruby
    Time.at(Geocoder::Query.new('8.8.8.8').lookup.instance_variable_get(:@mmdb).metadata['build_epoch'])
    => 2021-01-18 20:21:47 +0000
    ```
