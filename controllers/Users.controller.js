const User = require('../models/User.model')
const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')
const createError = require('http-errors');

module.exports.getUsers = (_, res, next) => {
  User.find()
    .then(users => res.json(users))
    .catch(next)
}

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

module.exports.getRandomUser = (req, res, next) => {
  const id = req.currentUser.id
  const LikePromise = Like.find({user: id})
  const DislikedPromise = Dislike.find({user: id})
  const UserPromise = User.find()

  Promise.all([UserPromise, LikePromise, DislikedPromise])
    .then(([users, likes, dislikes]) => {
      //usersLiked && usersDisliked no se hacen únicos
      const usersLiked = likes.map(({userLiked}) => userLiked).filter((user, i, arr) => arr.indexOf(user)===i)
      const usersDisliked = dislikes.map(({userDisliked}) => userDisliked).filter((user, i, arr) => arr.indexOf(user)===i)
      console.log('usersLiked', usersLiked)
      console.log('usersDisliked', usersDisliked)
      //randomUsers no descarta los usersLikeds & usersDisliked
      const randomUsers = users.filter(user => !usersLiked.includes(user.id) || !usersDisliked.includes(user.id))
      console.log('randomUsers', randomUsers)
      const random = Math.floor(Math.random() * randomUsers.length)
      res.json(randomUsers[random])
    })
}
