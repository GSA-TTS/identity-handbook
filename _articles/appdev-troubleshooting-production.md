---
title: "Troubleshooting the IDP"
description: Troubleshooting production exceptions and issues reported by customers
layout: article
category: AppDev
---
## Prerequisites

Before you can access any systems, you will need to
 - Obtain a PIV card reader
 - Get cleared for SSH access via PIV into Login.gov systems
 - [Set up AWS-vault](https://github.com/18F/identity-devops/wiki/Setting-Up-AWS-Vault)

To get SSH access, the public key from your PIV card must be added to the servers you would like to access.
Follow the instructions at the beginning of [this article]({% link _articles/piv-ssh.md %}) to extract your public key and follow the instructions in the [DevOps wiki](https://github.com/18F/identity-devops/wiki/Setting-Up-your-Login.gov-Infrastructure-Configuration#terraform--chef) to add it to our servers.

## Looking up a user in the production DB
1. If you are not in a GSA office, make sure to connect to the GSA network via VPN
2. Insert your PIV card
3. Open a new Terminal tab and enter your PIV code when prompted
4. If you haven't already, clone the [identity-devops](https://github.com/18F/identity-devops) repo and `cd` into it
5. Run this (or your alias if you set one up). You should now be SSH'd into one of the production servers.
    ```bash
    aws-vault exec prod-power -- bin/ssm-instance --newest asg-prod-idp
    ```

6. To access the Rails console, run `id-rails-console`. If this is your first time doing this, or if it's been a while since you last used `sudo` in prod, an alert will appear in the `#identity-events` Slack channel. It will say something like `New sudo
Got a new person sudoing.  Make sure that this is OK.` If you see that event in Slack with your username, make sure to respond in that same channel confirming it was you.
7. Once you are in the Rails console, you can look up a user by their email using `User.find_with_email`, such as `User.find_with_email('example.user@gsa.gov')`.

Common user attributes you will want to look up:
- `uuid`
- `totp_enabled?` (this lets you know if they've enabled an Authentication App)
- `identities` (to see which Service Providers they have authenticated with)
- `events` (to see what changes they've made to their account)

All of the above are methods on the user object. For example:
```ruby
user = User.find_with_email('example.user@gsa.gov')
user.uuid
```

