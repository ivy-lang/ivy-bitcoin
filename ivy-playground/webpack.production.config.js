const webpack = require("webpack")
const path = require("path")
const { CheckerPlugin } = require("awesome-typescript-loader")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

module.exports = {
  target: "web",
  entry: {
    playground: path.resolve(__dirname, "src/entry")
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bitcoin-playground.bundle.js",
    publicPath: "/static/"
  },
  resolve: {
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
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        ecma: 6,
        compress: true,
        comments: false
      }
    }),
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}
