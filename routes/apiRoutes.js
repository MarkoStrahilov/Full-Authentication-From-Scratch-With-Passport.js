const express = require('express');
const router = express.Router({ mergeParams: true });

// middlware
const { asyncErrorHandle } = require('../middleware')

// auth functions
const { getRegistration, getSignIn, successPage } = require('../controllers/auth')

router.get('/register', asyncErrorHandle(getRegistration))

router.get('/sign-in', asyncErrorHandle(getSignIn))

router.get('/success', asyncErrorHandle(successPage))

module.exports = router