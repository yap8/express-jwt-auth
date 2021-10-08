require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')

const {
  protect,
  getUser
} = require('./middleware/authMiddleware')

const app = express()

mongoose.connect(process.env.DB_URI)
  .then(() => console.log('db connected'))
  .then(() => app.listen(3000))
  .then(() => console.log('server started'))
  .catch(err => console.log(err))

// view engine
app.set('view engine', 'ejs')

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(expressLayouts)
app.use(cookieParser())

// routes
app.get('*', getUser)
app.get('/', protect, (req, res) => res.render('index'))
app.get('/home', protect, (req, res) => res.render('index'))

// auth routes
app.use(require('./routes/authRoutes'))

// 404 page
app.use((req, res) => res.render('404'))
