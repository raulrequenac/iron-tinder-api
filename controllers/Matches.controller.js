const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')

module.exports.getMatches = (req, res, next) => {
  const id = req.currentUser.id
  const LikePromise = Like.find({user: id}).populate('userLiked')
  const LikedPromise = Like.find({userLiked: id}).populate('user')

  Promise.all([LikePromise, LikedPromise])
    .then(([likes, likeds]) => {
      const matches = likeds.map(({user}) => user).filter(user => likes.map(({userLiked}) => userLiked.id).includes(user.id))
      res.json(matches)
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const params = {user: req.currentUser.id, userLiked: req.params.id}
  const like = new Like(params)
  
  like.save()
    .then(like => res.status(201).json(like))
  .catch(next)
}

module.exports.dislike = (req, res, next) => {
  const params = {user: req.currentUser.id, userDisliked: req.params.id}
  const dislike = new Dislike(params)

  dislike.save()
    .then(dislike => res.status(201).json(dislike))
  .catch(next)
}
