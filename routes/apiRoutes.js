const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// require functions
const { register, validateToken } = require('../controllers/register')
const { signIn, signOut } = require('../controllers/signIn')
const { resetPassword, requestPasswordReset } = require('../controllers/passwordReset')
const { deleteUser, disableAccount } = require("../controllers/user")
const { sendMessage } = require("../controllers/messages")

// registration / account validation
router.post('/api/v1/register/user', asyncErrorHandle(register))
router.get('/api/v1/register/validation/user', asyncErrorHandle(validateToken))

// sign in / out
router.post('/api/v1/sign-in/user', asyncErrorHandle(signIn))
router.post('/api/v1/sign-out/user', asyncErrorHandle(signOut))

// password reset
router.patch('/api/v1/reqest/password/reset', asyncErrorHandle(requestPasswordReset))
router.put('/api/v1/validate/password/reset', asyncErrorHandle(resetPassword))

// delete & deactivate user
router.delete("/api/v1/delete/user", asyncErrorHandle(deleteUser))
router.delete("/api/v1/disable/account", asyncErrorHandle(disableAccount))

// messages routes
router.post('/api/v1/create/message', asyncErrorHandle(sendMessage))

module.exports = router