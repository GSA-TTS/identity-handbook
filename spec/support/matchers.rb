require 'uri'

RSpec::Matchers.define :have_unique_ids do
  duplicate_ids = Set.new

  match do |actual|
    doc = actual

    ids = Set.new

    doc.css('[id]').each do |tag|
      if ids.include?(tag[:id])
        duplicate_ids << tag[:id]
      end

      ids << tag[:id]
    end

    expect(duplicate_ids).to be_empty
  end

  failure_message do |actual|
    "expected that #{actual.url} would not duplicate ids, but found:\n#{duplicate_ids.to_a.join("\n")}"
  end
end

