{% comment %}
includes:
- category: string category to render/filter for
- description: optional description of category
- articles: list of articles to filter though for the category
{% endcomment %}
### {{ include.category }}
{{ include.description }}
{% for article in include.articles %}
{% if article.category == include.category %}
 - [{{article.title}}]({{ article.url | prepend: site.baseurl }})
   {% if article.description %}<br/>{{ article.description }}{% endif %}
{% endif %}
{% endfor %}
