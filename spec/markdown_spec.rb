require 'active_support/inflector'
require 'yaml'

RSpec.describe 'Markdown' do
  # parses and returns YAML frontmatter from raw contents of a file (or nil)
  # @param [String] content
  # @return [Hash, nil]
  def parse_frontmatter(content)
    result = content.match(/---\s(?<frontmatter>.+)\s---/m)
    YAML.load(result[:frontmatter]) if result
  end

  def category_exists?(title)
    Dir.glob('_categories/**/*.md').any? do |category_path|
      frontmatter = parse_frontmatter(File.read(category_path))

      frontmatter && title == frontmatter['title']
    end
  end

  context 'articles' do
    Dir.glob('_articles/**/*.md') do |article_path|
      context article_path do
        it 'is named with kebab-case (dashes)' do
          file = File.basename(article_path)
          expect(file).to eq(ActiveSupport::Inflector.dasherize(file))
        end

        it 'has correct YAML frontmatter' do
          content = File.read(article_path)

          frontmatter = parse_frontmatter(content)
          expect(frontmatter).to be

          aggregate_failures do
            expect(frontmatter['description']).to be

            category = frontmatter['category']
            expect(category).to be
            expect(category_exists?(category)).to be, "it links to a real category (#{category})"
          end
        end
      end
    end
  end

  context 'categories' do
    Dir.glob('_categories/**/*.md') do |category_path|
      context category_path do
        it 'is named with kebab-case (dashes)' do
          file = File.basename(category_path)
          expect(file).to eq(ActiveSupport::Inflector.dasherize(file))
        end

        it 'has correct YAML frontmatter' do
          content = File.read(category_path)

          frontmatter = parse_frontmatter(content)
          expect(frontmatter).to be

          aggregate_failures do
            expect(frontmatter['title']).to be
          end
        end
      end
    end
  end
end
