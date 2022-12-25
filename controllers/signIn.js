const User = require('../models/user')
const passport = require('passport');

module.exports.signIn = async(req, res, next) => {

    try {

        passport.authenticate('local', { failureRedirect: 'http://localhost:3000/sign-in' }, async(err, user) => {

            if (err) throw err;

            if (!user) {

                return res.status(404).send({
                    status: 'fail',
                    message: "User doesn't exist or invalid log in data"
                });

            }

            req.login(user, err, async function() {

                if (err) throw err;

                const foundUser = await User.findOne({ _id: req.user.id })

                if (foundUser.isVerified === false) {

                    return res.status(403).send({
                        status: 'fail',
                        message: 'Unable to sign in to your account. Account is not verified, please verify your account in order to use our service',
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

        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });

    }
}

module.exports.signOut = async(req, res, next) => {

    try {

        const { request_for_logout } = req.query

        const requestForLogout = request_for_logout.toLowerCase() == 'true' ? true : false

        if (requestForLogout === false) {

            return res.status(400).send({
                status: "fail",
                message: 'request for logging out failed,please try again',
            })

        }

        const foundUser = await User.findOne({ _id: req.user.id })

        if (!foundUser) {

            return res.status(404).send({
                status: 'fail',
                message: "user is not logged in yet, or does not exist",
            });

        }

        req.logout(function(err) {

            if (err) return next(err);

            return res.status(200).send({
                status: 'success',
                message: 'successfuly logged out'
            })

        });


    } catch (error) {


        return res.status(400).send({
            status: 'fail',
            message: error.message,
        });


    }

}