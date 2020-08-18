require 'active_support/inflector'
require 'yaml'

RSpec.describe 'Markdown' do
  Dir.glob('_articles/**/*.md') do |source|
    context source do
      it 'is named with kebab-case (dashes)' do
        file = File.basename(source)
        expect(file).to eq(ActiveSupport::Inflector.dasherize(file))
      end

      it 'has correct YAML frontmatter' do
        content = File.read(source)

        result = content.match(/---\s(?<frontmatter>.+)\s---/m)
        expect(result).to be

        frontmatter = YAML.load(result[:frontmatter])

        aggregate_failures do
          expect(frontmatter['category']).to be
        end
      end
    end
  end
end