---
title: "Troubleshooting the Sandbox"
description: Troubleshooting issues with the Login.gov sandbox/int environment
layout: article
category: AppDev
---
## Prerequisites

Follow the instructions in the [Troubleshooting the IdP]({% link _articles/appdev-troubleshooting-production.md %}) prerequisites section.

## Purging a user's PII
If a user accidentally uploads real PII to our sandbox environment, follow the steps below to delete it.

1. Open a new terminal tab and `cd` to the `identity-devops` repo
2. Run the following command
    ```bash
    bin/awsv sandbox bin/ssm-instance --newest asg-int-idp
    ```
3. Once the SSM session is established, run the following commands to start a Rails console session:
    ```bash
    cd /srv/idp/current
    sudo -uwebsrv ALLOW_CONSOLE_DB_WRITE_ACCESS=true bin/rails c
    ```
4. Delete the user's associated profiles:
    ```ruby
    User.find_with_email('example@gsa.gov').profiles.delete_all
    ```
