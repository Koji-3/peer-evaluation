const express = require('express');
const router = express.Router();
const {createUser, getUserbyAuth0Id} = require('../models/user')

router.get('/auth/:id', async(req, res) => {
  const user = await getUserbyAuth0Id(req.params.id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});
// TODO: マイページ用にidでuserを取得する

router.post('/signup', async(req, res, next) => {
  const user = await createUser(req.body.user)
  res.json({user});
});


module.exports = router;