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

The cases below sound similar, but each situation has its own considerations. For more complex
changes, you may want to [test in the 50/50 state](#test-in-the-5050-state).

## Database changes

### Add a table or field
* Deploy 1: Add the migration, write to the new table/field. Optionally add a rake task to update
existing data.
* After deploy (optional): Run the rake task to update existing data.
* Deploy 2: Read from the table/field.

## Persistent data structures

When adding, removing, or renaming fields from a data structure that is persisted in redis, such as
`user_session`, `idv_session`, or `document_capture_session`, it could be saved from a new instance
and read by an old one, or vice versa.

### Add a field
* Deploy 1: Write to the new field but do not use it
* Deploy 2: Read from the field

### Remove a field
* Deploy 1: Remove everywhere that reads the field
* Deploy 2: Remove the field

### Rename a field
* Deploy 1: Write to the new name everywhere the old name is written. Read from both fields with
`new_name || old_name`
* Deploy 2: Remove references to the old name

## Jobs

Job requests could be enqueued by a new instance and picked up by an old one, or vice versa. When an
argument is added or removed, it causes 500 errors from ArgumentError.

### Add an argument to a job #perform method
* Deploy 1: Add the argument with a default value (usually nil) and do not use it
* Deploy 2: Use the argument, and gracefully handle the default value
* Deploy 3 (optional): Make the argument required

### Remove an argument from a job #perform method
* Deploy 1: Remove all uses of the argument within the job, and add a default value
* Deploy 2: Remove the argument in calls to the job (can be combined with the first deploy if there
was already a default value)
* Deploy 3: Remove the argument

## Routes

When adding or changing a route, a new instance could serve a route to an old instance, which would
not recognize it.

When deleting a route, an old instance could request the route, and a new instance would not
recognize it.

### Add a route
* Deploy 1: Add the fully functional route and controller action
* Deploy 2: Link and redirect to the route as needed

### Delete a route
* Deploy 1: Remove all links and redirects to the route
* Deploy 2: Change the route to a redirect if possible to avoid user 404s from bookmarks.
* Deploy 3: 2-4 weeks later, check logs and remove the deprecated route.

### Rename a route
* Deploy 1: Add the new route and controller action. Make the old route point to the new controller.
* Deploy 2: Delete the old controller action.
* Deploy 3: 2-4 weeks later, check logs and remove the deprecated route.

## Feature flags

### Change a feature flag or config value
When a config value is changed, half the instances will have the new value and half
will have the old value during the deploy. Make sure that changing the value does not include any
of the cases above.

* Deploy 1: Change the flag value
* Make any of the above changes that are needed in following deploys

## Test in the 50/50 state
When making a large change such as adding a new page to the Identity Verification flow, it can be
helpful to test in the 50/50 state. Large changes are developed behind a feature flag and then
turned on.

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
This will take 10-15 minutes. Just wait for 15 min.
You will see old instances that will start to say draining
You will know it is ready when you only have new workers and idp instances up- check the time- should be minutes
1. Set your feature flag to true
```
aws-vault exec sandbox-power -- ./bin/app-s3-secret --env int --app idp --edit
```
Add the flag in alphabetical order 
ESC, :wq to exit vim
Examine diff, y to save changes
copy/paste diff to Slack thread about recycle in #login-appdev
1. Double the number of instances
This gives you half new instances with the flag set to true, and
half old instances with the flag set to false.
```
aws-vault exec sandbox-power -- ./bin/asg-size int idp # (outputs current number of idp instances x)
aws-vault exec sandbox-power -- ./bin/asg-size int idp 2x
aws-vault exec sandbox-power -- ./bin/asg-size int worker # (outputs current number of worker instances y)
aws-vault exec sandbox-power -- ./bin/asg-size int worker 2y
```
Check the servers to make sure they are all up 
1. TEST!
1. Restore settings
Post in slack what you are putting them back to
Set number of instances back to normal numbers with asg-size. This leaves the feature flag on because the old instances are removed.
```
aws-vault exec sandbox-power -- ./bin/asg-size int idp x
aws-vault exec sandbox-power -- ./bin/asg-size int worker y
```
