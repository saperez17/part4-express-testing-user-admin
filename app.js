<<<<<<< HEAD
require('express-async-errors')
=======
>>>>>>> main
const config = require('./utils/config')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
<<<<<<< HEAD
const usersRouter = require('./controllers/users')
=======
>>>>>>> main
const middleware = require('./utils/middleware')
const Blog = require('./models/blog')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)
<<<<<<< HEAD
app.use('/api/users', usersRouter)
=======
>>>>>>> main

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app

