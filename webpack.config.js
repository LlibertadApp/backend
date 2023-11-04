const path = require("path");
const slsw = require("serverless-webpack");
const externals = require("webpack-node-externals");

const plugins = [];
module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  externals: [externals()],
  mode: "production",
  stats: "minimal",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".json", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: [path.resolve(__dirname, "node_modules")],
      },
    ],
  },
  plugins,
};
