const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NinjaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    rank: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Ninja = mongoose.model('Ninja', NinjaSchema);

module.exports = Ninja;