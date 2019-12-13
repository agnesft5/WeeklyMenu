const mongoose = require('mongoose');

const types = mongoose.Schema.Types;

const dishSchema = new mongoose.Schema({
    _id: {
        type: types.ObjectId,
        require: true
    },
    name: {
        type: types.String,
        require: true
    },
    ingredients: {
        type: [types.String],
        require: true
    },
    quantity: {
        type: [types.Number],
        require: true
    },
    kcal: {
        type: types.Number,
        require: true
    },
    type: {
        type: types.String,
        enum: ["starter_lunch", "main_lunch", "dessert_lunch", "starter_dinner", "main_dinner", "dessert_dinner"],
        default: "starter"
    },
    profile: {
        type: types.String,
        enum: ["profile_1200", "profile_1400", "profile_1600", "profile_1800", "profile_2000", "profile_2200"],
        default: "profile_1400"
    }
})

module.exports = mongoose.model('Dish', dishSchema);


// {
//     "name":"omelette",
//     "ingredients":["egg", "oil"],
//     "quantity":[120, 10],
//     "type":"starter_lunch",
//     "profile":"profile-1200"
//     }
