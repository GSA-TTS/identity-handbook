{% comment %}

A list of articles in a category, handles marking links as deprecated

includes:
- category: category object (page)
{% endcomment %}


{% assign subcategory_articles = site.articles | where: "category", include.category.title | group_by: "subcategory" | sort: "name" %}

{% for subcategory_article_tuple in subcategory_articles %}
{%   assign subcategory = subcategory_article_tuple.name %}
{%   assign articles = subcategory_article_tuple.items | sort: "title" %}
{%   if subcategory != "" %}

#### {{ subcategory }}

{%     for article in articles %}
 - <span markdown="1" {% if article.redirect_to %}data-anchor{% endif %}>
   [{{article.title}}]({% include article_url.txt article=article %})
     {%- if article.deprecated -%}
       {: .deprecated-link} (deprecated)
     {%- endif -%}
    </span>
     {% if article.description %}<br/>{{ article.description }}{% endif %}
{%     endfor %}
{%   endif %}
{% endfor %}

{% assign articles_no_subcategory = site.articles | where: "category", include.category.title | sort: "title" %}

{% if subcategory_articles.size > 1 %}
#### Other Articles
{% endif %}

{% for article in articles_no_subcategory %}
{% unless article.subcategory %}
 - <span markdown="1" {% if article.redirect_to %}data-anchor{% endif %}>
   [{{article.title}}]({% include article_url.txt article=article %})
   {%- if article.deprecated -%}
    {: .deprecated-link} (deprecated)
   {%- endif -%}
   </span>
   {% if article.description %}<br/>{{ article.description }}{% endif %}
{% endunless %}
{% endfor %}
