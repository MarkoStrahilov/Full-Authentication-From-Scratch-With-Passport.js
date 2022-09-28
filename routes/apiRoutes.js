const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// auth functions
const { register, validateToken } = require('../controllers/register')
const { signIn } = require('../controllers/signIn')

// registration
router.post('/api/v1/register/user', asyncErrorHandle(register))
router.get('/register/new/user', asyncErrorHandle(validateToken))

// sign in
router.post('/api/v1/sign-in/user', asyncErrorHandle(signIn))

module.exports = router