const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// auth functions
const { getRegistration, getSignIn, successPage } = require('../controllers/authRender')

const { register, validateToken } = require('../controllers/register')
const { signIn } = require('../controllers/signIn')

// get all routes

router.get('/register', asyncErrorHandle(getRegistration))

router.get('/sign-in', asyncErrorHandle(getSignIn))

router.get('/success', asyncErrorHandle(successPage))

// registration
router.post('/api/v1/register/user', asyncErrorHandle(register))

router.get('/register/new/user', asyncErrorHandle(validateToken))

// sign in
router.post('/api/v1/sign-in/user', asyncErrorHandle(signIn))

module.exports = router