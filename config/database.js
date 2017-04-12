const mongoose = require('mongoose');

module.exports = {
    connect() {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/ninjago');
    }
};