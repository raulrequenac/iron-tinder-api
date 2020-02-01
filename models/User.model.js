const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Like = require('./Like.model')
const Dislike = require('./Dislike.model')

const genders = ['Male', 'Female']
const genderPreference = ['Male, Female, All']

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: email,
    required: true
  },
  password: {
    type: password,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  description: String,
  gender: {
    type: String,
    enum: genders
  },
  preferences: {
    gender: {
      type: String,
      enum: genderPreference
    },
    ageRange: {
      min: {
        type: Number,
        min: 18,
        default: 18
      },
      max: {
        type: Number,
        min: 18,
        default: 90
      }
    },
    locationRadius: {
      type: Number,
      min: 10,
      max: 50
    }
  }
}, {
  timestamps:true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

userSchema.virtual('like', {
  ref: Like.modelName,
  localField: 'id',
  foreignField: 'user'
})

userSchema.virtual('dislike', {
  ref: Like.modelName,
  localField: 'id',
  foreignField: 'user'
})

const user = new mongoose.model('User', userSchema)

module.exports = user
