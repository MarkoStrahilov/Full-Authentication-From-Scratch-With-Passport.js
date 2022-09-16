module.exports.asyncErrorHandle = (fn) => {
    return function(req, res, next) {
        fn(req, res).catch(e => next(e))
    }
}