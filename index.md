---
title: Login Handbook
permalink: /
layout: article
---

Welcome to the Login.gov handbook! This is our open source team documentation!

Please help us contribute and keep things up to date, and make sure
to [avoid contributing sensitive information][sensitive-information].

[sensitive-information]: {{ site.baseurl }}/articles/contributing.html#sensitive-information

{% assign all_categories = site.articles | map: "category" | uniq | sort %}
{% assign highlight_categories = site.data.highlight_categories %}
{% assign highlight_categories_titles = site.data.highlight_categories | map: "title" %}

{% for category in highlight_categories %}
{%   include articles_category.md
             category=category.title
             articles=site.articles
             description=category.description
             custom_order=category.custom_order %}
{% endfor %}
{% for category in all_categories %}
{%   unless highlight_categories_titles contains category %}
{%     include articles_category.md
               category=category
               articles=site.articles %}
{%   endunless %}
{% endfor %}
