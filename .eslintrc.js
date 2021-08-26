module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		'no-console': 0,
		indent: [2, 'tab', { SwitchCase: 1, VariableDeclarator: 1 }],
		'no-tabs': 0,
	},
};
