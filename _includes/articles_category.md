{% comment %}

A list of articles in a category, handles marking links as deprecated

includes:
- category: category object (page)
{% endcomment %}

{% assign sorted_articles = site.articles | sort: "title" %}

{% for article in sorted_articles %}
{%   if article.category == include.category.title %}
 - [{{article.title}}]({% include article_url.txt article=article %})
   {%- if article.deprecated -%}
     {: .deprecated-link} (deprecated)
   {%- endif -%}
   {% if article.description %}<br/>{{ article.description }}{% endif %}
{%   endif %}
{% endfor %}
