const User = require('../models/user')
const Token = require('../models/otpToken')
const bcrypt = require('bcrypt')

module.exports.register = async(req, res) => {
    try {

        const { username, password, email } = req.body

        if (!username || !password || !email) {

            return res.status(400).send({
                status: 'fail',
                message: "please provide your information in order to proceed"
            })

        }

        if (password.length <= 7 || password.indexOf(" ") !== -1) {

            return res.status(400).send({
                status: "fail",
                message: 'password must be longer then 6 characters and should not contain any spaces',
            })

        }

        const newUser = new User({ email, username })
        const registerUser = await User.register(newUser, password)

        if (!registerUser || !newUser) {

            res.status(400).send({
                status: 'fail',
                message: "something went wrong please try again"
            })
        }

        const otp = `${Math.floor(Math.random() * 1000000000000000)}`
        const hashedOtp = await bcrypt.hash(otp, 12)

        const otpToken = new Token({
            userId: registerUser._id,
            otpSecret: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000
        })

        await otpToken.save()

        const link = `http://localhost:3030/api/v1/register/validation/user?id=${registerUser._id}&token=${otp}&token_request_validation=true`

        res.status(200).send({
            status: 'success',
            message: "please verify your account",
            data: { link },
        })

    } catch (error) {

        return res.status(400).send({
            status: "fail",
            message: error.message,
        })

    }
}

module.exports.validateToken = async(req, res, next) => {

    try {

        const { id, token } = req.query
        const requestForValidation = req.query.token_request_validation

        if (!id || !token || !requestForValidation) {

            return res.status(400).send({
                status: 'fail',
                message: 'missing valid credentials',
            });

        }

        const tokenValidation = requestForValidation.toLowerCase() == 'true' ? true : false

        if (tokenValidation === false) {

            return res.status(400).send({
                status: "fail",
                message: 'validation error, please try again',
            })

        }

        const foundUser = await User.findOne({ _id: id })
        const foundToken = await Token.findOne({ userId: foundUser._id })

        if (!foundUser || !foundToken) {

            return res.status(400).send({
                status: "fail",
                message: 'cannot find user or validation token has expired, please try again',
            })

        }

        if (foundUser.isVerified === true) {

            return res.status(406).send({
                status: "fail",
                message: 'account has already been verified',
            })

        }

        const expirationDate = foundToken.expiresAt

        if (expirationDate < Date.now()) {

            await Token.deleteMany({ _id: foundToken._id })

            return res.status(400).send({
                status: "fail",
                message: 'validation token has been expired, please request a new one',
            })

        }

        const validToken = await bcrypt.compare(token, foundToken.otpSecret)

        if (!validToken) {

            return res.status(400).send({
                status: "fail",
                message: 'incorrect validation token, please try again',
            })

        }

        await User.updateOne(foundUser, { $set: { isVerified: true } }, { runValidators: true })
        await foundUser.save()

        await Token.deleteMany({ _id: foundToken._id })

        req.login(foundUser, function(err) {

            if (err) { return next(err); }

            return res.status(200).send({
                status: "success",
                message: "auth token valid",
                data: { id, token, requestForValidation }
            })

        })


    } catch (error) {

        return res.status(400).send({
            status: "fail",
            message: error.message,
        })

    }

}