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

RSpec::Matchers.define :link_internally_for_handbook_articles do
  articles = Set.new

  match do |actual|
    doc = actual

    doc.css('a[href*="login-handbook.app.cloud.gov"]').each do |a|
      path = URI(a[:href]).path

      articles << path if file_at(path)

      expect(articles).to be_empty
    end
  end

  failure_message do |actual|
    "expected that #{actual.url} would not link to external version of articles in this handbook, but found:\n#{articles.to_a.join("\n")}"
  end
end
