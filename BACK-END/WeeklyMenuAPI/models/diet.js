const mongoose = require('mongoose');
const mautopopulate = require('mongoose-autopopulate');

const types = mongoose.Schema.Types;

const dietSchema = new mongoose.Schema({
    _id: {
        type: types.ObjectId,
        require: true
    },
    menu: {
        type: types.ObjectId,
        require: true,
        ref: 'Menu',
        autopopulate: true
    }
})

dietSchema.plugin(mautopopulate);
module.exports = mongoose.model('Diet', dietSchema);
