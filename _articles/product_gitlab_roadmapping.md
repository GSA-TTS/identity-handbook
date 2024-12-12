---
title: Gitlab Roadmapping
description: >
  Guide to roadmapping in Gitlab
layout: article
category: Product
subcategory: Gitlab
---

# Step-by-Step Guide: Creating and Accessing a Roadmap in GitLab
This guide explains how to create and manage a roadmap in GitLab, offering a structured approach to track progress and align work with strategic goals. It includes an overview of GitLab’s hierarchy to provide the necessary context for roadmap creation.
## GitLab Hierarchy: Building the Foundation for a Roadmap
In GitLab, work can be organized into a structured hierarchy to provide clarity and alignment with strategic goals.. Here's a breakdown:
## Epic
Acts as a container for related work, including child epics and issues.
Example: Improve Reporting Capabilities.

## Child Epic
A subset of the parent epic, focusing on specific phases or deliverables.
Helps break down the parent epic into smaller, manageable goals. Child Epics are optional.
Example: Under Improve Reporting Capabilities Epic, Child Epics could be: 1> Develop PDF Export Feature 2> Interactive Dashboard Development and Integration

## Issue
Represents individual user stories, bugs, or  tasks that contribute to the completion of an epic and child epic.
Example: Under Develop PDF Export Feature Child Epic, Issues could be: 1> Develop report which can be exported to PDF. 2>  Add Export PDF Button for UI.

## Hierarchy Overview
Parent Epic → Child Epic → Issue
This hierarchy ensures that all issues trace back to strategic goals via epics.

## Steps to Create and access Roadmap
The GitLab Roadmap feature provides a visual representation of epics and their timelines, enabling teams to plan, track, and communicate project progress effectively. Follow these steps to create and manage your roadmap effectively:
Plan your Roadmap
Define Goals: Break down high-level objectives into epics and delivery phases into child epics.
Set Timelines: Assign start and end dates for each epic to map them on the roadmap.
Hierarchy: Organize parent epics, child epics, and issues for clarity.


## Create a parent Epic
Navigate to your Group in GitLab.
Click Epics in the sidebar, then select New Epic.
Add the following details:
Title: Name the epic clearly (e.g., Improve Reporting Capabilities).
Description: Provide a detailed objective or goal.
Start Date and Due Date: Define the timeframe for the epic.
Labels: Select appropriate labels for categorization (e.g., Priority: Now, Team: Evelyn, EpicType: Parent). Labels are optional but greatly enhance the organization, searchability, and filtering of issues, epics, making it easier for teams to prioritize tasks, track progress, and collaborate effectively.
Save the epic.

## Create and Link Child Epics (Optional)
Open the parent epic.
Scroll to the Child Epics section and click Add a Child Epic.
Link existing epics or create new ones to represent sub-goals.
Select appropriate labels for categorization (e.g. Team: Evelyn, EpicType: Child)
Ensure each child epic has its own start and due dates.

## Associate Issues with Epics
Open a parent or child epic.
Scroll to the Linked Issues section and click Add Issue. Either link existing issues or create new ones.
Alternatively, you can navigate to Issues in the left sidebar, click New Issue in the top right corner to create a new issue and select the appropriate epic from the Epic dropdown menu to link the issue with the desired epic.
Use issues to detail specific tasks contributing to the epic’s completion.

## Access the Roadmap View
Go to Plan in the left sidebar and select Roadmap.
The roadmap will display all epics with start and end dates on a timeline.

## Key Components of the Roadmap Page
Timeline: 
Displays epics as horizontal bars based on their start and end dates.
Adjust the timeframe to show weekly, monthly, or quarterly views.

### Epics:
Parent epics are bold, and child epics are indented beneath them.
Hovering over an epic bar reveals details such as description, labels, and milestones.

### Progress Indicator:
Shows the percentage of issues completed within an epic.

### Filters and Search:
Filter by team, milestone, or label to focus on specific parts of the roadmap.
The search bar allows for quick navigation to a particular epic.

### Dependencies:
Displays relationships between epics (e.g., Blocks, Is Blocked By).

### Regularly Update the Roadmap
Update epics and issues as work progresses to keep the roadmap current.
Use the roadmap in planning sessions to review timelines and adjust priorities.

By following these steps and leveraging the roadmap view effectively, Login.gov Teams can align their efforts with strategic goals and maintain transparency across all stakeholders.
