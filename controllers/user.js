const User = require('../models/user')

module.exports.deleteUser = async(req, res) => {
    try {

        const foundUser = await User.findOne({ _id: req.query.id });

        if (!foundUser) {

            return res.status(404).send({
                status: 'fail',
                message: "Can't find user"
            });

        }

        if (foundUser.isVerified === false) {

            return res.status(400).send({
                status: 'fail',
                message: "Account is not verified, please verify your account to continue with this action"
            })

        }

        const findAndDelete = await User.findOneAndDelete({ _id: foundUser._id })

        if (findAndDelete) {

            return res.status(200).send({
                status: 'success',
                message: "Account was successfuly deleted"
            })

        }

    } catch (error) {

        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });

    }
}

module.exports.disableAccount = async(req, res) => {
    try {

        const foundUser = await User.findOne({ _id: req.query.id })

        if (!foundUser) {

            return res.status(404).send({
                status: 'fail',
                message: "Cannot find account"
            })

        }

        if (foundUser.isDisabled === true) {

            return res.status(400).send({
                status: 'fail',
                message: "account has been previously disabled"
            })

        } else {

            await User.updateOne({ _id: foundUser._id }, { $set: { isDisabled: true } })

        }

        return res.status(200).send({
            status: "success",
            message: "account was successfuly disabled",
            data: { foundUser }
        })

    } catch (error) {

        const { message } = error

        return res.status(400).send({
            status: 'fail',
            message: message
        })

    }
}