const router = require('express').Router()
const {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout
} = require('../controllers/authController')

router.get('/signup', signup_get)
router.get('/login', login_get)

router.post('/signup', signup_post)
router.post('/login', login_post)

router.use('/logout', logout)

module.exports = router
