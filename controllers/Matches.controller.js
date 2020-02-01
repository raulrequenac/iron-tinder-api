const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')

module.exports.like = (req) => {
  const localId = req.currentUser.id
  const userId = req.params.id

  Like.save({user: localId, userLiked: userId})
    .then(like => res.status(201).json(like))
  .catch(next)
}

module.exports.dislike = (req, res, next) => {
  const localId = req.currentUser.id
  const userId = req.params.id

  Dislike.save({user: localId, userDisliked: userId})
    .then(dislike => res.status(201).json(dislike))
  .catch(next)
}
