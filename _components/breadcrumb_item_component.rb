class BreadcrumbItemComponent < ViewComponent::Base
  attr_reader :href, :current
  alias_method :current?, :current

  def initialize(href:, current: false)
    @href = href
    @current = current
  end
end
