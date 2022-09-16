const User = require('../models/user')

// get routes

module.exports.getRegistration = async(req, res) => {
    try {

        res.render('../views/register.ejs')

    } catch (error) {

        console.log(error)

    }
}

module.exports.getSignIn = async(req, res) => {
    try {

        res.render('../views/signIn.ejs')

    } catch (error) {

        console.log(error)

    }
}

module.exports.successPage = async(req, res) => {
    try {

        res.render('../views/index.ejs')

    } catch (error) {

        console.log(error)

    }
}