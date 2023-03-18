const express = require('express');
const router = express.Router();
const {createUser, getUserByAuth0Id, getUserByAuth0Token} = require('../models/user')

// マイページでユーザー情報を取得する用
router.get('/', async(req, res) => {
  const {token} = req.auth
  const user = await getUserByAuth0Token(token)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

// Auth0からのコールバック時にAuth0のidからuserIdを取得する用。
router.get('/auth/:id', async(req, res) => {
  const user = await getUserByAuth0Id(req.params.id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

router.post('/signup', async(req, res, next) => {
  const user = await createUser(req.body.user)
  res.json({user});
});

module.exports = router;