const mongoose = require('mongoose');
const mautopopulate = require('mongoose-autopopulate');

const types = mongoose.Schema.Types;

const menuSchema = new mongoose.Schema({
    _id: {
        type: types.ObjectId,
        require: true
    },
    user: {
        type:types.ObjectId,
        require: true,
        ref: 'User',
        autopopulate: true
    },
    date: {
        type: types.Date,
        require: true,
        default: new Date()
    },
    starterLunch:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    },
    mainLunch:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    },
    dessertLunch:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    },
    starterDinner:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    },
    mainDinner:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    },
    dessertDinner:{
        type:types.ObjectId,
        require: true,
        ref: 'Dish',
        autopopulate: true
    }

})

menuSchema.plugin(mautopopulate);
module.exports = mongoose.model('Menu', menuSchema);


// _id:,
// date:
//starterLunch:
// mainLunch:
// dessertLunch:
// starterDinner:
// mainDinner:
// dessertDinner: