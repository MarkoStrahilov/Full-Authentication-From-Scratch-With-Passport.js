const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports.requestPasswordReset = async(req, res) => {

    try {

        const foundUser = await User.findOne({ email: req.body.email })

        if (!foundUser) {

            return res.status(404).send({
                status: 'fail',
                message: "can't find user"
            })

        }

        if (foundUser.isVerified === false) {

            return res.status(400).send({
                status: 'fail',
                message: "account is not verified, cannot accept request for password reset"
            })

        }

        const passwordResetToken = await foundUser.createPasswordResetToken()
        await foundUser.save({ validateBeforeSave: false });

        if (!passwordResetToken) {

            return res.status(400).send({
                status: 'fail',
                message: "something went wrong, didn't create a reset token, please try again",
            });

        }

        return res.status(200).send({
            status: 'success',
            message: "reqest for resetting password was successful",
            data: {
                resetPasswordToken: passwordResetToken
            }
        })

    } catch (error) {

        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });

    }

}

module.exports.resetPassword = async(req, res) => {

    try {

        if (!req.query.userId || !req.query.token) {

            return res.status(404).send({
                status: 'fail',
                message: "query parametars are required"
            })

        }

        if (!req.body.newPassword || !req.body.matchNewPassword) {

            return res.status(400).send({
                status: 'fail',
                message: "please provide your new password"
            })

        }

        const { userId, token } = req.query
        const foundUser = await User.findOne({ _id: userId })

        if (!foundUser) {

            return res.status(404).send({
                status: 'fail',
                message: "can't find user"
            })

        }

        const validToken = await bcrypt.compare(token, foundUser.passwordResetToken)

        if (validToken !== true) {

            return res.status(400).send({
                status: 'fail',
                message: 'incorrect reset token',
            });

        }

        const validUser = await User.findOne({ _id: foundUser._id, passwordResetExpires: { $gt: Date.now() } })

        if (!validUser) {

            return res.status(400).send({
                status: 'fail',
                message: 'incorrect user or token has expired, please request a new one',
            });

        }

        if (req.body.newPassword !== req.body.matchNewPassword) {

            return res.status(406).send({
                status: "fail",
                message: "passwords don't match"
            })

        }

        foundUser.setPassword(req.body.matchNewPassword, async function(err, user) {

            if (err) {

                res.status(406).send({
                    status: "fail",
                    message: "something went wrong please try again"
                });

            } else {

                await foundUser.save()

                return res.status(200).send({
                    status: "success",
                    message: "password reset was successful",
                    data: { foundUser, validToken }
                })
            }
        });

    } catch (error) {

        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });

    }

}