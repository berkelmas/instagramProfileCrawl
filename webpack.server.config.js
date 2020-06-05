const path = require("path");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");
const webpack = require("webpack");
dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./main.js",
  target: "node",
  externals: [nodeExternals()],
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.server.js",
    publicPath: "assets",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/^hiredis$/)],
};
