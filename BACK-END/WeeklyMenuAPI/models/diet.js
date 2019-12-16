const mongoose = require('mongoose');
const mautopopulate = require('mongoose-autopopulate');

const types = mongoose.Schema.Types;

const dietSchema = new mongoose.Schema({
    _id: {
        type: types.ObjectId,
        require: true
    },
    user: {
        type: types.ObjectId,
        require: true,
        ref: 'User',
        autopopulate: true
    }, date: {
        type: types.Date,
        require: true,
        default: new Date()
    },
    menus: {
        type: [types.ObjectId],
        require: true,
        ref: 'Menu',
        autopopulate: true
    }
})

dietSchema.plugin(mautopopulate);
module.exports = mongoose.model('Diet', dietSchema);
