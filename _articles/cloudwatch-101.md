---
title: "CloudWatch Insights 101"
description: "Basic guide to querying against our logs with CloudWatch Insights"
layout: article
category: "Reporting"
subcategory: "CloudWatch"
toc_h_max: 4
---

## Prerequisites

You will need an AWS account and access. See [setting up aws-vault][aws-vault] for more information.

[aws-vault]: {% link _articles/platform-setting-up-aws-vault.md %}

### Getting to CloudWatch Insights

1. Log in to AWS

    ```bash
    # depending on the roles you have pick between
    aws-vault login prod-analytics
    # or
    aws-vault login prod-power
    ```

1. Search for "CloudWatch"

    ![screenshot showing how to search for CloudWatch in the AWS Console]({{ site.baseurl }}/images/aws-cloudwatch-home.png)

1. Select "Logs Insights"

    ![screenshot showing the Logs Insights menu item in CloudWatch]({{ site.baseurl }}/images/aws-cloudwatch-logs-insights.png)

### Running a query

![screenshot of the query interface for CloudWatch Insights]({{ site.baseurl }}/images/aws-cloudwatch-query.png)

1. Make sure to select a log group. For most queries, we want **prod_/srv/idp/shared/log/events.log**. In the "Select up to 50 log groups" combobox, type in "events.log" to filter down the list and select the **prod_** one.

1. Set the time range. For consistency across timezones, we recommend the **UTC** timezone.

1. Write your query, and hit "Run Query"

If you are comfortable with the command line, you can also use our [query-cloudwatch][query-cloudwatch] script, which can be useful for batch processing.

## Common Queries

### Filtering by event

{%- capture info -%}
See [Analytics Events][analytics-events] for the most up-to-date documentation of individual events and their fields.
{%- endcapture %}
{% include alert.html content=info alert_class="usa-alert--info" %}

This query filters down to one event, ["SP redirect initiated"][sp-redirect-initiated]:

```
fields @timestamp, name, properties.event_properties.success, @message
| filter name = 'SP redirect initiated'
| limit 10000
```

This query filters to any one of multiple events:

```
fields @timestamp, name, properties.event_properties.success, @message
| filter name in ['SP redirect initiated', 'User registration: complete']
| limit 10000
```

[sp-redirect-initiated]: https://lg-public.pages.production.gitlab.login.gov/identity-internal-handbook/articles/analytics-events.html#sp-redirect-initiated

### Filtering by user

The Login.gov internal UUID is logged as `properties.user_id`, so we can filter based on that.

A query for one user:

```
fields @timestamp, name, properties.event_properties.success, @message
| filter properties.user_id = 'aaaa-bbbb-cccc-dddd'
| limit 10000
```

A query for multiple users:

```
fields @timestamp, name, properties.event_properties.success, @message
| filter properties.user_id in ['aaaa-bbbb-cccc-dddd', '1111-2222-3333-4444']
| limit 10000
```

## Writing Queries

The [AWS documentation for CloudWatch Insights][aws-docs] is fairly thorough. If anything is left unaswered after reading this guide, that documentation is likely to contain the answer.

### Similarity to SQL

If you've used SQL, a lot of concepts map to CloudWatch Insights queries nicely:

| SQL | CloudWatch Insights |
| --- | ------------------- |
| `SELECT` | `fields` or `display` |
| `WHERE` | `filter` |
| `GROUP BY` | `stats ... by` |
| `ORDER BY` | `sort` |
| `LIMIT` | `limit` |

### Limitations and Workarounds

#### Joins

CloudWatch Insights does not support joins

#### Max 10,000 rows

[query-cloudwatch][query-cloudwatch] script with the `--complete` option

#### Too many fields

CloudwatchInsights gives up on parsing after there are too many fields in a blob. To work around it, export the full `@message` field and parse it externally, such as in Ruby

#### Array iteration

Similar to [too many fields](#too-many-fields), this can be worked around by parsing externally.

Another approach is to use the [`parse`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Parse.html) command to manually parse out a specific field

#### `count_distinct`

Briefly: **Do not use `count_distinct`, it is inaccurate**

From the [AWS documentation on `count_distinct`][count-distinct]:

> Returns the number of unique values for the field. If the field has very high cardinality (contains many unique values), the value returned by count_distinct is just an approximation.

To work around this, consider doing post processing externally. Another option, if there are fewer than 10,000 things is to do:

```
| stats count(*) by PROPERTY_TO_COUNT
```

[aws-docs]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
[count-distinct]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Stats.html#:~:text=Returns%20the%20number%20of%20unique%20values%20for%20the%20field.%20If%20the%20field%20has%20very%20high%20cardinality%20(contains%20many%20unique%20values)%2C%20the%20value%20returned%20by%20count_distinct%20is%20just%20an%20approximation.

[query-cloudwatch]: {% link _articles/devops-scripts.md %}#query-cloudwatch

## See Also

- [Devops CloudWatch guide](https://gitlab.login.gov/lg/identity-devops/-/wikis/Guide:-Cloudwatch-Logs,-Metrics-and-Dashboards)
- [Analytics Events Documentation][analytics-events]
- [AWS documentation for CloudWatch Insights][aws-docs]

[analytics-events]: {% link _articles/analytics-events.md %}