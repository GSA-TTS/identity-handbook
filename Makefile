run: setup
	bundle exec jekyll serve --watch

build: setup
	bundle exec jekyll build

setup:
	bundle
	yarn install

test: build
	bundle exec rspec spec

clean:
	rm -rf _site

.PHONY: setup clean
