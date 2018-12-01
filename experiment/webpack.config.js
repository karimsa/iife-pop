const path = require('path');

module.exports = {
  mode: 'production', // 'development',
  entry: './app.js',
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
};
