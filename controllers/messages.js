const User = require("../models/user")
const Message = require("../models/message")
const Plan = require("../models/plans")


module.exports.sendMessage = async(req, res) => {

    try {

        return res.status(200).send({
            status: "success",
            message: "endpint was hit",
        })


    } catch (error) {

        return res.status(400).send({
            status: 'fail',
            message: error.message
        })

    }

}