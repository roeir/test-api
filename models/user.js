const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    github: {
        id: String,
        token: String,
        email: String
    },
    ninjas: [{
        type: Schema.Types.ObjectId,
        ref: 'Ninja'
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;