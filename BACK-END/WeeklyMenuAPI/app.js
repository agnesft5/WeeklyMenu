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
const https = require('https');

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
const corsOptions = {
    origin: 'https://weeklydiet.es',
    credentials: true,
    optionsSuccessStatus: 200
  }
server.use(cors(corsOptions));
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

mongoose.connect(`mongodb+srv://agnesft5:${secrets['password']}@weeklydiet-amptd.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            res.send(error)
        } else {

            console.log("Connection with MongoDB created".green)

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

            //////////////// - ADD DISH - /////////////////

            server.post('/add-dish', [
                check('name').trim().escape().not().isEmpty(),
                check('ingredients.*').trim().escape().not().isEmpty(),
                check('quantity.*').trim().escape().not().isEmpty(),
                check('kcal').trim().escape().not().isEmpty(),
                check('type').trim().escape().not().isEmpty(),
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
                                                    profile: body.profile,
                                                    user: decoded['id']

                                                })

                                                newDish.save(
                                                    (error) => {
                                                        if (error) {
                                                            res.send({
                                                                "status": "Couln't save your dish.",
                                                                "error": error
                                                            })
                                                        } else {
                                                            res.send({
                                                                "status": "Dish saved!",
                                                                "data": newDish
                                                            })
                                                            console.log({
                                                                "status": "Dish saved!",
                                                                "data": newDish
                                                            })
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

            //////////////// - GET DISHES - /////////////////

            server.get('/get-dishes', (req, res) => {

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
                                        Dish.find(
                                            (error, data) => {
                                                if (error) {
                                                    res.send("Couln't find this model.")
                                                } else {
                                                    res.send(data)
                                                    // for (let i = 0; i < data.length; i++) {
                                                    //     console.log(i, data[i])
                                                    // }
                                                }
                                            })
                                    } else {
                                        res.send({ "status": "You should be a dietist to get here." })
                                    }

                                }
                            })
                        }
                    })
            })

            //////////////// - GET DIETIST DISHES - /////////////////

            server.get('/posted-dishes', (req, res) => {

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
                                        Dish.find({ "user": decoded['id'] },
                                            (error, data) => {
                                                if (error) {
                                                    res.send("Couln't find your dishes.")
                                                } else {
                                                    if (data.length > 0) {
                                                        res.send(data)
                                                    } else {
                                                        res.send({ "status": "You haven't uploaded any dishes yet." })
                                                    }
                                                }
                                            })
                                    } else {
                                        res.send({ "status": "You should be a dietist to get here." })
                                    }

                                }
                            })
                        }
                    })
            })

            //////////////// - DELETE DIETIST DISHES - /////////////////

            server.delete('/delete-dish/:id', (req, res) => {
                let id = req.params.id
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
                                        Dish.findByIdAndDelete(id,
                                            (error, data) => {
                                                if (error) {
                                                    res.send({
                                                        "status": "Couln't delete your dish.",
                                                        "error": error
                                                    })
                                                    console.log(error)
                                                } else {
                                                    res.send({ "status": "Dish deleted successfully!" })
                                                }
                                            })
                                    } else {
                                        res.send({ "status": "You should be a dietist to get here." })
                                    }

                                }
                            })
                        }
                    })
            })

            /////////////////////////////////// MENU /////////////////////////////////

            //////////////// - GENERATE MENU - /////////////////

            server.post('/generate-menu', (req, res) => {

                let token = req.cookies["jwt"]
                jwt.verify(token, secrets["jwt_key"],
                    (error, decoded) => {
                        if (error) {
                            res.send({
                                "status": "Authentication failed.",
                                "error": error
                            })
                        } else if (decoded) {
                            User.findById(decoded['id'], (error, user) => {
                                if (error) {
                                    res.send({ "status": "Couldn't find this user." })
                                } else {
                                    console.log({ "status": "User found." })

                                    /////// ALGORITME DIETA
                                    Dish.find({ profile: user.userProfile },
                                        (error, dishes) => {
                                            if (error) {
                                                res.send("Couln't find this model.")
                                            } else {

                                                //STARTER LUNCH
                                                let SL = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "starter_lunch") {
                                                        SL.push(dishes[i])
                                                    }
                                                }

                                                let SL_index = Math.round(Math.random() * (SL.length - 1))
                                                let starter_lunch = SL[SL_index]

                                                //MAIN LUNCH
                                                let ML = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "main_lunch") {
                                                        ML.push(dishes[i])
                                                    }
                                                }

                                                let ML_index = Math.round(Math.random() * (ML.length - 1))
                                                let main_lunch = ML[ML_index]

                                                //DESSERT LUNCH
                                                let DL = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "dessert_lunch") {
                                                        DL.push(dishes[i])
                                                    }
                                                }

                                                let DL_index = Math.round(Math.random() * (DL.length - 1))
                                                let dessert_lunch = DL[DL_index]

                                                //STARTER DINNER
                                                let SD = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "starter_dinner") {
                                                        SD.push(dishes[i])
                                                    }
                                                }

                                                let SD_index = Math.round(Math.random() * (SD.length - 1))
                                                let starterDinner = SD[SD_index]
                                                let starter_dinner;

                                                if (starterDinner.name == starter_lunch.name) {
                                                    SD_index = Math.round(Math.random() * (SD.length - 1))
                                                    starterDinner = SD[SD_index]
                                                    console.log("Índex SD canviat 1")
                                                    if (starterDinner.name == starter_lunch.name) {
                                                        SD_index = Math.round(Math.random() * (SD.length - 1))
                                                        starterDinner = SD[SD_index]
                                                        starter_dinner = starterDinner
                                                        console.log("Índex SD canviat 2")
                                                    } else {
                                                        starter_dinner = starterDinner
                                                        console.log("Índex SD comprovat")
                                                    }
                                                } else {
                                                    starter_dinner = starterDinner
                                                    console.log("SD - Funciona")
                                                }

                                                //MAIN DINNER
                                                let MD = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "main_dinner") {
                                                        MD.push(dishes[i])
                                                    }
                                                }

                                                let MD_index = Math.round(Math.random() * (MD.length - 1))
                                                let mainDinner = MD[MD_index]
                                                let main_dinner;

                                                if (mainDinner.name == main_lunch.name) {
                                                    MD_index = Math.round(Math.random() * (MD.length - 1))
                                                    mainDinner = MD[MD_index]
                                                    console.log("Índex MD canviat 1")
                                                    if (mainDinner.name == starter_lunch.name) {
                                                        MD_index = Math.round(Math.random() * (MD.length - 1))
                                                        mainDinner = MD[MD_index]
                                                        main_dinner = mainDinner
                                                        console.log("Índex MD canviat 2")
                                                    } else {
                                                        main_dinner = mainDinner
                                                        console.log("Índex MD comprovat")
                                                    }
                                                } else {
                                                    main_dinner = mainDinner
                                                    console.log("MD -Funciona")
                                                }

                                                //DESSERT DINNER
                                                let DD = []

                                                for (let i = 0; i < dishes.length; i++) {
                                                    if (dishes[i].type == "dessert_dinner") {
                                                        DD.push(dishes[i])
                                                    }
                                                }

                                                let DD_index = Math.round(Math.random() * (DD.length - 1))
                                                let dessertDinner = DD[DD_index]
                                                let dessert_dinner;

                                                if (dessertDinner.name == dessert_lunch.name) {
                                                    DD_index = Math.round(Math.random() * (DD.length - 1))
                                                    dessertDinner = DD[DD_index]
                                                    console.log("Índex DD canviat 1")
                                                    if (dessertDinner.name == dessert_lunch.name) {
                                                        DD_index = Math.round(Math.random() * (DD.length - 1))
                                                        dessertDinner = DD[DD_index]
                                                        dessert_dinner = dessertDinner
                                                        console.log("Índex DD canviat 2")
                                                    } else {
                                                        dessert_dinner = dessertDinner
                                                        console.log("Índex DD comprovat")
                                                    }
                                                } else {
                                                    dessert_dinner = dessertDinner
                                                    console.log("DD - Funciona")
                                                }

                                                const newMenu = new Menu({
                                                    _id: mongoose.Types.ObjectId(),
                                                    user: decoded['id'],
                                                    date: new Date(),
                                                    starterLunch: starter_lunch,
                                                    mainLunch: main_lunch,
                                                    dessertLunch: dessert_lunch,
                                                    starterDinner: starter_dinner,
                                                    mainDinner: main_dinner,
                                                    dessertDinner: dessert_dinner
                                                })

                                                console.log(newMenu)

                                                newMenu.save((error) => {
                                                    if (error) {
                                                        res.send({
                                                            "status": "Couldn't generate your menu",
                                                            "error": error
                                                        })
                                                    } else {
                                                        res.send({
                                                            "status": "Menu generated successfully!",
                                                            "data": newMenu
                                                        })
                                                    }
                                                })
                                            }
                                        })

                                }
                            })
                        }
                    })
            })


            //////////////// - GENERATE WEEK DIET - /////////////////
            server.post('/generate-diet', (req, res) => {
                let token = req.cookies["jwt"]
                jwt.verify(token, secrets["jwt_key"],
                    (error, decoded) => {
                        if (error) {
                            res.send({
                                "status": "Authentication failed.",
                                "error": error
                            })
                        } else if (decoded) {
                            User.findById(decoded['id'], (error, user) => {
                                if (error) {
                                    res.send({ "status": "Couldn't find this user." })
                                } else {
                                    console.log({ "status": "User found." })
                                    const newMenus = []
                                    for (let menuDiet = 0; menuDiet < 7; menuDiet++) {
                                        /////// ALGORITME DIETA
                                        Dish.find({ profile: user.userProfile },
                                            (error, dishes) => {
                                                if (error) {
                                                    res.send("Couln't find this model.")
                                                } else {

                                                    //STARTER LUNCH
                                                    let SL = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "starter_lunch") {
                                                            SL.push(dishes[i])
                                                        }
                                                    }

                                                    let SL_index = Math.round(Math.random() * (SL.length - 1))
                                                    let starter_lunch = SL[SL_index]

                                                    //MAIN LUNCH
                                                    let ML = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "main_lunch") {
                                                            ML.push(dishes[i])
                                                        }
                                                    }

                                                    let ML_index = Math.round(Math.random() * (ML.length - 1))
                                                    let main_lunch = ML[ML_index]

                                                    //DESSERT LUNCH
                                                    let DL = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "dessert_lunch") {
                                                            DL.push(dishes[i])
                                                        }
                                                    }

                                                    let DL_index = Math.round(Math.random() * (DL.length - 1))
                                                    let dessert_lunch = DL[DL_index]

                                                    //STARTER DINNER
                                                    let SD = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "starter_dinner") {
                                                            SD.push(dishes[i])
                                                        }
                                                    }

                                                    let SD_index = Math.round(Math.random() * (SD.length - 1))
                                                    let starterDinner = SD[SD_index]
                                                    let starter_dinner;

                                                    if (starterDinner.name == starter_lunch.name) {
                                                        SD_index = Math.round(Math.random() * (SD.length - 1))
                                                        starterDinner = SD[SD_index]
                                                        console.log("Índex SD canviat 1")
                                                        if (starterDinner.name == starter_lunch.name) {
                                                            SD_index = Math.round(Math.random() * (SD.length - 1))
                                                            starterDinner = SD[SD_index]
                                                            starter_dinner = starterDinner
                                                            console.log("Índex SD canviat 2")
                                                        } else {
                                                            starter_dinner = starterDinner
                                                            console.log("Índex SD comprovat")
                                                        }
                                                    } else {
                                                        starter_dinner = starterDinner
                                                        console.log("SD - Funciona")
                                                    }

                                                    //MAIN DINNER
                                                    let MD = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "main_dinner") {
                                                            MD.push(dishes[i])
                                                        }
                                                    }

                                                    let MD_index = Math.round(Math.random() * (MD.length - 1))
                                                    let mainDinner = MD[MD_index]
                                                    let main_dinner;

                                                    if (mainDinner.name == main_lunch.name) {
                                                        MD_index = Math.round(Math.random() * (MD.length - 1))
                                                        mainDinner = MD[MD_index]
                                                        console.log("Índex MD canviat 1")
                                                        if (mainDinner.name == starter_lunch.name) {
                                                            MD_index = Math.round(Math.random() * (MD.length - 1))
                                                            mainDinner = MD[MD_index]
                                                            main_dinner = mainDinner
                                                            console.log("Índex MD canviat 2")
                                                        } else {
                                                            main_dinner = mainDinner
                                                            console.log("Índex MD comprovat")
                                                        }
                                                    } else {
                                                        main_dinner = mainDinner
                                                        console.log("MD -Funciona")
                                                    }

                                                    //DESSERT DINNER
                                                    let DD = []

                                                    for (let i = 0; i < dishes.length; i++) {
                                                        if (dishes[i].type == "dessert_dinner") {
                                                            DD.push(dishes[i])
                                                        }
                                                    }

                                                    let DD_index = Math.round(Math.random() * (DD.length - 1))
                                                    let dessertDinner = DD[DD_index]
                                                    let dessert_dinner;

                                                    if (dessertDinner.name == dessert_lunch.name) {
                                                        DD_index = Math.round(Math.random() * (DD.length - 1))
                                                        dessertDinner = DD[DD_index]
                                                        console.log("Índex DD canviat 1")
                                                        if (dessertDinner.name == dessert_lunch.name) {
                                                            DD_index = Math.round(Math.random() * (DD.length - 1))
                                                            dessertDinner = DD[DD_index]
                                                            dessert_dinner = dessertDinner
                                                            console.log("Índex DD canviat 2")
                                                        } else {
                                                            dessert_dinner = dessertDinner
                                                            console.log("Índex DD comprovat")
                                                        }
                                                    } else {
                                                        dessert_dinner = dessertDinner
                                                        console.log("DD - Funciona")
                                                    }

                                                    menuDiet = new Menu({
                                                        _id: mongoose.Types.ObjectId(),
                                                        user: decoded['id'],
                                                        date: new Date(),
                                                        starterLunch: starter_lunch,
                                                        mainLunch: main_lunch,
                                                        dessertLunch: dessert_lunch,
                                                        starterDinner: starter_dinner,
                                                        mainDinner: main_dinner,
                                                        dessertDinner: dessert_dinner
                                                    })
                                                    // console.log(menuDiet)
                                                    // console.log(menuDiet['_id'])



                                                    menuDiet.save((error) => {
                                                        if (error) {
                                                            res.send({
                                                                "status": "Couldn't generate your menu",
                                                                "error": error
                                                            })
                                                        } else {
                                                            newMenus.push(menuDiet['_id'])
                                                            // console.log(newMenus)
                                                        }
                                                        if (newMenus.length === 7) {
                                                            const newDiet = new Diet({
                                                                _id: mongoose.Types.ObjectId(),
                                                                user: decoded['id'],
                                                                date: new Date(),
                                                                menus: newMenus
                                                            })
                                                            console.log(newDiet)
                                                            newDiet.save((error) => {
                                                                if (error) {
                                                                    res.send({
                                                                        "status": "Couldn't generate your diet",
                                                                        "error": error
                                                                    })
                                                                } else {
                                                                    res.send({
                                                                        "status": "Diet generated successfully!",
                                                                        "data": newDiet
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            console.log("Not yet")
                                                        }
                                                    })

                                                }

                                            })

                                    }

                                }

                            })
                        }
                    })
            })


            //////////////// - GET DIET - /////////////////

            server.get('/get-diet/:id', (req, res) => {
                let id = decodeURI(req.params.id);
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
                                    Diet.findById(id, (error, data) => {
                                        if (error) {
                                            res.send({ "status": "Couldn't find your diet" })
                                        } else {
                                            res.send({
                                                "status": "Diet found!",
                                                "data": data
                                            })
                                        }
                                    })

                                }
                            })
                        }
                    })
            })


            //////////////// - GET MENU - /////////////////

            server.get('/get-menu/:id', (req, res) => {
                let id = decodeURI(req.params.id);
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
                                    Menu.findById(id, (error, data) => {
                                        if (error) {
                                            res.send({ "status": "Couldn't find your menu" })
                                        } else {
                                            res.send({
                                                "status": "Menu found!",
                                                "data": data
                                            })
                                        }
                                    })

                                }
                            })
                        }
                    })
            })

            https.createServer({
                key: fs.readFileSync('/etc/letsencrypt/live/weeklydiet.es/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/weeklydiet.es/fullchain.pem')
            }, server).listen(3000, () => {
                console.log('Servidor escuchando en el puerto 3000');
            })
        }
    })




    ///////// & 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp