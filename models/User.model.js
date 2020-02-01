const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Like = require('./Like.model')
const Dislike = require('./Dislike.model')
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const genders = ['Male', 'Female']
const genderPreference = ['Male', 'Female', 'All']

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
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
      enum: genderPreference,
      default: 'All'
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
      max: 50,
      default: 50
    }
  },
  avatar: String
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

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

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
