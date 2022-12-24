const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// auth functions
const { register, validateToken } = require('../controllers/register')
const { signIn, signOut } = require('../controllers/signIn')
const { resetPassword, requestPasswordReset } = require('../controllers/passwordReset')
const { deleteUser } = require("../controllers/user")

// registration / account validation
router.post('/api/v1/register/user', asyncErrorHandle(register))
router.get('/api/v1/register/validation/user', asyncErrorHandle(validateToken))

// sign in / out
router.post('/api/v1/sign-in/user', asyncErrorHandle(signIn))
router.post('/api/v1/sign-out/user', asyncErrorHandle(signOut))

// password reset
router.patch('/api/v1/reqest/password/reset', asyncErrorHandle(requestPasswordReset))
router.put('/api/v1/validate/password/reset', asyncErrorHandle(resetPassword))

// aditional requests
router.delete("/api/v1/delete/user", asyncErrorHandle(deleteUser))

module.exports = router