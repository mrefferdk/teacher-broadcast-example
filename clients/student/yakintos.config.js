
const path = require('path');

module.exports = {
    engine: {
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/student/'
        }
    }
};