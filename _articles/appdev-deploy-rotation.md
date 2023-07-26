---
title: "Deployer Rotation"
layout: article
category: "AppDev"
subcategory: "Oncall"
description: "Spreadsheet to track the AppDev Deployer"
---

The AppDev team maintains a rotation for engineers who deploy the app.
Each week a new engineer is assigned from the rotation.

See the [rotation spreadsheet](https://docs.google.com/spreadsheets/d/1nLxhwVh4EfxdmqsvdFByxTk0bNSTyWGGBEXLODjlk6U/edit#gid=0).

## Responsibilities of the deployer

The deployer is responsible for the [twice-weekly deployments][deploy-guide] for IdP and PKI application revisions.

A deployer should coordinate with the rest of the AppDev team as part of the release cycle:

- Compiling and sharing release notes, as outlined in the [deploy guide][deploy-guide]
- Making requested revisions to release notes
- Accommodating reasonable requests for late or patch revisions to a release candidate branch
- Sharing progress updates during the deploy itself

[deploy-guide]: {% link _articles/appdev-deploy.md %}

## Overriding the deployer for a given week

Occasionally a deployer will need to trade weeks with another deployer to provide coverage.

The deployer should find someone who is willing to switch a week the them in advance of their deploy week.
Once someone is identified, add a note to the rotation saying who the overrides is for their weeks.

## Updating the roster

The roster is intended to be updated as people roll-on or roll-off of Login.gov.
If a person is going to be out on extended leave for long enough to miss more than 1 full rotation cycle they should also be removed.

When a new person is added to the roster the future assignments will be shifted.
Make sure to post in `#login-appdev` and alert the next deployer if that slot has changed.

#### Adding to the rotation

To add someone, first change the values of the previous deployers to include the deployers' names instead of the Sheets function.
Include
Copy cells for past deployers with cmd-C or ctrl-C, then right click, Paste Special, Values Only (cmd-shift-V or ctrl-shift-V).
This will minimize disruptions for future assignments by preventing changes up to the point where the Sheets function starts populating values.

Next, add the new person to the roster before the current deployer.

The new person should appear in future deployer slots.

#### Remove from the rotation

To remove someone from the rotation, first change the values of the cells for past and future deployers
up until the next time the person is question is on the schedule.
Copy cells for deployers with cmd-C or ctrl-C, then right click, Paste Special, Values Only (cmd-shift-V or ctrl-shift-V).
This will minimize disruptions for future assignments by preventing changes up to the point where the Sheets function starts populating values.

Next, remove the person from the roster.

All of the slots from the next time this person is on-call going forward should shift up.
