const User = require('../models/User.model')
const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')
const createError = require('http-errors');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(400, 'missing credentials');
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found');
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid password');
            } else {
              req.session.user = user;
              //res.cookie('foo', 'bar')
              res.json(user)
            }
          })
      }
    })
    .catch(next);
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json();
}

module.exports.register = (req, res, next) => {
  const user = new User(req.body)

  user.save()
    .then(user => res.status(201).json(user))
    .catch(next)
}

module.exports.getMatches = (req, res, next) => {
  const id = req.currentUser.id
  const LikePromise = Like.find({user: id}).populate('userLiked')
  const LikedPromise = Like.find({userLiked: id}).populate('user')

  Promise.all([LikePromise, LikedPromise])
    .then(([likes, likeds]) => {
      const matches = likeds.filter(({user}) => likes.map(like => like.userLiked).includes(user))
      res.json(matches)
    })
    .catch(next)
}

module.exports.getRandomUser = (req, res, next) => {
  const id = req.currentUser.id
  const LikePromise = Like.find({user: id}).populate('userLiked')
  const DislikedPromise = Dislike.find({user: id}).populate('userDisliked')

  Promise.all([LikePromise, DislikedPromise])
    .then(([likes, dislikes]) => {
      User.find()
        .then(users => {
          const randomUsers = users.filter(user => !likes.includes(user) && !dislikes.includes(user))
          const random = Math.floor(Math.random() * randomUsers.length)
          res.json(randomUsers[random])
        })
    })
}
