const User = require('../models/user')
const Token = require('../models/otpToken')
const CustomError = require('../CustomError')
const bcrypt = require('bcrypt')

module.exports.register = async(req, res) => {
    try {

        const { username, password, email } = req.body
        const newUser = new User({ email, username })
        const registerUser = await User.register(newUser, password)

        const otp = `${Math.floor(Math.random() * 1000000000000000)}`
        const hashedOtp = await bcrypt.hash(otp, 12)

        const otpToken = new Token({
            userId: registerUser._id,
            otpSecret: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000
        })

        await otpToken.save()

        const link = `http://localhost:3030/register/new/user?id=${registerUser._id}&token=${otp}&token_request_validation=true`

        res.status(200).send({
            status: 'success',
            message: "please verify your account",
            data: { otp, link, otpToken, registerUser },
        })

    } catch (error) {

        return res.status(400).send({
            status: "fail",
            message: error.message,
        })

    }
}

module.exports.validateToken = async(req, res) => {

    try {

        const { id, token } = req.query
        const requestForValidation = req.query.token_request_validation

        const tokenValidation = requestForValidation.toLowerCase() == 'true' ? true : false

        if (tokenValidation === false) {

            res.status(400).send({
                status: "fail",
                message: 'validation error, please try again',
            })

        }

        const foundUser = await User.findOne({ _id: id })
        const foundToken = await Token.findOne({ userId: foundUser._id })

        if (!foundUser || !foundToken) return new CustomError('cannot find user or validation toke, please try again')

        const expirationDate = foundToken.expiresAt

        if (expirationDate < Date.now()) {

            await Token.deleteMany({ _id: foundToken._id })

            return new CustomError('validation token has been expired')
        }

        const validToken = await bcrypt.compare(token, foundToken.otpSecret)

        if (!validToken) return new CustomError('wrong token, please try again')

        await User.updateOne(foundUser, { $set: { isVerified: true } }, { runValidators: true })
        await foundUser.save()

        await Token.deleteMany({ _id: foundToken._id })

        res.status(200).send({
            status: "success",
            message: "auth token valid",
            data: { id, token, requestForValidation }
        })


    } catch (error) {

        return res.status(400).send({
            status: "fail",
            message: error.message,
        })

    }

}