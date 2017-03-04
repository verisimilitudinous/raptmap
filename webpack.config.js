// To auto-compile files in dev, use:
// sudo webpack --progress --colors --watch

// Before deploying to prod, give it the business:
// sudo webpack -p

'use strict';

const fs = require('fs');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const prod = process.argv.indexOf('-p') !== -1;
const css_output_template = prod ? "stylesheets/[name]-[hash].css" : "stylesheets/[name].css";
const js_output_template = prod ? "javascripts/[name]-[hash].js" : "javascripts/[name].js";

module.exports = {
  context: __dirname + "/app/assets",

  entry: {
    application: ["./javascripts/application.js", "./stylesheets/application.scss"],
    map: ["./javascripts/map.js", "./stylesheets/map.scss"]
  },

  output: {
    path: __dirname + "/public",
    filename: js_output_template,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.[s]?css$/,
        loader: ExtractTextPlugin.extract("css!sass")
      },
      {
        test: /\.jsx?/,
        include: __dirname + "/app/assets/javascripts",
        loader: 'babel',
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new CopyWebpackPlugin([
      { from: "images", to: "images" }
    ]),
    new ExtractTextPlugin(css_output_template),
    function() {
      // output the fingerprint
      this.plugin("done", function(stats) {
        let output = "ASSET_FINGERPRINT = \"" + stats.hash + "\""
        fs.writeFileSync("config/initializers/fingerprint.rb", output, "utf8");
      });

      // delete previous outputs
      this.plugin("compile", function() {
        let basepath = __dirname + "/public";
        let paths = ["/javascripts", "/stylesheets"];

        for (let x = 0; x < paths.length; x++) {
          const asset_path = basepath + paths[x];

          fs.readdir(asset_path, function(err, files) {
            if (files === undefined) {
              return;
            }

            for (let i = 0; i < files.length; i++) {
              if (files[i].match(/^[a-z_]+-[a-z0-9]+.(js|css)$/)) {
                fs.unlinkSync(asset_path + "/" + files[i]);
              }
            }
          });
        }
      });
    }
  ],

};
