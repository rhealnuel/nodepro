require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const detailsRoute = require('./routes/details')
const cors = require('cors')
const multer = require('multer')
const path = require('path')


const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({ origin: "*" })); // Allow all origins

// If you want to allow credentials (cookies, authorization headers, etc.)
// app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use('/uploads', express.static('uploads'))

//routes

app.use('/api', detailsRoute)

app.get('/', (req, res) => {
    res.send('hello word')
})


//database
mongoose.
connect(MONGO_URL)
.then(() =>{
    console.log('connected to mongodb')

    app.listen(PORT, () => {
        console.log(`app running at port ${PORT}`)
    })
}).catch((error) =>{
    console.log(error)
})