module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'max-len': ['error', { code: 120 }],
	},
};
