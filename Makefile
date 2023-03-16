run: build_js
	make -j2 watch_js watch_jekyll

build: setup build_js build_jekyll

build_jekyll: .env
	/bin/bash -c "source .env && bundle exec jekyll build"

watch_jekyll: .env
	/bin/bash -c "source .env && bundle exec jekyll serve --watch"

build_js:
	npm run build

watch_js:
	npm start

setup:
	bundle
	npm install

lint:
	npm run lint

typecheck:
	npm run typecheck

spellcheck:
	npm run cspell

test: build
	bundle exec rspec spec
	bundle exec htmlproofer --disable-external --allow-hash-href --allow-missing-href=true --enforce-https=false `pwd`/_site

clean:
	rm -rf _site

.env:
	cp -n .env.example .env

.PHONY: run build build_jekyll watch_jekyll build_js watch_js setup lint typecheck test clean
