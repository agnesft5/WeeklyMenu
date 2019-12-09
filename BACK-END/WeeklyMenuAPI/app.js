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
}).unless({ path: ["/login", "register"] })
)


/////////////////////// CONNEXIÓN ///////////////////////

mongoose.connect(`mongodb://localhost/WeeklyMenu`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            res.send(error)
        } else {

            console.log("Connection with MongoDB created".green)

            //////////////////// USER /////////////////////

            //////////////// - SIGN IN - /////////////////

            server.post('/register', [
                check('name').not().isEmpty().trim().escape(),
                check('lastName').not().isEmpty().trim().escape(),
                check('username').not().isEmpty().trim().escape(),
                check('password').not().isEmpty().trim().escape()
            ], (req, res) => {
                let body = req.body
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

            //Comprovació users
            server.get('/users', (req, res) => {
                let token = req.cookies["jwt"]
                jwt.verify(token, secrets["jwt_key"],
                    (error, decoded) => {
                        if (error) {
                            res.send({
                                "status": "Authentication failed.",
                                "error": error
                            })
                        } else if (decoded['id'] == "5de93602d563c96abc61d737") {
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
                check('password').not().isEmpty().trim().escape()
            ], (req, res) => {
                let body = req.body;
                if (body.name !== undefined && body.lastName !== undefined && body.username !== undefined && body.email !== undefined && body.password !== undefined) {
                    User.findOne({ "username": body.username }, (error, data) => {
                        let userFound = data
                        if(error){
                            res.send(error)
                        }else if (userFound !== null) {
                            console.log(userFound)
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


            server.listen(3000, () => {
                console.log("Weekly Menu API Server listening on port 3000".green)
            })
        }
    })
