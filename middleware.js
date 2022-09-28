module.exports.asyncErrorHandle = (fn) => {
    return function(req, res, next) {
        fn(req, res).catch(e => next(e))
    }
}

module.exports.isLoggedIn = async(req, res, next) => {

    if (!req.isAuthenticated()) {

        return res.status(401).send({
            status: 'fail',
            message: "Unauthorized, please sign in or register a new account"
        })

    }
    next()
}