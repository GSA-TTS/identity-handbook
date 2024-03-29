---
title: "AWS IAM User/Group/Role/Account Configurations"
description: "Detailed information about our IAM configurations, and how to add/alter IAM components within our infrastructure."
layout: article
category: Platform
---

## Overview

A set of modules in [`identity-terraform`](https://github.com/18F/identity-terraform) are used to create the full mappings between the users, groups, roles, and accounts across the org. Please refer to the [AWS Accounts and IAM Groups/Roles]({% link _articles/platform-aws-accounts-and-roles.md %}) page for specific data about our existing AWS accounts/groups/roles/etc.

## Terraform Configuration

### `terraform/master/global/main.tf`

The `main` module within `main.tf` contains all of the variable values used to build each configuration:

1. [`aws_account_types`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L21)
   * **What It Is:** Mapping of account _types_ and _ID numbers_, with comments included to specify which account is which.
   * **Module Used:** [`identity-terraform/iam_masterassume`](https://github.com/18F/identity-terraform/tree/main/iam_masterassume)
   * **What It Does:** Along with the `role_list` variable, generates IAM "AssumeRole" policies for each account type.
   * **How It Fits:** Allows (if desired) a lower number of individual AssumeRole policies to be created.
2. [`role_list`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L72)
   * **What It Is:** List of IAM _roles_ available within all AWS accounts.
   * **Module Used:** [`identity-terraform/iam_masterassume`](https://github.com/18F/identity-terraform/tree/main/iam_masterassume)
   * **What It Does:** Along with the `aws_account_types` variable, generates IAM "AssumeRole" policies for each account type.
   * **How It Fits:** Specifies all available roles, allowing for easier templating of AssumeRole policies.
3. [`group_role_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L39)
   * **What It Is:** Mapping of _IAM groups_, their available _roles_, and which _account types_ they can Assume those roles in.
   * **Module Used:** [`identity-terraform/iam_assumegroup`](https://github.com/18F/identity-terraform/tree/main/iam_assumegroup)
   * **What It Does:** Generates IAM Groups and attaches _existing_ IAM policies (i.e. those generated by `iam_masterassume` above) to them.
   * **How It Fits:** Creates the actual groups and provides per-role per-account access to users within the groups.
4. [`user_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L89)
   * **What It Is:** Mapping of IAM _users_ to their respective _groups_.
   * **Module Used:** [`identity-terraform/iam_masterusers`](https://github.com/18F/identity-terraform/tree/main/iam_masterusers)
   * **What It Does:** Generates IAM users and their group memberships, and attaches a "ManageYourAccount" IAM policy to each user, which allows them to log in and reset their password, Access/Secret Keys, and MFA device(s).
   * **How It Fits:** Used to generate/manage the actual IAM login profiles for each user, and sets their permissions via which group(s) they are added to.

### `terraform/all/`

Within `all` are two components used to create the IAM roles available within each account, via the [`identity-terraform/iam_assumerole` module](https://github.com/18F/identity-terraform/tree/main/iam_assumerole):

1. `module/`: contains all `.tf` template files which generate the IAM Role and Policy, along with any optionally-specified custom policies to attach to the role.
   
   * Each IAM resource set should be in a file named `iam-role-<CLI POSTFIX>.tf` as from the list above.
   * Each file should specify the role _Name_, which _`*_enabled`_ variable is used to toggle its creation, and the _two `local` variables `master_assumerole_policy` and `custom_policy_arns`_, which permit AssumeRole access from a human user's central AWS account and attach the `rds_delete_prevent` and `region_restriction` policies to the role.
   * The actual IAM permissions granted by a role's Policy should also be included in the file, in a _list_ named `iam_policies`. Each list item should include a `policy_name`, `policy_description`, and the actual `policy_document` as a list of the Statements for a policy. Most files will only contain 1 item in the `iam_policies` list; however, since AWS restricts the size of an individual IAM policy, longer policies (i.e. with more granular permission specs) will often be broken into multiple items.
   
   Aside from the above files, the `variables.tf` file should include each `*_enabled` variable which will enable/disable creation of the associated role, i.e.:
   ```
    variable "iam_power_enabled" {
      description = "Enable power role in this account."
      type        = bool
      default     = true
    }
   ```

2. `<CLI_PREFIX>/main.tf`: Each directory named by one of the account-based CLI Prefixes above should contain a `main.tf` file which specifies, within a _`main` module_, if there are any `*_enabled` values which differ from the defaults specified in `module/variables.tf`. Example:
   ```
   module "main" {
     source = "../module"
   
     iam_account_alias            = "some-account-name"
     iam_kmsadmin_enabled         = true
     dashboard_logos_bucket_write = true
   }
   ```
   The **KMSAdministrator** role is disabled by default (`iam_kmsadmin_enabled` is set to _false_ in `module/variables.tf`), so setting `iam_kmsadmin_enabled = true` overrides the default and will cause the role/policy/attachments to be created.

## Making Changes to Access

Any of the changes listed below will require a pull request in `identity-devops`, and a `tf-deploy` run of `master/global` successfully applied, before they are live.

### IAM Users

_To create a new IAM user profile, make changes to_:

1. **Variable:** [`user_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L89)
2. **Format:** `"first.last" = ["group1", "group2", ...],`.

User permissions are set on an _additive_ basis, via their group(s). Add a user to multiple groups if a single group does not provide sufficient permissions for their work.

### IAM Groups

_To create a new IAM group, make changes to_:

1. **Variable:** [`group_role_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L39)
2. **Format:**
```
"name" = [
  { "RoleOne"         = [ "AccountType1", "AccountType2", ... ] },
  { "RoleTwo"         = [ "AccountType1", "AccountType2", ... ] },
  { ... }
],
```

Group permissions are set on a _whitelist_ basis, as per the mappings specified here. If a group has role access for a specific AccountType, they do NOT have access to that role in other AccountTypes, unless those AccountTypes are ALSO specified.

### IAM Roles
_To create a new IAM role, make changes to the following_:

* In `terraform/all`:

   1. Create a new `iam-role-<CLI POSTFIX>.tf` file in `module/`. (You may base it off one of the other template files for the sake of formatting, if desired.)
   2. Follow the requirements specified in [the `terraform/all` section above](#terraformall) when configuring the role template file.
   3. Add the new `<CLI POSTFIX>_enabled` variable to `module/variables.tf`. Most of the time, you will want to set the default value to **true** for a new role.
   4. If any specific AWS account(s) should not follow the default `enabled` value specified, add the necessary logic to the account's respective `<CLI_PREFIX>/main.tf` file.
   After this, run `tf-deploy all/<CLI_PREFIX>` for each account to add the role (or, in the case of disabled roles, to keep Terraform's state up to date).

* In `terraform/master/main.tf`:
   1. Add the new role name to the [`role_list`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L72).
   2. For each **group** and **account type** mapping that needs access to the role, update [`group_role_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L39) accordingly:
   ```
   "group1" = [
     { "Role" = [ "AccountType1", "AccountType2", ... ] },
   ],
   "group2" = [
     { "Role" = [ "AccountType1", "AccountType2", ... ] },
   ],
   ...
   ```

Role permissions, like group permissions, are set on a _whitelist_ basis. If a group has role access for a specific AccountType, they do NOT have access to that role in other AccountTypes, unless those AccountTypes are ALSO specified.

### AWS Account Types

_To create a new category of AWS account(s), make the following changes_:

1. Add the category as an AccountType to [`aws_account_types`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L21) in the format of:
   ```
   "AccountType" = [
     "111122223333", # <ACCOUNT NAME> alias
     "444455556666", # <ACCOUNT NAME> alias
     ...
   ],
   ```
   Each line should include the AWS Account ID number, as well as the precise AWS account alias (as specified in `terraform/all/<CLI PREFIX>/main.tf`), of all AWS accounts within the AccountType.
2. For each **group** and **role** mapping that the new AccountType should support, update [`group_role_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L39) accordingly:
   ```
   "group1" = [
     { "RoleOne"         = [ "AccountType" ] },
     { "RoleTwo"         = [ "AccountType" ] },
     { ... }
   ],
   "group2" = [
     { "RoleOne"         = [ "AccountType" ] },
     { "RoleTwo"         = [ "AccountType" ] },
     { ... }
   ],
   ...
   ```

An individual AWS IAM account can only be part of _one_ AccountType. If you require more granular permission control, you will need to create additional AccountTypes.

### Adding IAM Permissions To A New AWS Account

If a new AWS account is added to the Login.gov organization, the following changes will be needed to provide IAM permissions/access to it.

_Prerequisites:_
* Determine the **Friendly Name**, **Alias**, **CLI Prefix**, **AWS Account ID**, and **Account Type** as per the other examples in [the AWS Accounts matrix]({% link _articles/platform-aws-accounts-and-roles.md %}). Add a new line with those values to the matrix as part of a PR update to this document.
* Verify that there is at least one NON-Terraform-managed IAM user profile with the equivalent of _FullAdministrator_ permissions within the account. This user will perform the initial run of `terraform/all` to create the Roles in the account, allowing users within `terraform/master` to Assume these Roles.

_Steps:_
1. Create a new directory in `terraform/all` named with the _CLI Prefix_ of the account.
2. Copy over the `env-vars.sh` and `main.tf` files from another account's directory, and update the various values within the new files (i.e. AWS account ID number, `AWS_PROFILE` value, account alias, and any `enabled` values requiring non-default specification).
3. Run `tf-deploy all/<CLI_PREFIX>` as the non-managed admin user in order to create the IAM roles in `terraform/all/module` within the account.
4. Add the account to its appropriate _Account Type_ list in [`aws_account_types`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L21), or [create a new AccountType](#aws-account-types) if the available options are too broad.
5. Verify the groups, roles and AccountTypes in the [`group_role_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L39), and update them if necessary.
6. Do the same for [`user_map`](https://github.com/18F/identity-devops/blob/main/terraform/master/global/main.tf#L89) if any user(s) need(s) to have their group-based permissions changed.
7. Run `tf-deploy global/master apply` to create the AssumeRole policies and attachments as specified.
