class BreadcrumbComponent < BaseComponent
  attr_reader :tag_options

  def initialize(**tag_options)
    @tag_options = tag_options
  end

  def css_class
    ['usa-breadcrumb', *tag_options[:class]]
  end
end
