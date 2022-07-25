---
title: "Provisioning Test IDV Users for Partners"
layout: article
description: "The steps necessary to set up a collection of test users with IDV profiles for a partner in the sandbox."
category: Partnerships
---

On rare occasions, a partner may ask us to provision a collection of users with specific attributes on their behalf to facilitate testing. We may agree to do so **only in our sandbox environment** if the number of users needed is large enough where manually provisioning them would be cost prohibitive from a timing perspective (e.g. greater than 30). These users will be set up with dummy emails and backup codes for MFA, which will be shared with the partner after provisioning along with the secret key for resetting a user's password without deactivating their IDV profile.

## Requirements

1. Have the partner fill out the [example CSV file]({% link public/user_provisioning_example.csv %}) or provide you with a list of user attributes for the users to be provisioned, specifically including:
  * First name
  * Last name
  * Date of birth (formatted like `YYYY-MM-DD`, **watch out for Excel shenanigans here**)
  * Social security number
  * Phone number (optional)
  * Street address line 1
  * Street address line 2 (optional)
  * City
  * State abbreviation
  * Zip code

2. We will also need a hostname for setting up the dummy email addresses. Generally, we will just make it up ourselves to ensure uniqueness.
  * This domain must be **globally** unique since the email addresses themselves follow the pattern `user0@DOMAIN`, `user1@DOMAIN`, etc.
  * One recommended format would be something like `testYYYYMMDD.AGENCY_ABBREVIATION.gov`, e.g. `test20210124.gsa.gov`.

**Important:** If you export the CSV file from Microsoft Excel, you may run into encoding issues. In that case use the `dos2unix` utility to ensure everything runs smoothly.

```sh
dos2unix /path/to/users.csv
```

## Provisioning the users

Assumptions:

* The user attribute CSV is located at `/path/to/users.csv`
* The email domain will be `foo.example.com`

### Identify the server

We will need a specific server to work with since we will be transferring files to and from the local filesystem. Open up the [`18F/identity-devops`](https://github.com/18F/identity-devops) repository, make sure you're working off the latest `main` branch, and run the following to view the list of currently running servers in the `int` environment:

```sh
bin/awsv sandbox bin/ls-servers -e int
```

In the table that is displayed you will see a number of rows like

```
| i-LONGHEXNUMBERHERE | ami-LONGHEXNUMBERHERE | asg-int-idp           | c5.2xlarge    | us-west-2a | running | 2021-01-20 07:00:14 UTC | 00h05m | HEXNUMBER |
```

The first column contains the **instance ID**, so copy one of them and save it to the `INSTANCE_ID` shell variable:

```sh
export INSTANCE_ID=i-LONGHEXNUMBERHERE
```

### Upload the CSV file

We will now need to copy the CSV containing the user attributes to the server so we can pass it to the rake task that will provision the user. Run the following command from within the `identity-devops` repository:

```sh
bin/awsv sandbox bin/scp-instance /path/to/users.csv $INSTANCE_ID:/tmp/users.csv
```

### Run the provisioning script

**Note:** This script can take a long time to run; for context, provisioning 700 users takes almost 15 minutes.

First, if you're not already on the server, use `ssm-instance` to shell into it:

```sh
bin/awsv sandbox ssm-instance $INSTANCE_ID
```

Then, `cd` to the app directory and run the script, passing in the appropriate environment variables:

```sh
cd /srv/idp/current
sudo -u websrv CSV_FILE=/tmp/users.csv EMAIL_DOMAIN=foo.example.com bin/rake partners:seed_users
```

At this point, wait until the script finishes; at this time there is no progress indicator, unfortunately. You may choose to monitor the `int` environment's performance using the `int-idp-workload` [CloudWatch Dashboard](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=int-idp-workload;start=PT1H) - you should see a sustained CPU usage increase as well as an increase in `kms-encrypt-password-digest` events.

If the script finishes successfully there should be a new file on the server at `/tmp/users-updated.csv` with the credentials for the new users.

### Download the output CSV

We will now need to download the `users-updated.csv` file so we can share it with the partner. If you're using SCP, exit the `ssm` session and run the following command, again from the `identity-devops` repo:

```sh
bin/awsv sandbox bin/scp-instance $INSTANCE_ID:/tmp/users-updated.csv ~/Downloads # or the location of your choice
```

### Clean up

Once you have retrieved the output file, you should delete both files from the server. Reopen a `ssm` session to the instance you were using and delete the two CSV files from the `/tmp` directory.

### Send the output CSV to the partner

Finally, we will need to send the output CSV file to the partner. Following [GSA IT guidelines](https://insite.gsa.gov/employee-resources/information-technology/do-it-yourself-self-help/google-g-suite-apps/google-gmail/how-to-create-fipscompliant-zip-files), we need to create a FIPS-compliant encrypted .zip archive and then send the partner the file and the password in separate emails.

#### Encrypting the .zip archive

Follow the instructions in the page linked above to use the WinZip FIPS applications in a Citrix VDI environment to generate the encrypted .zip archive.

Tips:

* You can generate a nice random string for the password using `SecureRandom.urlsafe_base64(14)` in a Ruby console (you might need to `require 'securerandom'` if it's not a Rails console).
* You can transfer the files to the Citrix VDI using Google Drive or just mounting your local filesystem to the virtual desktop (which is easiest).
* Don't forget to rename the file to something meaningful!
* It's generally worth checking that you can open the encrypted .zip archive on your GFE with the password before emailing it.

#### Emailing the archive

As stated above, send the encrypted .zip archive to the partner via email as an attachment. Following that, send a separate email to the partner (preferably directly to an individual and not to a shared inbox / mailing list) with the password in the body of the email.
