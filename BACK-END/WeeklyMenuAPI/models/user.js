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
        require: true
    },
    lastName: {
        type: types.String,
        require: true
    },
    username: {
        type: types.String,
        require: true
    },
    email: {
        type: types.String,
        require: true
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
    }
})

module.exports = mongoose.model('User',userSchema);


// {
//     "_id": 
//     "name": "Agnès", 
//     "lastName": "Font",
//     "username": "agnesft5",
//     "email": "agnesft5@gmail.com",
//     "password": "patata1234"
// }