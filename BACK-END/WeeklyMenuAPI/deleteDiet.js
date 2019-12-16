const mongoose = require('mongoose');

const Diet = require('./models/dish');

mongoose.connect(`mongodb://localhost/WeeklyMenu`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            console.log(error)
        } else {

            Diet.find(
                (error, data) => {
                    console.log("Buscando a nemo")
                    if (error) {
                        console.log("Couln't find this model.")
                    } else {
                        if (data.length === 0) {
                            console.log(`Data is empty`)
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                console.log("data[i] ->", data[i])
                                console.log("data[i].-id ->", data[i]._id)
                                Diet.findByIdAndDelete(data[i], (error) => {
                                    if (error) {
                                        console.log("Couln't delete your diet")
                                    } else {
                                        console.log(`Diet ${i} deleted`)
                                    }
                                })
                            }
                        }
                    }
                })
        }
    })