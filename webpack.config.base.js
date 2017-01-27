module.exports = {
  externals: {
    mobx: 'mobx'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'mobx-delorean',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
