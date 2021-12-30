---
title: "Deploying a Partner Service Provider Config to Production"
layout: article
description: "Process and proceeders when deploying a partner service provider config to production"
category: Partnerships
---

Here is a list of items that need to be completed to deploy the configuration for a partner SP (Service Provider) to Production.

1. Ensure that the IAA is signed and includes the application explicitly in the Description of Service or Statement of Work.

2. Ensure that the **Contact Center Fact Sheet** was sent from Smartsheet. This is done by setting the **Integration Ticket Status** of the Smartsheet ticket to anything after **IAA Review**.

3. Ensure that the production configuration has been provided by the partner (e.g. valid Dashboard URL in the Smartsheet ticket) and includes the following:
  * All production urls should have `.gov`, `.mil` or a dedicated `.com` address and point to an ATO-ed environment. It should not be a local IP or have things like "dev", "qa",  or "mikes-macbook" in the urls.
  * If the app does not have a logo, then the partner will need to upload one before it can be deployed. You can find the [logo guidelines here](https://developers.login.gov/design-guidelines/#agency-logo-guidelines).

4. Create a PR in the [identity-idp-config](https://github.com/18f/identity-idp-config) repo that consists of:
  * App configuration added to [`service_providers.yml`](https://github.com/18F/identity-idp-config/blob/main/service_providers.yml)
  * A logo image in [`/public/assets/images/sp-logos`](https://github.com/18F/identity-idp-config/tree/main/public/assets/images/sp-logos)
  * A certificate file in [`/certs/sp`](https://github.com/18F/identity-idp-config/tree/main/certs/sp)
  * Integration parameters added to [`integrations.yml`](https://github.com/18F/identity-idp-config/blob/main/integrations.yml)
  * The integration's `issuer` added to the `integrations` attribute of the associated IAA Order in [`iaa_orders.yml`](https://github.com/18F/identity-idp-config/blob/main/iaa_orders.yml)

5. The PR should be reviewed by another integration engineer and merged into `main`.

6. Generally speaking, we rely on the [weekly IdP deployment process]({% link _articles/appdev-deploy.md %}) to pull in configuration changes, especially new integration launches. If a manual deployment is required, follow the directions below:
  * **If no new logo files are being added in this PR,** you can simply spin up a migration instance in the appropriate environment (replace `prod` with `staging` if deploying integration to staging):
    ```sh
    bin/awsv prod bin/asg-recycle prod migration
    ```
    Once the `db:migrate` task has completed in the deployment process, the changes should be reflected in the IdP. You can monitor the deployment process using the following commands:
    ```sh
    bin/awsv prod bin/ssm-instance --newest asg-prod-migration # shell into the new migration instance once it is initially provisioned
    sudo tail -f /var/log/syslog
    ```
  * Otherwise, a full recycle will be necessary following the [deploy commands for production]({% link _articles/appdev-deploy.md %}#production).

7. To verify that changes are complete, you may (but are not required to) shell into an `idp` instance in the appropriate environment and check using the Rails console:
    ```sh
    bin/awsv prod bin/ssm-instance --newest asg-prod-idp # shell into an idp instance
    id-rails-console # open a Rails console, enter explanation when prompted
    ```
    ```ruby
    sp = ServiceProvider.find_by(issuer: 'ISSUER_FROM_CONFIGURATION')
    # verify attribute change or presence of record for new integrations
    ```

8. Notify the person who requested the launch / change that the configuration should be live in production and that they should test that everything looks good.
