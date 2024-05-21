require 'spec_helper'
require 'yaml'

RSpec.describe '_data/sprint_teams.yml' do
  data = YAML.load_file('_data/sprint_teams.yml')
  data.each do |team|
    describe team['name'] do
      it 'includes required properties', :aggregate_failures do
        expect(team['name']).not_to be_nil
        expect(team['focus_area']).not_to be_nil
        expect(team['slack_channel_name']).not_to be_nil
        expect(team['slack_channel_url']).not_to be_nil
      end

      context 'product team', if: !team['archived'] && team['product'] do
        it 'includes required product team properties' do
          expect(team['slack_appdev_oncall_handle']).not_to be_nil
        end
      end
    end
  end
end
