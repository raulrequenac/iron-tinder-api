const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userLiked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const like = new mongoose.model('Like', LikeSchema)

module.exports = like

