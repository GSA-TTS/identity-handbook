---
title: Login Handbook
permalink: /
layout: article
---

Welcome to the Login.gov handbook! This is our open source team documentation!

Please help us contribute and keep things up to date, and make sure
to [avoid contributing sensitive information][sensitive-information].

[sensitive-information]: {{ site.baseurl }}/articles/contributing.html#sensitive-information

## All Articles

See the [index of all articles]({% link all.md %})

## Categories

<ul class="usa-card-group">

  {% for category in site.categories %}

    <li class="usa-card tablet:grid-col-4">
      <div class="usa-card__container">

<div class="usa-card__header" markdown="1">
### [{{ category.title }}]({{ category.url }})
{:class="usa-card__heading"}
</div>

        <div class="usa-card__body">
          <p>{{ category.description }}</p>
        </div>
      </div>
    </li>

  {% endfor %}
</ul>

