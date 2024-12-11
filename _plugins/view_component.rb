require 'action_controller'
require 'action_view'
require 'active_support'
require 'view_component'

unless defined?(Rails)
  module Rails
    class Application
      def routes
        @routes ||= Struct.new(:url_helpers).new(Module.new)
      end
    end

    def self.version
      ActionView.version.to_s
    end

    module VERSION
      MAJOR, MINOR = Rails.version.split('.').map(&:to_i)
    end

    def self.env
      @env ||= Struct.new(:development?, :test?, :production?).new(false, false, true)
    end

    def self.application
      @application ||= Application.new
    end
  end
end

require './_components/base_component.rb'
Dir['_components/**/*.rb'].each { |f| require File.join('.', f) }

class ComponentTag < Liquid::Block
  PARAM_SYNTAX = /(\w+)(?:=(?:"([^"]+?)"|(:[a-z_]+)|(\S+)))?/.freeze

  def initialize(tag_name, variables, context)
    super

    @component_name, @params = variables.split(' ', 2)
  end

  # Jekyll tags don't have built-in support for variable references, but Jekyll's built-in `include`
  # tag has a syntax we can use as a starting point.
  #
  # @see https://github.com/jekyll/jekyll/blob/master/lib/jekyll/tags/include.rb
  #
  # Example:
  #
  # {% component link url=page.url text="Home" current %}
  #
  # In this example, `url` would be assigned from the page context variable nested value, `text`
  # would be assigned to a string literal, and `current` would be `true`.
  def parse_params(context)
    params = {}
    @params.scan(PARAM_SYNTAX) do |key, string, symbol, variable|
      if string
        params[key] = string
      elsif symbol
        params[key] = symbol[1..].to_sym
      elsif variable
        parts = variable.split('.')
        value = context
        while (part = parts.shift)
          value = value[part]
        end
        params[key] = value
      else
        params[key] = true
      end
    end
    params
  end

  def render(context)
    content = super
    if !content.include?('<')
      content = context.registers[:site].
        find_converter_instance(Jekyll::Converters::Markdown).
        convert(super).sub(/^<p>(.+)<\/p>$/, '\1')
    end
    content = content.html_safe

    component_class = "#{@component_name.camelize}Component".constantize
    component = component_class.new(**parse_params(context).symbolize_keys).with_content(content)
    ActionController::Base.new.render_to_string(component)
  end
end

Liquid::Template.register_tag('component', ComponentTag)
