const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DislikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userDisliked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const dislike = new mongoose.model('Dislike', DislikeSchema)

module.exports = dislike
