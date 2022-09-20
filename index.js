const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')
const apiRoutes = require('./routes/apiRoutes')

const CustomError = require('./CustomError')
const path = require('path')
const app = express()
const port = 3030

app.listen(port, () => {
    console.log(`running on port ${port}...`)
})

mongoose.connect('mongodb://localhost:27017/full-auth', { useNewUrlParser: true, })
    .then(() => {
        console.log('database connected')
    }).catch(err => {
        console.log('mongoose error connection', err)
    })

// middleware

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionOptions = {
    secret: 'thisisnotagoodsecrettohave',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionOptions));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
})


app.use('/', apiRoutes)

app.all('*', (req, res, next) => {
    next(new CustomError('ERROR', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    res.status(status).render('error', { err });
})