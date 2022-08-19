---
title: Login Handbook
permalink: /
layout: article
---

Welcome to the Login.gov handbook! This is our open source team documentation!

Please help us contribute and keep things up to date, and make sure
to [avoid contributing sensitive information][sensitive-information].

[sensitive-information]: {{ site.baseurl }}/articles/contributing.html#sensitive-information

## Categories

<ul class="usa-card-group">
  {% for category in site.categories %}
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
</ul>

## All Articles

{% for category in site.categories %}

### [{{ category.title }}]({{ category.url | prepend: site.baseurl }})

{{ category.description}}

{% include articles_category.md category=category %}

{% endfor %}
