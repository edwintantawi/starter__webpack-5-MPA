/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const htmlPages = ['home', 'about', 'blogs'];
const entryPages = {};
htmlPages.forEach((page) => {
  entryPages[page] = `./src/scripts/views/pages/${page}`;
});
const multipleHtmlWebpackPlugin = htmlPages.map(
  (page) =>
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `src/templates/${page}.html`),
      filename: `${page === 'home' ? 'index' : page}.html`,
      chunks: [`${page}`, 'main'],
    })
);

module.exports = {
  entry: {
    main: './src/scripts/index.js',
    ...entryPages,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[contenthash].bundle.js',
    assetModuleFilename: 'images/[name]-[contenthash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    ...multipleHtmlWebpackPlugin,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/assets/favicon/icon.png'),
      manifest: path.resolve(__dirname, 'src/assets/manifest.json'),
      outputPath: 'static/',
      prefix: 'static/',
      mode: 'webapp',
      cache: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash].css',
    }),
  ],
};
