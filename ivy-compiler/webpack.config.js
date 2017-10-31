const webpack = require("webpack")
const path = require("path")
const { CheckerPlugin } = require("awesome-typescript-loader")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

module.exports = {
  target: "web",
  entry: {
    playground: path.resolve(__dirname, "lib/index")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "ivy-compiler.js",
    library: "ivy-compiler",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    modules: ["node_modules"],
    extensions: ["-browser.js", ".js", ".json", ".jsx", ".ts", ".tsx", ".pegjs"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"]
      },
      // {
      //   test: /\.json$/,
      //   use: ["json-loader"]
      // },
      {
        test: /\.pegjs$/,
        use: ["pegjs-loader"]
      },
      {
        test: /\.ts$/,
        use: ["babel-loader", "awesome-typescript-loader"]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    port: 8081
  },
  plugins: [
    new CheckerPlugin(),
    new UglifyJSPlugin(),
    new BundleAnalyzerPlugin()
  ]
}
