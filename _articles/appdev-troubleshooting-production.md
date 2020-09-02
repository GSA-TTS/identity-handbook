---
title: "Troubleshooting"
description: Troubleshooting production exceptions and issues reported by customers
layout: article
category: AppDev
---
### Prerequisites

Before you can access any systems, you will need to
 - Obtain a PIV card reader
 - Get cleared for SSH access via PIV into login.gov systems

To get SSH access, the public key from your PIV card must be added to the servers you would like to access.
Follow the instructions at the beginning of [this article](https://login-handbook.app.cloud.gov/articles/piv-ssh.html) to extract your public key and send it to a member of the DevOps team.

## Setting up your machine for SSH access via PIV

TODO(margolis): link to a canonical SSH access setup place

## Looking up a user in the production DB
1. If you are not in a GSA office, make sure to connect to the GSA network via VPN
2. Insert your PIV card
3. Open a new Terminal tab and enter your PIV code when prompted
4. If you haven't already, clone the [identity-devops](https://github.com/18F/identity-devops) repo and `cd` into it
5. Run this (or your alias if you set one up). You should now be SSH'd into one of the production servers.
    ```bash
    aws-vault exec production-power -- bin/ssm-instance --newest asg-prod-idp
    ```

6. To access the Rails console, run `id-rails-console`. If this is your first time doing this, or if it's been a while since you last used `sudo` in prod, an alert will appear in the `#identity-events` Slack channel. It will say something like `New sudo
Got a new person sudoing.  Make sure that this is OK.` If you see that event in Slack with your username, make sure to respond in that same channel confirming it was you.
7. Once you are in the Rails console, you can look up a user by their email using `User.find_with_email`, such as `User.find_with_email('moncef.belyamani@gsa.gov')`.

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

## Looking up a user's activity in Kibana

### SSH into the ELK server
From the root of the `identity-devops` repo:
```bash
AWS_PROFILE=login.gov bin/ssh-instance -L 5601:localhost:5601 asg-prod-elk
```

### Launch Kibana
1. Launch any browser and go to http://localhost:5601


### Look up a user by their UUID
1. In the top right corner, click on `Last 15 minutes`, then click on `Last 30 days`
2. In the search field, delete the `*` and type `events.properties.user_id:"some-uuid"`. Make sure the UUID is enclosed in double quotes.
4. In the left hand column, under `Available Fields`, look for `name` (it should be at the top under `Popular`), hover over it, and click the `add` button. This will show you the names of the events they performed in reverse chronological order. Start at the bottom and work your way up to see their event history.

Note that looking up a user by their UUID will not give you the full picture of what they did since some requests they can make are unauthenticated. To get the full picture, you will also need their `visitor_id`. You can get that by first looking up their UUID, then in the left hand column, click the `add` button next to `visitor_id`. If you're lucky, they used the same browser. If not, you'll need to search each `visitor_id` separately.

### Look up a user by their visitor_id
1. In the top right corner, click on `Last 15 minutes`, then click on `Last 30 days`
2. In the search field, delete the `*` and type `events.visitor_id:"some-uuid"`. Make sure the UUID is enclosed in double quotes.
4. In the left hand column, under `Available Fields`, look for `name` (it should be at the top under `Popular`), hover over it, and click the `add` button. This will show you the names of the events they performed in reverse chronological order. Start at the bottom and work your way up to see their event history.

### Kibana workshop video
Moncef gave an overview of how he uses Kibana, and the session was recorded. You can watch it here: <https://drive.google.com/open?id=1VZdLSx5D_on7mrPZWzPSDP24s_iSBSwb>