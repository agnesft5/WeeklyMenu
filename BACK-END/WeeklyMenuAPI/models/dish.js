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
    kcal: {
        type: types.Number,
        require: true
    },
    dish: {
        type: types.String,
        enum: ["starter", "main", "dessert"],
        default: "starter"
    },
    meal: {
        type: types.String,
        enum: ["lunch", "dinner"],
        default: "lunch"
    },
    profile: {
        type: types.String,
        enum: ["WL", "WM", "WG", "ML", "MM", "MG"],
        default: "WM"
    }
})

module.exports = mongoose.model('Dish', dishSchema);

// { "WL": WomanLose, "WM": WomanMantain, "WG": WomanGain, "ML": ManLose, "MM": ManMantain, "MG": ManGain }