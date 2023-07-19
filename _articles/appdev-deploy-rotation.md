---
title: "Deployer Rotation"
layout: article
category: "AppDev"
subcategory: "Oncall"
description: "Spreadsheet to track the AppDev Deployer"
---

The App-Dev team maintains a rotation for engineers who deploy the app.
Each week a new engineer is assigned from the rotation.

See the [rotation spreadsheet](https://docs.google.com/spreadsheets/d/1nLxhwVh4EfxdmqsvdFByxTk0bNSTyWGGBEXLODjlk6U/edit#gid=0).

## Overriding the deployer for a given week

Occasionally a deployer will need to trade weeks with another deployer to provide coverage.

The deployer should find someone who is willing to switch a week the them in advance of their deploy week.
Once someone is identified, add a note to the rotation saying who the overrides is for their weeks.

## Updating the roster

The roster is intended to be updated as people roll-on or roll-off of Login.gov.

When a new person is added to the roster the future assignments will be shifted.
Make sure to post in `#login-appdev` and alert the next deployer if that slot has changed.

#### Adding to the rotation

To add someone, first change the value of the cell for the current deployer to include the deployer's name instead of the Sheets function.
This will minimize disruptions for future assignments.

Next, add the new person to the roster before the current deployer.

The new person should appear in future deployer slots.

#### Remove from the rotation

To remove someone from the rotation, first change the value of the cell for the person in the slot right
before their next occurrence.
Do this by replacing the deployer's name with the function in the cell value.
This will minimize disruptions for future assignments.

Next, remove the person from the roster.

All of the slots from the next time this person is on-call going forward should shift up.
