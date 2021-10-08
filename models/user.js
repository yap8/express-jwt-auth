const { validate: validateEmail } = require('email-validator')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [validateEmail, 'please enter a valid email'],
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = model('User', userSchema)
