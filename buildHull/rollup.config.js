// rollup.config.js
export default {

		input: 'src/TEST.js'

		, output: {
				format: 'umd'
				, name: 'TEST'
				, file: 'js/test.js'
				, indent: '\t'
		}
		
};