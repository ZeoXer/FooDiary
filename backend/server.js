require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')

//express app
const app = express()

//connect to db on mongodb atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, ()=> {
            console.log('listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })