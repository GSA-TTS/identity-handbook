# frozen_string_literal: true

require 'active_model'

class BaseComponent < ViewComponent::Base
  include ActiveModel::Model

  def before_render
    validate!
  end
end
