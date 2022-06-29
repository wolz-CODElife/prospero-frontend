const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: {
		experiments: {
			topLevelAwait: true,
		},
		plugins: [new NodePolyfillPlugin()],
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
	},
});
