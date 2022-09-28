const User = require('../models/user')
const Token = require('../models/otpToken')
const passport = require('passport');

module.exports.signIn = async(req, res, next) => {

    try {

        passport.authenticate('local', { failureRedirect: 'http://localhost:3000/sign-in' }, async(err, user) => {

            if (err) throw err;

            if (!user) {

                return res.status(404).send({
                    status: 'fail',
                    message: "User doesn't exist"
                });

            }

            req.login(user, err, async function() {

                if (err) throw err;

                const foundUser = await User.findOne({ _id: req.user.id })

                if (foundUser.isVerified === false) {

                    return res.status(403).send({
                        status: 'fail',
                        message: 'Unable to sign in to your account',
                        reason: 'Account is not verified, please verify your account in order to use our service'
                    });

                } else {

                    return res.status(200).send({
                        status: 'success',
                        message: 'successfuly signed in',
                        data: { foundUser }
                    })

                }

            })

        })(req, res, next)

    } catch (error) {

        return res.status(401).send({
            status: 'fail',
            message: error.message,
        });

    }
}