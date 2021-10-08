require('dotenv').config()

const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports.protect = (req, res, next) => {
  const { jwt: token } = req.cookies

  if (!token) {
    return res.redirect('/signup')
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.redirect('/signup')
    }

    next()
  })
}

module.exports.getUser = (req, res, next) => {
  const { jwt: token } = req.cookies

  if (!token) {
    res.locals.user = null
    return next()
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    if (err) {
      res.locals.user = null
      return next()
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      res.locals.user = null
      return next()
    }

    res.locals.user = user
    next()
  })
}
