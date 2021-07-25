const path = require('path');

module.exports = {
    mode: 'production',
    entry: './public/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public', 'js'),
    },
};
