const path = require('path');

module.exports = {
    entry: './public/map/map.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    }
};