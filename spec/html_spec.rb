require 'spec_helper'
require 'active_support/inflector'
require 'yaml'

RSpec.describe 'HTML' do
  Dir.glob('_site/**/*.html') do |page|
    context page do
      let(:doc) { Nokogiri::HTML(File.new(page.to_s)) }

      it 'is a well-behaved page' do
        aggregate_failures do
          expect(doc).to have_unique_ids
        end
      end
    end
  end
end
