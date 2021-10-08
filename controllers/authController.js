require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const handleErrors = (err) => {
  if (typeof err === 'string') return [err]
  if (err.code === 11000) return ['user with such email already exists']

  const { errors } = err

  return Object.keys(errors).map(error => errors[error].message)
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_AGE
  })
}

const locals = {
  errors: [],
  email: '',
  password: ''
}

module.exports.signup_get = (req, res) => res.render('signup', locals)
module.exports.login_get = (req, res) => res.render('login', locals)

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body

  try {
    if (password.length < 6) throw 'password should be at least 6 characters long'

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({
      email,
      password: hash
    })

    const token = createToken(user.id)

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: process.env.TOKEN_AGE * 1000
    }).redirect('/')
  } catch (err) {
    const errors = handleErrors(err)

    res.render('signup', {
      errors,
      email,
      password
    })
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) throw 'no user with such email'

    const match = await bcrypt.compare(password, user.password)

    if (!match) throw 'email or password do not match'

    const token = createToken(user.id)

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: process.env.TOKEN_AGE * 1000
    }).redirect('/')
  } catch (err) {
    const errors = handleErrors(err)

    res.render('login', {
      errors,
      email,
      password
    })
  }
}

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0
  }).redirect('/signup')
}
