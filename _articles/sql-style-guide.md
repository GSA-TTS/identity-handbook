---
title: "SQL Style Guide"
description: "Conventions for formatting SQL queries"
layout: article
category: "Reporting"
subcategory: "Queries"
---

This is a guide for writing "raw" SQL queries, used in ETLs and reports. It does
not apply to queries that are auto-generated via ORMs like ActiveRecord.

Currently we do not have any automated linting/enforcement of this guide.

## Keywords

Capitalize keywords

```sql
-- DO
SELECT 1
FROM mytable;

-- DO NOT
select 1
from mytable;
```

## Commas

Prefer leading commas (they usually make for less diff noise when adding or removing items in a list)

```sql
-- DO
SELECT
  col1
, col2
, col3
FROM mytable;

-- DO NOT
SELECT
  col1,
  col2,
  col3
FROM mytablel
```

## `SELECT *`

Avoid `SELECT *` and select specific fields when possible. Using explicit columns
makes analysis of queries easier.

(This rule applies most to checked-in code. For running test queries interactively,
`SELECT *` is totally fine).

```sql
-- DO
SELECT
  col1
, col2
, col3
FROM mytable;

-- DO NOT
SELECT *
FROM mytable;
```
