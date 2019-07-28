const VueLoaderPlugin = require("vue-loader/lib/plugin");
var path = require("path");

module.exports = {
   mode: "production",
   entry: "./public/src/main.js",
   output: {
      path: path.resolve(__dirname, "public", "build"),
      filename: "bundle.js"
   },
   resolve: {
      alias: {
         vue: "./vue.js"
      }
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ["vue-style-loader", "css-loader"]
         },
         {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
               loaders: {}
            }
         },
         {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
         },
         {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
               name: "[name].[ext]?[hash]"
            }
         }
      ]
   },
   plugins: [
      // make sure to include the plugin!
      new VueLoaderPlugin()
   ]
};
