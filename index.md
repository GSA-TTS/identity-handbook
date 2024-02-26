---
title: Login Handbook
permalink: /
layout: article
---

Welcome to the Login.gov handbook! This is our open source team documentation! This is a test change 2!

Please help us contribute and keep things up to date, and make sure
to [avoid contributing sensitive information][sensitive-information].

[sensitive-information]: {{ site.baseurl }}/articles/contributing.html#sensitive-information

## Categories

<div class="margin-bottom-4"></div>

<ul class="usa-card-group">
  {% assign sorted_categories = site.categories | group_by: 'order' | sort: 'name' %}
  {% for category_group in sorted_categories %}
    {% assign sorted_category_items = category_group.items | sort: 'title' %}
    {% for category in sorted_category_items %}
      <li class="usa-card tablet:grid-col-6">
        <div class="usa-card__container">
          <div class="usa-card__header">
            <span class="usa-card__heading">
              {% if category.icon %}
                {% include uswds-icon.html icon=category.icon %}
              {% endif %}
              <strong>
                <a href="{{ category.url | prepend: site.baseurl }}" class="usa-link">{{ category.title }}</a>
              </strong>
            </span>
          </div>
          <div class="usa-card__body">
            <p>{{ category.description }}</p>
          </div>
        </div>
      </li>
    {% endfor %}
  {% endfor %}
</ul>

## All Articles

{% for category in site.categories %}

### [{{ category.title }}]({{ category.url | prepend: site.baseurl }})

{{ category.description}}

{% include articles_category.md category=category %}

{% endfor %}
