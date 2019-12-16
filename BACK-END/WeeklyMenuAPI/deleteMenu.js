const mongoose = require('mongoose');

const Menu = require('./models/menu');

mongoose.connect(`mongodb://localhost/WeeklyMenu`, { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            console.log(error)
        } else {

            Menu.find(
                (error, data) => {
                    console.log("Buscando a nemo")
                    if (error) {
                        console.log("Couln't find this model.")
                        console.log(error)
                    } else {
                        if (data.length === 0) {
                            console.log(`Data is empty`)
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                console.log("data[i] ->", data[i])
                                console.log("data[i].-id ->", data[i]._id)
                                Menu.findByIdAndDelete(data[i], (error) => {
                                    if (error) {
                                        console.log("Couln't delete your menu")
                                    } else {
                                        console.log(`Menu ${i} deleted`)
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })