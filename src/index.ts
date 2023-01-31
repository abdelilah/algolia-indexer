#!/usr/bin/env node
import { Command } from 'commander';
import 'colors';
import glob from 'glob';
import * as matter from 'gray-matter';
import path from 'path';
import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';

const program = new Command();
program
	.version(process.version || '0.0.1')
	.option('-i, --index <index>', 'Algolia index name, defaults to env variable ALGOLIA_INDEX')
	.option('-a, --algolia-app-id <id>', 'Algolia App ID, defaults to env variable ALGOLIA_APP_ID')
	.option('-k, --algolia-key <key>', 'Algolia API key, defaults to env variable ALGOLIA_KEY')
	.option('-o, --only <keys>', 'Only index the given keys, comma separated')
	.option('-e, --env <env>', 'Environment to use, defaults to process.env.NODE_ENV')
	.option('-s, --source <source>', 'Source folder')
	.parse(process.argv);

const options = program.opts();

// Load environment variables
if (options.env) {
	dotenv.config({ path: path.resolve(process.cwd(), options.env) });
}

// Collect all .md and .mdx files in the source folder
const files = glob.sync(path.join(options.source, '**/*.md*'), {
	ignore: ['**/node_modules/**'],
});

// Read the files and extract the frontmatter
const ALGOLIA_INDEX = options.index || process.env.ALGOLIA_INDEX || process.env.PUBLIC_ALGOLIA_INDEX;
const ALGOLIA_APP_ID = options.algoliaAppId || process.env.ALGOLIA_APP_ID || process.env.PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_KEY = options.algoliaKey || process.env.ALGOLIA_KEY;

// @ts-ignore
const writeStdout = (message: string, color = 'yellow') => process.stdout.write(message[color]);

const indexData = files.map((file) => {
	writeStdout(`Reading ${file}...`);
	const mdPath = path.resolve(process.cwd(), file);
	let { data } = matter.read(mdPath);

	// Only index the given keys
	if (options.only) {
		const keys: string[] = options.only.split(',').map((key: string) => key.trim());
		const newData: any = {};
		keys.forEach((key) => {
			newData[key] = data[key];
		});
		data = newData;
	}

	writeStdout('DONE!\n', 'green');
	return {
		objectID: path.basename(file, path.extname(file)),
		...data,
	};
});

// Send indexData to Algolia
writeStdout('Sending data to Algolia...');
algoliasearch(ALGOLIA_APP_ID, ALGOLIA_KEY)
	.initIndex(ALGOLIA_INDEX)
	.saveObjects(indexData)
	.then((result) => {
		writeStdout('DONE!\n', 'green');
		writeStdout(`Result: ${JSON.stringify(result, null, 2)} \n`, 'magenta');
	})
	.catch((err) => {
		writeStdout('Error!\n', 'red');
		writeStdout(err.message, 'red');
	});
