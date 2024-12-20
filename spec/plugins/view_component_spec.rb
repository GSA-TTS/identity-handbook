require 'jekyll'
require 'liquid'
require_relative '../../_plugins/view_component.rb'

RSpec.describe ComponentTag do
  subject(:rendered) do
    converter.convert(Liquid::Template.parse(content).render!(payload, { registers: { site: } }))
  end
  let(:payload) { {} }
  let(:content) { '' }
  let(:site) { Jekyll::Site.new(Jekyll::Configuration.from({})) }
  let(:converter) { site.converters.find { |c| c.instance_of?(Jekyll::Converters::Markdown) } }
  let(:test_component) { Class.new(BaseComponent) }

  before do
    stub_const('TestComponent', test_component)
  end

  context 'with passthrough content' do
    let(:content) { "{% component test %}con\ntent{% endcomponent %}" }
    let(:test_component) do
      Class.new(BaseComponent) do
        def call
          content
        end
      end
    end

    it 'renders markdownified content as a single line' do
      expect(rendered).to eq("<p>con tent</p>\n")
    end
  end

  context 'with component rendered html content' do
    let(:content) { '{% component test %}content{% endcomponent %}' }
    let(:test_component) do
      Class.new(BaseComponent) do
        def call
          tag.div(content)
        end
      end
    end

    it 'renders html without markdownification' do
      expect(rendered).to eq("<div>content</div>\n")
    end
  end

  context 'with string param' do
    let(:content) { '{% component test arg="string" %}content{% endcomponent %}' }
    let(:test_component) do
      Class.new(BaseComponent) do
        def initialize(arg:)
          @arg = arg
        end

        def call
          tag.div(@arg.class.name + @arg.to_s)
        end
      end
    end

    it 'renders with component provided string as argument' do
      expect(rendered).to eq("<div>Stringstring</div>\n")
    end
  end

  context 'with symbol param' do
    let(:content) { '{% component test arg=:symbol %}content{% endcomponent %}' }
    let(:test_component) do
      Class.new(BaseComponent) do
        def initialize(arg:)
          @arg = arg
        end

        def call
          tag.div(@arg.class.name + @arg.to_s)
        end
      end
    end

    it 'renders with component provided string as argument' do
      expect(rendered).to eq("<div>Symbolsymbol</div>\n")
    end
  end

  context 'with variable param' do
    let(:payload) { { 'page' => { 'url' => 'http://example.com' } } }
    let(:content) { '{% component test arg=page.url %}content{% endcomponent %}' }
    let(:test_component) do
      Class.new(BaseComponent) do
        def initialize(arg:)
          @arg = arg
        end

        def call
          tag.div(@arg.class.name + @arg.to_s)
        end
      end
    end

    it 'renders with resolved deep payload value' do
      expect(rendered).to eq("<div>Stringhttp://example.com</div>\n")
    end
  end

  context 'with boolean param' do
    let(:content) { '{% component test arg %}content{% endcomponent %}' }
    let(:test_component) do
      Class.new(BaseComponent) do
        def initialize(arg:)
          @arg = arg
        end

        def call
          tag.div(@arg.class.name + @arg.to_s)
        end
      end
    end

    it 'renders with component provided string as argument' do
      expect(rendered).to eq("<div>TrueClasstrue</div>\n")
    end
  end
end
