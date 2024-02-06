# Login.gov handbook

The repository that backs the [Login.gov handbook](https://handbook.login.gov/),
the Login.gov team's open source handbook.

## Contributing

It's a fairly standard Jekyll site. All articles (most content in this repo)
should live in the [`_articles`](_articles) directory. Feel free to add a new
article and it will be automatically linked to from the index of all articles.

## Running Locally

Ensure that you have the required dependencies installed.

```
make setup
```

```
make run
```

Open http://localhost:4000/ in a browser, or run `open http://localhost:4000` from the MacOS CLI.

## Running Tests

```
make test
```

## Linting

To check formatting:
```
make lint
```
To check spelling:
```
make spellcheck
```

### NetlifyCMS

The site is configured to use [NetlifyCMS](https://www.netlifycms.org/), so you can make changes via UI only by going to <https://handbook.login.gov/admin>.

To use the CMS locally, while the server is running, view it locally at <http://localhost:4000/admin>.
