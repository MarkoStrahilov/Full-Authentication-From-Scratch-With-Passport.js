const User = require('../models/user')

module.exports.deleteUser = async(req, res) => {
    try {

        const foundUser = await User.findOne({ _id: req.query.id });

        if (foundUser.isVerified === false) {

            return res.status(400).send({
                status: 'fail',
                message: "account is not verified, please verify your account to continue with this action"
            })

        }

        const findAndDelete = await User.findOneAndDelete({ _id: foundUser._id })

        if (findAndDelete) {

            return res.status(200).send({
                status: 'success',
                message: "account was successfuly deleted"
            })

        }

    } catch (error) {

        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });

    }
}