const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// auth functions
const { register, validateToken } = require('../controllers/register')
const { signIn, signOut } = require('../controllers/signIn')

// registration
router.post('/api/v1/register/user', asyncErrorHandle(register))
router.get('/api/v1/register/validation/user', asyncErrorHandle(validateToken))

// sign 
router.post('/api/v1/sign-in/user', asyncErrorHandle(signIn))
router.post('/api/v1/sign-out/user', asyncErrorHandle(signOut))

module.exports = router