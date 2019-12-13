const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csvtojson');


const Dish = require('../WeeklyMenuAPI/models/dish');
const User = require('../WeeklyMenuAPI/models/user');

const objProf = {
    profile_1200: [
        { meal: "starter_lunch", range: [202, 207] },
        { meal: "main_lunch", range: [126, 130] },
        { meal: "dessert_lunch", range: [90, 94] },
        { meal: "starter_dinner", range: [114, 119] },
        { meal: "main_dinner", range: [71, 75] },
        { meal: "dessert_dinner", range: [44, 50] }
    ],
    profile_1400: [
        { meal: "starter_lunch", range: [240, 261] },
        { meal: "main_lunch", range: [143, 147] },
        { meal: "dessert_lunch", range: [101, 106] },
        { meal: "starter_dinner", range: [137, 142] },
        { meal: "main_dinner", range: [83, 89] },
        { meal: "dessert_dinner", range: [51, 55] }
    ],
    profile_1600: [
        { meal: "starter_lunch", range: [262, 285] },
        { meal: "main_lunch", range: [163, 173] },
        { meal: "dessert_lunch", range: [107, 113] },
        { meal: "starter_dinner", range: [155, 162] },
        { meal: "main_dinner", range: [95, 100] },
        { meal: "dessert_dinner", range: [61, 65] }
    ],
    profile_1800: [
        { meal: "starter_lunch", range: [286, 320] },
        { meal: "main_lunch", range: [190, 194] },
        { meal: "dessert_lunch", range: [131, 136] },
        { meal: "starter_dinner", range: [226, 230] },
        { meal: "main_dinner", range: [56, 60] },
        { meal: "dessert_dinner", range: [66, 70] }
    ],
    profile_2000: [
        { meal: "starter_lunch", range: [321, 355] },
        { meal: "main_lunch", range: [208, 215] },
        { meal: "dessert_lunch", range: [148, 154] },
        { meal: "starter_dinner", range: [195, 201] },
        { meal: "main_dinner", range: [120, 125] },
        { meal: "dessert_dinner", range: [76, 82] }
    ], profile_2200: [
        { meal: "starter_lunch", range: [356, 390] },
        { meal: "main_lunch", range: [231, 239] },
        { meal: "dessert_lunch", range: [174, 184] },
        { meal: "starter_dinner", range: [216, 225] },
        { meal: "main_dinner", range: [185, 189] },
        { meal: "dessert_dinner", range: [15, 43] }
    ]

}

// function findDetails(kcal) {
//     for (let i = 0; i < Object.keys(objProf).length; i++) {
//         let profileKey = Object.keys(objProf)[i]
//         let arrProf = objProf[profileKey]
//         for (j = 0; j < arrProf.length; j++) {
//             let meal = arrProf[j].meal;
//             let arrRange = arrProf[j].range;
//             let inferior = arrRange[0];
//             let superior = arrRange[1];
//             console.log(inferior, superior)

//             if (kcal > inferior && kcal < superior) {
//                 let profile = profileKey;
//                 let type = meal;
//             }

//         }
//     }
// }






mongoose.connect(`mongodb://localhost/WeeklyMenu`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        console.log(error)
        console.log("Conectadísimo a mongo!")

        User.find({},
            (error, data) => {
                console.log("Buscando a nemo")
            })



        if (error) {
            res.send(error)
        } else {
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
                        csv({
                            noheader: false,
                            headers: ['name', 'ingredients', 'quantity', 'kcal'],
                            delimiter: ';'
                        })
                            .fromFile('C:\\Users\\agnes\\Desktop\\platos1.csv')
                            .then((jsonObj) => {
                                for (const [index, receta] of jsonObj.entries()) {
                                    //console.log(receta, index)
                                    let ingredientes = [];
                                    receta.ingredients.split(',').forEach((element) => {
                                        ingredientes.push(element.trim())
                                    });
                                    jsonObj[index].ingredients = ingredientes;

                                    let quantity = [];
                                    receta.quantity.split(',').forEach((element) => {
                                        quantity.push(parseInt(element.trim()))
                                    });
                                    jsonObj[index].quantity = quantity;

                                    jsonObj[index].kcal = parseInt(jsonObj[index].kcal)

                                    //CALCULAR PERFIL I TIPO

                                    let type;
                                    let profile;
                                    let profileFound = false;

                                    for (let i = 0; i < Object.keys(objProf).length; i++) {
                                        let profileKey = Object.keys(objProf)[i]
                                        let arrProf = objProf[profileKey]


                                        for (j = 0; j < arrProf.length; j++) {
                                            let meal = arrProf[j].meal;
                                            let arrRange = arrProf[j].range;
                                            let inferior = arrRange[0];
                                            let superior = arrRange[1];

                                            if (jsonObj[index].kcal >= inferior && jsonObj[index].kcal <= superior) {
                                                profile = profileKey;
                                                type = meal;
                                                profileFound = true;
                                                // console.log(`PRIMER IF: plato ${jsonObj[index].name} con ${jsonObj[index].kcal} kcal, limite ${inferior}-${superior}, perfil: ${profile}, tipo: ${meal} `)
                                            } else if (jsonObj[index].kcal >= 391) {
                                                profile = "profile_2200";
                                                type = "starter_lunch";
                                                profileFound = true;
                                                // console.log(`SEGUNDO IF: plato ${jsonObj[index].name} con ${jsonObj[index].kcal} kcal, limite ${inferior}-${superior}, perfil: ${profile}, tipo: ${meal} `)
                                            } else if (jsonObj[index].kcal <= 14) {
                                                profile = "profile_1200";
                                                type = "dessert_dinner";
                                                profileFound = true;
                                                // console.log(`TERCER IF: plato ${jsonObj[index].name} con ${jsonObj[index].kcal} kcal, limite ${inferior}-${superior}, perfil: ${profile}, tipo: ${meal} `)
                                            }
                                            /*else {
                                                profile = "profile_undefined";
                                                type = "meal_undefined"
                                                // console.log(`CUARTO IF: plato ${jsonObj[index].name} con ${jsonObj[index].kcal} kcal, limite ${inferior}-${superior}, perfil: ${profile}, tipo: ${meal} `)
                                            }*/

                                        }

                                    }

                                    if (!profileFound) {
                                        profile = "profile_undefined";
                                        type = "meal_undefined";
                                    }



                                    jsonObj[index].type = type;
                                    jsonObj[index].profile = profile;
                                    jsonObj[index]._id = mongoose.Types.ObjectId();

                                    const newDish = new Dish(jsonObj[index])
                                    //console.log(newDish)
                                    newDish.save((err) => {
                                        if (err) throw err;
                                        console.log(`Plato nº ${index} (${jsonObj[index]})añadido`)
                                    })
                                }

                                mongoose.disconnect()
                            })



                    }
                })
        }


    })


