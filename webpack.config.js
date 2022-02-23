const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry:  './src/index.js',
   output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'bundle.js'
   },
   devServer: {
      contentBase: "./dist",
    },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['@babel/preset-env', '@babel/preset-react']
             }
         }, 
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
      ]
   },
   plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
  resolve: {
   extensions: [ '.jsx', '.js' ]
}
 
}