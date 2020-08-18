require 'yaml'

RSpec.describe '_data/highlight_categories.yml' do
  subject(:highlight_categories) do
    YAML.load_file('_data/highlight_categories.yml')
  end

  describe 'custom_order keys' do
    it 'only contains articles that actually exist' do
      highlight_categories.each do |category|
        (category['custom_order'] || []).each do |filename|
          expect(File).to exist(filename),
            "expected article #{filename} to exist (category: #{category['title']})"
        end
      end
    end
  end
end
