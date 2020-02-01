const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('./cloudinary.config');
const UsersController = require('../controllers/Users.controller')
const MatchesController = require('../controllers/Matches.controller')

router.post('/login', UsersController.login)
router.post('/logout', UsersController.logout)

router.post('/users/register', , UsersController.register)
router.get('/users/matches', UsersController.getMatches)
router.get('/users', UsersController.getRandomUser)

router.post('/users/:id/like', MatchesController.like)
router.post('/users/:id/dislike', MatchesController.dislike)

module.exports = router;
