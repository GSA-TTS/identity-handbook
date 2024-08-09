---
title: How to Manage the 50/50 State
description: >
  During deploys, both new and old instances are serving requests. This is called the 50/50 state
  and requires careful management when changing code that is used across instances.
category: "AppDev"
subcategory: "Development"
layout: article
---

## Introduction

During deploys, we add new instances before shutting down old ones, so both new and old instances
are serving requests for at least 15 minutes. This is called the 50/50 state and requires careful
management when changing code that is used across instances.

You can test the 50/50
state locally by loading a page on your new branch, killing the server, checking out main,
restarting the server, and then
clicking on a link on the page (new instance), which will load the next action on main (old
instance). For more complex
changes, you may want to [test in the 50/50 state](#test-in-the-5050-state) in a lower environment.

The cases described below sound similar, but each situation has its own considerations.

## Database changes

### Add a table or field
* Deploy 1: Add the migration, write to the new table/field. Optionally add a rake task to update
existing data.
* After deploy (optional): Run the rake task to update existing data.
* Deploy 2: Read from the table/field
* **Optional**: If a new column is not PII and we want it to be available in the Data Warehouse, add it
  to the [DMS config YML file][data-warehouse-config] in the devops repo.

### Remove a table or field
* Deploy 1: Remove all reads in the code
    * If removing a field from an in-use table, mark that field as an ignored columns.
      This is necessary in the IDP because it is [configured to explicitly load columns][idp-explicit-config]
      instead of using `SELECT *`.

      ```ruby
      class MyTable < ApplicationRecord
        self.ignored_columns = %w[my_column_to_drop]
      end
      ```

* Deploy 2: Remove all writes in the code
* Deploy 3: Remove the table/field
    * If removing a field, the field can be removed from the ignored columns list
    * If removing a table, the entire model file can be removed
* Devops Repo: Check if the table/column was replicated to the Data Warehouse via DMS (check the [DMS config YML file][data-warehouse-config], and make a PR to remove).

[data-warehouse-config]: https://gitlab.login.gov/lg/identity-devops/-/blob/main/terraform/app/dms-filter-columns-transformation-rules.yml

[idp-explicit-config]: https://github.com/18F/identity-idp/blob/c4a0cc098867a209f8196c312024b24001b6fa9b/app/models/application_record.rb#L6-L7

## Persistent data structures in redis

When adding, removing, or renaming fields from a data structure that is persisted in redis, such as
`user_session`, `idv_session`, or `document_capture_session`, it could be saved from a new instance
and read by an old one, or vice versa.

### Add a field
* Deploy 1: Add the field and write to it
* Deploy 2: Read from the field

### Remove a field
* Deploy 1: Remove everywhere that reads the field
* Deploy 2: Remove all writes to the field
* Deploy 3: Remove the field

### Rename a field
* Deploy 1: Add the new name. Write to the new name everywhere the old name is written. Read from both fields with
`new_name || old_name`
* Deploy 2: Remove references to the old name

## Jobs

Job requests could be enqueued by a new instance and picked up by an old one, or vice versa. When an
argument is added or removed to #perform, it causes 500 errors with ArgumentError if the argument
is not optional.

### Add an argument to a job #perform method
* Deploy 1: Add the argument with a default value (usually nil)
* Either in Deploy 1 or 2: Use the argument within the #perform method and
gracefully handle the default value. It is easier to test when calling #perform in the PR for
Deploy 2.
* Deploy 2: Use the argument when calling #perform
* Deploy 3 (optional): Make the argument required

### Remove an argument from a job #perform method
* Deploy 1: Remove all uses of the argument within the job, and add a default value
* Deploy 2: Remove the argument in calls to the job (can be combined with the first deploy if there
was already a default value)
* Deploy 3: Remove the argument

### Add a new job
* Deploy 1: Add the new job
* Recommended: Test the job in lower environments, and then log in and run it on a production
instance
* Deploy 2: Schedule the job to run, start enqueueing jobs

## Routes

When adding or changing a route, a new instance could serve a route to an old instance, which would
not recognize it.

When deleting a route, an old instance could request the route, and a new instance would not
recognize it. Additionally, users might have bookmarked the route.

### Add a route
* Deploy 1: Add the fully functional route and controller action
* Deploy 2: Link and redirect to the route as needed

### Delete a route
* Deploy 1: Remove all links and redirects to the route
* Deploy 2: Change the route to a redirect if possible to avoid user 404s from browser history or
bookmarks.
* Deploy 3: 2-4 weeks later, check `production.log` request logs and remove the deprecated route.

### Rename a route
* Deploy 1: Add the new route and controller action. Map the old route to the new controller
and move to the deprecated section of `routes.rb`.
* Deploy 2: Delete the old controller action.
* Deploy 3: 2-4 weeks later, check `production.log` request logs and remove the deprecated route.

## Feature flags

### Change a feature flag or config value
When a config value is changed, half the instances will have the new value and half
will have the old value during the deploy. Make sure that changing the value does not include any
of the cases above.

* Deploy 1: Change the flag value
* Make any changes to routes, jobs, and persistent data in following deploys as described above.

## Test in the 50/50 state
When making a large change such as adding a new page to the Identity Verification flow, it can be
helpful to test in the 50/50 state. Large changes are developed behind a feature flag and then
turned on.

The steps below use the int environment, which is also used by partners to test their integrations.
Only use int if you are reasonably confident in your new code. You can also use a team or personal
sandbox. If you use staging, you will need to substitute prod-power for sandbox-power in all the
commands.

The dev environment is not a good choice because it recycles every time there is a merge to main,
which would take it out of the 50/50 state.

To create a long-running 50/50 state in int:
1. Check servers before you start
```
aws-vault exec sandbox-power -- ./bin/ls-servers -e int
```
1. Recycle int, wait for it to complete (this will run migrations if needed)
Notify in #login-appdev about the recycle and 50/50 state testing
```
aws-vault exec sandbox-power -- ./bin/asg-recycle int idp
```
This will take 10-15 minutes. You will know it is ready when you only have new workers and idp
instances up.
1. Set your feature flag to true
```
aws-vault exec sandbox-power -- ./bin/app-s3-secret --env int --app idp --edit
```
* This opens the config file in vim
  * Add the flag in alphabetical order
  * `ESC`, `:wq` to exit vim
* Examine diff, y to save changes
* copy/paste diff to Slack thread about recycle in #login-appdev
1. Double the number of instances
This gives you half new instances with the flag set to true, and
half old instances with the flag set to false.
* First, check how many app instances are desired. For int, the desired number of app instances is 6.
```
aws-vault exec sandbox-power -- ./bin/asg-size int idp
```
* Now double the number of app instances. For int, the new setting will be 12. Substitute your own
calculations if using a different environment.
```
aws-vault exec sandbox-power -- ./bin/asg-size int idp 12
```
* Repeat the check for the workers. For int, the desired number of workers is 4.
```
aws-vault exec sandbox-power -- ./bin/asg-size int worker
```
* And finally, double the number of worker instances. For int, the new setting will be 8.
```
aws-vault exec sandbox-power -- ./bin/asg-size int worker 8
```
Wait for the new servers to fully come online. Check with ls-servers as described above.
1. TEST!
1. Restore the usual number of instances
* Post in slack what you are putting them back to.
* Set number of instances back to normal numbers with asg-size. This leaves the feature flag on
because the old instances are removed. If not using int, substitute the usual desired numbers for
the environment you are using.
```
aws-vault exec sandbox-power -- ./bin/asg-size int idp 6
aws-vault exec sandbox-power -- ./bin/asg-size int worker 4
```
