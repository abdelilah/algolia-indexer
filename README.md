# algolia-indexer

A NodeJS CLI tool to scan `md` and `mdx` files, parses **frontmatter** and updates the index on Algolia.

## Configuration

In order for the tool to access Algolia you need to provide access keys and index name. This can be done either directly in the command line, via environment variables or by specifying the path to a `.env` file.

### Environment variables names

```
ALGOLIA_APP_ID
ALGOLIA_INDEX
ALGOLIA_KEY
```

### Passing keys via command line (not recommended):

```shell
npx algolia-indexer --algolia-app-id XXXXX --algolia-key XXXXX --index XXXXX --source ./
```

## Usage examples

Using environment variables to access Algolia service:

```shell
npx algolia-indexer --source ./
```

Using a `.env` file to load env variables:

```shell
npx algolia-indexer --source ./
```

For all the available commands you can use the `--help` flag:

```shell
npx algolia-indexer --help
```

`
