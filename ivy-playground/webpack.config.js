const webpack = require("webpack")
const path = require("path")
const { CheckerPlugin } = require("awesome-typescript-loader")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  target: "web",
  entry: {
    playground: path.resolve(__dirname, "playground/entry")
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "playground.bundle.js",
    publicPath: "/ivy/"
  },
  resolve: {
    alias: {
      bcoin: path.resolve(__dirname, "node_modules/bcoin/lib/bcoin-browser.js")
    },
    modules: ["node_modules"],
    extensions: ["-browser.js", ".js", ".json", ".jsx", ".ts", ".tsx", ".pegjs"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.json$/,
        use: ["json-loader"]
      },
      {
        test: /\.pegjs$/,
        use: ["pegjs-loader"]
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "awesome-typescript-loader", "tslint-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    port: 8081
  },
  plugins: [new CheckerPlugin()]
}
