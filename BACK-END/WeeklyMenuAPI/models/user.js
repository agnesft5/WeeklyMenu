const mongoose = require('mongoose');
const mautopopulate = require('mongoose-autopopulate');

const types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    _id: {
        type: types.ObjectId,
        require: true
    },
    name: {
        type: types.String,
    },
    lastName: {
        type: types.String,
    },
    username: {
        type: types.String,
        require: true
    },
    email: {
        type: types.String,
        require: () => {
            if (this.username === undefined) {
                return true
            } else {
                return false
            }
        }
    },
    password: {
        type: types.String,
        require: true
    },
    creationDate: {
        type: types.Date,
        require: true,
        default: new Date()
    },
    updateDate: {
        type: types.Date,
        require: true,
        default: new Date()
    },
    dietist: {
        type: types.Boolean,
        default: false
    },
    weight: {
        type: types.Number
    },
    height: {
        type: types.Number
    },
    age: {
        type: types.Number
    },
    gender: {
        type: types.String
    }
})

module.exports = mongoose.model('User', userSchema);


// {
//     "_id": 
//     "name": "Agnès", 
//     "lastName": "Font",
//     "username": "agnesft5",
//     "email": "agnesft5@gmail.com",
//     "password": "patata1234"
// }