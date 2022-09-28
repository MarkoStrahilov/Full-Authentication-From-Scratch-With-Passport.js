module.exports.asyncErrorHandle = (fn) => {
    return function(req, res, next) {
        fn(req, res).catch(e => next(e))
    }
}

module.exports.isLoggedIn = async(req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/sign-in')
    }
    next()
}