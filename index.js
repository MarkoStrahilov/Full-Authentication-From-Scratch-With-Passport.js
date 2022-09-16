const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const User = require('./models/user')

const app = express()
const server = require('http').createServer(app)
const port = 3030

server.listen(port, () => {
    console.log(`running on port ${port}...`)
})

mongoose.connect('mongodb://localhost:27017/full-auth', { useNewUrlParser: true, })
    .then(() => {
        console.log('database connected')
    }).catch(err => {
        console.log('mongoose error connection', err)
    })