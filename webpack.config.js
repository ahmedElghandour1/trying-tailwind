const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  /** @type {import('webpack').Configuration} */
  const config = {
    target: ["web", "es6"],
    entry: {
      main: "./src/main.js",
    },
    output: {
      filename: "[name].js",
      path: resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "Tailwind",
        filename: "index.html",
        template: "src/index.html",
        scriptLoading: "defer",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  };

  config.devtool = argv.mode === "production" ? "source-map" : "eval";
  if (argv.mode === "production") {
    config.optimization = {
      minimize: true,
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require("cssnano"),
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }],
          },
          canPrint: true,
        }),
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    };
  }

  return config;
};
