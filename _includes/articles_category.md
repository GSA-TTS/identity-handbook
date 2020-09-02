{% comment %}
includes:
- category: string category to render/filter for
- description: optional description of category (optional)
- articles: list of articles to filter though for the category
- custom_order: list of filenames for custom ordering (optional)
{% endcomment %}
### {{ include.category }}
{{ include.description }}

{% assign sorted_articles = include.articles | sort: "title" %}

{% comment %}
Order articles by custom sorting first
{% endcomment %}
{% for file in include.custom_order %}
{%   for article in sorted_articles %}
{%     if file == article.path and article.category == include.category %}
 - [{{article.title}}]({{ article.url | prepend: site.baseurl }})
   {% if article.description %}<br/>{{ article.description }}{% endif %}
{%     endif %}
{%   endfor %}
{% endfor %}

{% comment %}
Remaining articles (get sorted alphabetically)
{% endcomment %}
{% for article in sorted_articles %}
{%   if article.category == include.category %}
{%     unless include.custom_order contains article.path %}
 - [{{article.title}}]({{ article.url | prepend: site.baseurl }})
   {% if article.description %}<br/>{{ article.description }}{% endif %}
{%     endunless %}
{%   endif %}
{% endfor %}
