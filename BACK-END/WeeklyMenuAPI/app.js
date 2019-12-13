//////////////// DEPENDENCIES IMPORTS ////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtChecker = require('express-jwt');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const colors = require('colors');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const helmet = require('helmet');

////////////////////// MODEL IMPORTS //////////////////////

const User = require('./models/user');
const Dish = require('./models/dish');
const Menu = require('./models/menu');
const Diet = require('./models/diet');


//////////////////////// SERVIDOR ////////////////////////

const server = express();


////////////////////// SECRETS.JSON ///////////////////////

const secretsDoc = fs.readFileSync('secrets.json');
const secrets = JSON.parse(secretsDoc);

////////////////////// MIDDLEWARES ////////////////////////

server.use(bodyParser.json());
server.use(helmet());
server.use(cors());
server.use(cookieParser());

server.use(jwtChecker({
    secret: secrets['jwt_key'],
    getToken: (req) => {
        //retorna un array de cookies
        return req.cookies['jwt'];
    }
}).unless({ path: ["/login", "/register", "/home"] })
)


/////////////////////// CONNEXIÓN ///////////////////////

mongoose.connect(`mongodb://localhost/WeeklyMenu`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            res.send(error)
        } else {

            console.log("Connection with MongoDB created".green)

            User.find({},
                (error, data) => {
                    console.log("Buscando a nemo")
                })
            /////////////////////////////////// USER /////////////////////////////////

            //////////////// - SIGN IN - /////////////////

            server.post('/register', [
                check('name').not().isEmpty().trim().escape(),
                check('lastName').not().isEmpty().trim().escape(),
                check('username').not().isEmpty().trim().escape(),
                check('email').not().isEmpty().trim().escape(),
                check('password').not().isEmpty().trim().escape()
            ], (req, res) => {
                let body = req.body
                console.log(body)
                if (body.name !== undefined && body.lastName !== undefined && body.username !== undefined && body.email !== undefined && body.password !== undefined) {
                    User.findOne({ "username": body.username }, (error, data) => {
                        if (error) {
                            res.send({
                                "status": "Something went wrong. Try again.",
                                "error": error
                            })
                        } else {
                            if (data === null) {
                                bcrypt.hash(body.password, 11, (error, hash) => {
                                    if (error) {
                                        res.send({ "status": "Password not valid. Try again" })
                                    } else {
                                        const newUser = new User({
                                            _id: mongoose.Types.ObjectId(),
                                            name: body.name,
                                            lastName: body.lastName,
                                            username: body.username,
                                            email: body.email,
                                            password: hash,
                                            dietist: body.dietist
                                        })

                                        newUser.save((error) => {
                                            if (error) {
                                                res.send({ "status": "Couldn't send your credentials" })
                                            } else {
                                                res.send({
                                                    "status": "Registered successfully!"
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                res.send({ "status": "This user already exists." })
                            }
                        }
                    })
                } else {
                    res.send({ "status": "Something went wrong. Check your credentials." })
                }
            })

            //////////////// - GET USERS ADMIN - /////////

            server.get('/users', (req, res) => {
                let token = req.cookies["jwt"]
                jwt.verify(token, secrets["jwt_key"],
                    (error, decoded) => {
                        if (error) {
                            res.send({
                                "status": "Authentication failed.",
                                "error": error
                            })
                        } else if (decoded['id'] == "5def8d7095df1d66b8fdea11") {
                            console.log(decoded)
                            User.find((error, data) => {
                                if (error) {
                                    res.send(error)
                                } else {
                                    res.send(data)
                                }
                            })
                        } else {
                            res.send({ "status": "Wrong credentials. Not allowed. Plz be agnesft5" })
                            /// THIS IS WHERE ALERT GOES
                        }
                    })
            })

            //////////////// - LOG IN - /////////////////

            server.post("/login", [
                check('name').not().isEmpty().trim().escape(),
                check('lastName').not().isEmpty().trim().escape(),
                check('username').not().isEmpty().trim().escape(),
                check('email').not().isEmpty().trim().escape(),
                check('password').not().isEmpty().trim().escape()
            ], (req, res) => {
                let body = req.body;
                if (body.name !== undefined && body.lastName !== undefined && body.username !== undefined && body.email !== undefined && body.password !== undefined) {
                    User.findOne({ "username": body.username }, (error, data) => {

                        let userFound = data
                        if (error) {
                            res.send(error)
                        } else if (userFound !== null) {
                            bcrypt.compare(body.password, userFound.password, (error, same) => {
                                if (error) {
                                    res.send({
                                        "status": "Something went wrong. Check your password.",
                                        "error": error
                                    })
                                } else if (same) {
                                    const token = jwt.sign({ "id": userFound["_id"] }, secrets["jwt_key"])
                                    res.header('Set-Cookie', `jwt=${token}; httpOnly; maxAge: 99999`);
                                    res.send({ "status": "You are logged!" })
                                } else {
                                    res.send({ "status": "Wrong password. Try again." })
                                }
                            })
                        } else {
                            res.send({ "status": "This user is not registered yet. Please sign in." })
                        }
                    })
                } else {
                    res.send({ "status": "Something went wrong. Check your credentials." })
                }
            })


            //////////////// - UPDATE DETAILS- //////////

            server.put('/update-details', [
                check('weight').trim().escape().not().isEmpty(),
                check('height').trim().escape().not().isEmpty(),
                check('age').trim().escape().not().isEmpty(),
                check('gender').trim().escape().not().isEmpty(),
                check('IMC').trim().escape().not().isEmpty(),
                check('basal').trim().escape().not().isEmpty(),
                check('userProfile').trim().escape().not().isEmpty()
            ], (req, res) => {
                let body = req.body;
                console.log(body)
                if (body.weight !== undefined && body.height !== undefined && body.age !== undefined && body.gender && body.IMC !== undefined && body.basal !== undefined && body.userProfile !== undefined) {
                    let token = req.cookies["jwt"]
                    jwt.verify(token, secrets["jwt_key"],
                        (error, decoded) => {
                            if (error) {
                                res.send({
                                    "status": "Authentication failed.",
                                    "error": error
                                })
                            } else if (decoded['id'] !== undefined) {
                                User.findByIdAndUpdate(decoded['id'],
                                    {
                                        $set: {
                                            "weight": body.weight,
                                            "height": body.height,
                                            "age": body.age,
                                            "gender": body.gender,
                                            "IMC": body.IMC,
                                            "basal": body.basal,
                                            "updateDate": new Date(),
                                            "userProfile": body.userProfile
                                        }
                                    }
                                    ,
                                    (error) => {
                                        if (error) {
                                            res.send({
                                                "status": "Couldn't update this user.",
                                                "error": error
                                            })
                                        } else {
                                            res.send({
                                                "status": "Details updated!"
                                            })
                                        }
                                    })
                            } else {
                                res.send({ "status": "Wrong credentials. Not allowed." })
                            }
                        })
                }
            })

            //////////////// - GET USER DETAILS- /////////////////

            server.get('/user-details', (req, res) => {
                let token = req.cookies["jwt"]
                jwt.verify(token, secrets["jwt_key"],
                    (error, decoded) => {
                        if (error) {
                            res.send({
                                "status": "Authentication failed.",
                                "error": error
                            })
                        } else if (decoded) {
                            User.findById(decoded['id'],
                                (error, data) => {
                                    if (error) {
                                        res.send({
                                            "status": "Couldn't find this user.",
                                            "error": error
                                        })
                                    } else {
                                        res.send({
                                            "status": "User found.",
                                            "data": data
                                        })
                                    }
                                })
                        } else {
                            res.send({ "status": "Wrong credentials. Not allowed." })
                        }
                    })
            })


            /////////////////////////////////// DISH /////////////////////////////////

            server.post('/add-dish', [
                check('name').trim().escape().not().isEmpty(),
                check('ingredients.*').trim().escape().not().isEmpty(),
                check('quantity.*').trim().escape().not().isEmpty(),
                check('kcal').trim().escape().not().isEmpty(),
                check('dish').trim().escape().not().isEmpty(),
                check('meal').trim().escape().not().isEmpty(),
                check('profile').trim().escape().not().isEmpty()
            ],
                (req, res) => {
                    let body = req.body
                    let token = req.cookies["jwt"]
                    jwt.verify(token, secrets["jwt_key"],
                        (error, decoded) => {
                            if (error) {
                                res.send({
                                    "status": "Authentication failed.",
                                    "error": error
                                })
                            } else if (decoded) {
                                User.findById(decoded['id'], (error, data) => {
                                    if (error) {
                                        res.send({ "status": "Couldn't find this user." })
                                    } else {
                                        console.log({ "status": "User found." })
                                        console.log(data)
                                        if (data['dietist'] == true) {
                                            if (body.name !== undefined && body.ingredients !== undefined && body.quantity !== undefined && body.kcal !== undefined && body.type !== undefined && body.profile !== undefined) {

                                                const newDish = new Dish({
                                                    _id: mongoose.Types.ObjectId(),
                                                    name: body.name,
                                                    ingredients: body.ingredients,
                                                    quantity: body.quantity,
                                                    kcal: body.kcal,
                                                    type: body.type,
                                                    profile: body.profile

                                                })

                                                newDish.save(
                                                    (error) => {
                                                        if (error) {
                                                            res.send({
                                                                "status": "Couln't save your dish.",
                                                                "error": error
                                                            })
                                                        } else {
                                                            res.send({ "status": "Dish saved!" })
                                                        }
                                                    })
                                            }
                                        } else {
                                            res.send({ "status": "You should be a dietist to get here." })
                                        }
                                    }
                                })
                            } else {
                                res.send({ "status": "Wrong credentials. Not allowed." })
                            }

                        })
                })


                server.get('/dishes', (req, res)=>{
                    Dish.find(
                        (error, data) => {
                            console.log("Buscando a nemo")
                            if (error) {
                                res.send("Couln't find this model.")
                            } else {
                                res.send(data)
                                // for (let i = 0; i < data.length; i++) {
                                //     console.log(data[i]._id)
                                // }
                            }
                        })
                })

            server.listen(3000, () => {
                console.log("Weekly Menu API Server listening on port 3000".green)
            })
        }
    })




    ///////// & 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp