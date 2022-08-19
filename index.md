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
    <li class="usa-card tablet:grid-col-4">
      <div class="usa-card__container">
        <div class="usa-card__header">
          <strong class="usa-card__heading">
            <a href="{{ category.url }}">{{ category.title }}</a>
          </strong>
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

### [{{ category.title }}]({{ category.url }})

{{ category.description}}

{% include articles_category.md category=category %}

{% endfor %}

### Private

- [Private Articles]({% link private.md %})
